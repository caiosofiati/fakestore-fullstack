import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async findAll(userId: number): Promise<CartItem[]> {
    try {
      console.log(
        `🛒 [CartService] Lendo itens do Carrinho Local (SQLite) para o Usuário ID ${userId}...`,
      );

      const internalItems = await this.prisma.cartItem.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return internalItems;
    } catch {
      return [];
    }
  }

  async findOne(id: number, userId: number): Promise<CartItem> {
    const item = await this.prisma.cartItem.findUnique({ where: { id } });
    if (!item || item.userId !== userId) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }
    return item;
  }

  async create(dto: CreateCartItemDto): Promise<CartItem> {
    const existing = await this.prisma.cartItem.findFirst({
      where: { productId: dto.productId, userId: dto.userId as number },
    });

    if (existing) {
      // If already in cart for THIS user, increment quantity instead
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + (dto.quantity || 1) },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        ...dto,
        userId: dto.userId as number,
      },
    });
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateCartItemDto,
  ): Promise<CartItem> {
    await this.findOne(id, userId);
    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity: dto.quantity },
    });
  }

  async remove(id: number, userId: number): Promise<CartItem> {
    await this.findOne(id, userId);
    return this.prisma.cartItem.delete({ where: { id } });
  }

  async clear(userId: number): Promise<{ count: number }> {
    const result = await this.prisma.cartItem.deleteMany({
      where: { userId },
    });
    return { count: result.count };
  }

  async getTotal(userId: number): Promise<number> {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
    });
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
