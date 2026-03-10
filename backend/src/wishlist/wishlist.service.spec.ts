import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('WishlistService', () => {
  let service: WishlistService;

  const mockPrismaService = {
    wishlistItem: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockWishlistItem = {
    id: 1,
    userId: 1,
    productId: 10,
    title: 'Test Product',
    price: 29.99,
    image: 'https://example.com/img.png',
    notes: null,
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of wishlist items', async () => {
      const mockWishlistItems = [mockWishlistItem];
      mockPrismaService.wishlistItem.findMany.mockResolvedValue(
        mockWishlistItems,
      );

      const result = await service.findAll(1);
      expect(result).toEqual(mockWishlistItems);
      expect(mockPrismaService.wishlistItem.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single wishlist item', async () => {
      mockPrismaService.wishlistItem.findUnique.mockResolvedValue(
        mockWishlistItem,
      );

      const result = await service.findOne(1, 1);
      expect(result).toEqual(mockWishlistItem);
      expect(mockPrismaService.wishlistItem.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if item not found', async () => {
      mockPrismaService.wishlistItem.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new wishlist item', async () => {
      mockPrismaService.wishlistItem.findFirst.mockResolvedValue(null);
      const dto = {
        userId: 1,
        productId: 3,
        title: 'New Product',
        price: 30,
        image: 'img3.jpg',
      };

      const mockCreated = { ...mockWishlistItem, id: 3, ...dto };
      mockPrismaService.wishlistItem.create.mockResolvedValue(
        mockCreated as any,
      );

      const result = await service.create(dto);
      expect(result).toEqual(mockCreated);
      expect(mockPrismaService.wishlistItem.create).toHaveBeenCalledWith({
        data: dto,
      });
    });

    it('should throw ConflictException if product already in wishlist', async () => {
      mockPrismaService.wishlistItem.findFirst.mockResolvedValue(
        mockWishlistItem,
      );
      const dto = {
        userId: 1,
        productId: 1,
        title: 'Product 1',
        price: 10,
        image: 'img1.jpg',
      };
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update a wishlist item', async () => {
      const updatedItem = { ...mockWishlistItem, notes: 'Updated notes' };
      mockPrismaService.wishlistItem.findUnique.mockResolvedValue(
        mockWishlistItem,
      );
      mockPrismaService.wishlistItem.update.mockResolvedValue(updatedItem);

      const dto = { notes: 'Updated notes' };
      const result = await service.update(1, 1, dto);
      expect(result).toEqual(updatedItem);
      expect(mockPrismaService.wishlistItem.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
    });

    it('should throw NotFoundException if item to update not found', async () => {
      mockPrismaService.wishlistItem.findUnique.mockResolvedValue(null);
      await expect(service.update(999, 1, { notes: 'notes' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a wishlist item', async () => {
      mockPrismaService.wishlistItem.findUnique.mockResolvedValue(
        mockWishlistItem,
      );
      mockPrismaService.wishlistItem.delete.mockResolvedValue(mockWishlistItem);

      const result = await service.remove(1, 1);
      expect(result).toEqual(mockWishlistItem);
      expect(mockPrismaService.wishlistItem.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if item to remove not found', async () => {
      mockPrismaService.wishlistItem.findUnique.mockResolvedValue(null);
      await expect(service.remove(999, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
