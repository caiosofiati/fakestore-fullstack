import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Req() req: Request & { user: { sub: number } }) {
    return this.ordersService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: { sub: number } },
  ) {
    return this.ordersService.findOne(id, req.user.sub);
  }

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  checkout(@Req() req: Request & { user: { sub: number } }) {
    return this.ordersService.checkout(req.user.sub);
  }
}
