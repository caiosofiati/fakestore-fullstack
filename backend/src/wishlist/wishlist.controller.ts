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
import { WishlistService } from './wishlist.service';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';
import { UpdateWishlistItemDto } from './dto/update-wishlist-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  findAll(@Req() req: Request & { user: { sub: number } }) {
    return this.wishlistService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: { sub: number } },
  ) {
    return this.wishlistService.findOne(id, req.user.sub);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() req: Request & { user: { sub: number } },
    @Body() createDto: CreateWishlistItemDto,
  ) {
    createDto.userId = req.user.sub;
    return this.wishlistService.create(createDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: { sub: number } },
    @Body() updateDto: UpdateWishlistItemDto,
  ) {
    return this.wishlistService.update(id, req.user.sub, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: { sub: number } },
  ) {
    return this.wishlistService.remove(id, req.user.sub);
  }
}
