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
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FastifyRequest } from 'fastify';
import { ApiKeyGuard } from 'src/auth/guards/json-placeholder-api-key.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: FastifyRequest,
  ) {
    const user: User = req.user;
    const data = await this.tasksService.create(createTaskDto, user);
    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query() filterDto: FilterTaskDto, @Req() req: FastifyRequest) {
    const user: User = req.user;
    const data = await this.tasksService.findAll(filterDto, user);
    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: FastifyRequest,
  ) {
    const user: User = req.user;
    const data = await this.tasksService.findOne(id, user);
    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: FastifyRequest,
  ) {
    const user: User = req.user;
    const data = await this.tasksService.update(id, updateTaskDto, user);
    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: FastifyRequest,
  ) {
    const user: User = req.user;
    const data = await this.tasksService.remove(id, user);
    return {
      success: true,
      data,
    };
  }

  @Get('populate')
  @UseGuards(ApiKeyGuard)
  async populateTasks() {
    const data = await this.tasksService.populate();
    return {
      success: true,
      data,
    };
  }
}
