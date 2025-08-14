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
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: FastifyRequest) {
    const user: User = req.user;
    return this.tasksService.create(createTaskDto, user);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() filterDto: FilterTaskDto, @Req() req: FastifyRequest) {
    const user: User = req.user;
    return this.tasksService.findAll(filterDto, user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: FastifyRequest) {
    const user: User = req.user;
    return this.tasksService.findOne(id, user);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: FastifyRequest,
  ) {
    const user: User = req.user;
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: FastifyRequest) {
    const user: User = req.user;
    return this.tasksService.remove(id, user);
  }

  @Get('populate')
  @UseGuards(ApiKeyGuard)
  populateTasks() {
    return this.tasksService.populate();
  }
}
