import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { User } from 'src/user/entity/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { FastifyRequest } from 'fastify';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: FastifyRequest) {
    const user: User = req.user;
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  findAll(@Query() filterDto: FilterTaskDto, @Req() req: FastifyRequest) {
    const user: User = req.user;
    return this.tasksService.findAll(filterDto, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: FastifyRequest) {
    const user: User = req.user;
    return this.tasksService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: FastifyRequest,
  ) {
    const user: User = req.user;
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: FastifyRequest) {
    const user: User = req.user;
    return this.tasksService.remove(id, user);
  }
}
