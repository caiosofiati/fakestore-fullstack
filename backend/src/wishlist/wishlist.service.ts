import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';
import { UpdateWishlistItemDto } from './dto/update-wishlist-item.dto';
import { WishlistItem } from '@prisma/client';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number): Promise<WishlistItem[]> {
    return this.prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number): Promise<WishlistItem> {
    const item = await this.prisma.wishlistItem.findUnique({ where: { id } });
    if (!item || item.userId !== userId) {
      throw new NotFoundException(`Wishlist item with ID ${id} not found`);
    }
    return item;
  }

  async create(dto: CreateWishlistItemDto): Promise<WishlistItem> {
    const existing = await this.prisma.wishlistItem.findFirst({
      where: { productId: dto.productId, userId: dto.userId as number },
    });

    if (existing) {
      throw new ConflictException(
        `Product ${dto.productId} is already in the wishlist`,
      );
    }

    return this.prisma.wishlistItem.create({
      data: {
        ...dto,
        userId: dto.userId as number,
      },
    });
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateWishlistItemDto,
  ): Promise<WishlistItem> {
    await this.findOne(id, userId);
    return this.prisma.wishlistItem.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number): Promise<WishlistItem> {
    await this.findOne(id, userId);
    return this.prisma.wishlistItem.delete({ where: { id } });
  }
}
