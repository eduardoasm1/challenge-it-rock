import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { Task } from './entity/task.entity';
import { User } from 'src/user/entity/user.entity';
import { Role } from 'src/user/dto/user.dto';
import { JsonPlaceholderService } from 'src/json-placeholder/json-placeholder.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly jsonPlaceholderService: JsonPlaceholderService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    this.logger.log('Creating new task');
    const newTask = this.taskRepository.create({
      ...createTaskDto,
      user,
    });
    return this.taskRepository.save(newTask);
  }

  async findAll(filterDto: FilterTaskDto, user: User) {
    this.logger.log('Find tasks by user:', user.userName);
    const { priority, completed, page, limit } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');

    query.where('task.user.id = :user', { user: user.id });

    if (priority) {
      query.andWhere('task.priority = :priority', { priority });
    }

    if (completed) {
      query.andWhere('task.completed = :completed', {
        completed: completed === 'true',
      });
    }

    const skip = (page! - 1) * limit!;
    query.skip(skip).take(limit);

    const [tasks, total] = await query.getManyAndCount();

    return {
      data: tasks,
      count: total,
      page,
      limit,
    };
  }

  async findOne(id: string, user: User): Promise<Task> {
    this.logger.log('Find task by user:', user.userName);

    const task = await this.taskRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['user'],
    });
    if (!task) {
      throw new NotFoundException(
        `Task with ID "${id}" not found or does not belong to the user.`,
      );
    }
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    this.logger.log('Update task by user:', user.userName);
    const task = await this.findOne(id, user);

    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: string, user: User): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    const isOwner = task.user.id === user.id;
    const isAdmin = user.roles.includes(Role.ADMIN);

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to delete this task.',
      );
    }

    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
  }

  async populate(): Promise<{ count: number }> {
    const externalTodos = await this.jsonPlaceholderService.fetchTodos();

    const externalTitles = externalTodos.map((todo) => todo.title);

    const existingTasks = await this.taskRepository.find({
      where: { title: In(externalTitles) },
    });
    const existingTitles = new Set(existingTasks.map((task) => task.title));

    const newTodos = externalTodos.filter(
      (todo) => !existingTitles.has(todo.title),
    );

    if (newTodos.length === 0) {
      return { count: 0 };
    }

    const tasksToSave = newTodos.map((todo) => {
      return this.taskRepository.create({
        title: todo.title,
        completed: todo.completed,
        description: 'Tarea importada desde JSONPlaceholder.',
      });
    });

    await this.taskRepository.save(tasksToSave);

    return { count: tasksToSave.length };
  }
}
