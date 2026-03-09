import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { AddPaymentLinkDto } from './dto/add-payment-link.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAll() {
    return this.tasksService.getAll();
  }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Post(':id/start')
  start(@Param('id') id: string) {
    return this.tasksService.start(id);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string) {
    return this.tasksService.complete(id);
  }

  @Post(':id/hold')
  hold(@Param('id') id: string) {
    return this.tasksService.hold(id);
  }

  @Post(':id/release')
  release(@Param('id') id: string) {
    return this.tasksService.release(id);
  }

  @Post(':id/payment-link')
  addPaymentLink(@Param('id') id: string, @Body() dto: AddPaymentLinkDto) {
    return this.tasksService.addPaymentLink(id, dto);
  }

  @Post(':id/confirm-payment')
  confirmPayment(@Param('id') id: string) {
    return this.tasksService.confirmPayment(id);
  }
}
