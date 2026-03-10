import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  findAll(@Req() req: Request & { user: { sub: number } }) {
    return this.cartService.findAll(req.user.sub);
  }

  @Get('total')
  getTotal(@Req() req: Request & { user: { sub: number } }) {
    return this.cartService.getTotal(req.user.sub);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() req: Request & { user: { sub: number } },
    @Body() createDto: CreateCartItemDto,
  ) {
    createDto.userId = req.user.sub;
    return this.cartService.create(createDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: { sub: number } },
    @Body() updateDto: UpdateCartItemDto,
  ) {
    return this.cartService.update(id, req.user.sub, updateDto);
  }

  @Delete('clear')
  @HttpCode(HttpStatus.OK)
  clear(@Req() req: Request & { user: { sub: number } }) {
    return this.cartService.clear(req.user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: { sub: number } },
  ) {
    return this.cartService.remove(id, req.user.sub);
  }
}
