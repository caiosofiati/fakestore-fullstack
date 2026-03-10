import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order || order.userId !== userId) {
      throw new BadRequestException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async checkout(userId: number): Promise<Order> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException(
        'Cart is empty. Add items before checkout.',
      );
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Create order with items in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          total: Math.round(total * 100) / 100,
          status: 'completed',
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              title: item.title,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // Clear the cart for this user after successful order
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    return order;
  }
}
