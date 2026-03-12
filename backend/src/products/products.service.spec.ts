import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ProductsService } from './products.service';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { HttpException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpService: HttpService;

  const mockProducts = [
    {
      id: 1,
      title: 'Test Product',
      price: 29.99,
      description: 'A test product',
      category: 'test',
      image: 'https://example.com/img.png',
      rating: { rate: 4.5, count: 100 },
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const response = {
        data: mockProducts,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      } as unknown as AxiosResponse<any>;

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(response));

      const result = await service.findAll();
      expect(result).toEqual(mockProducts);
    });

    it('should throw HttpException when API is unavailable', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(() => new Error('Network Error')));

      await expect(service.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const response = {
        data: mockProducts[0],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      } as unknown as AxiosResponse<any>;

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(response));

      const result = (await service.findOne(1)) as Record<string, unknown>;
      expect(result).toEqual(mockProducts[0]);
    });

    it('should throw HttpException when product not found', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(throwError(() => new Error('Not Found')));

      await expect(service.findOne(999)).rejects.toThrow(HttpException);
    });
  });

  describe('create', () => {
    it('should create a new product with an incremental ID', async () => {
      const existingProductsResponse = {
        data: mockProducts,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      } as unknown as AxiosResponse<any>;

      const createResponse = {
        data: { id: 21 }, // FakeStore always returns 21
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() },
      } as unknown as AxiosResponse<any>;

      jest
        .spyOn(httpService, 'get')
        .mockReturnValueOnce(of(existingProductsResponse));
      jest.spyOn(httpService, 'post').mockReturnValueOnce(of(createResponse));

      const newProductData = {
        title: 'New Product',
        price: 19.99,
        description: 'New Description',
        category: 'new',
        image: 'https://example.com/new.png',
      };

      const result = await service.create(newProductData);

      // mockProducts has max id: 1, so new product should have id: 2
      expect(result.id).toBe(2);
      expect(result.title).toBe(newProductData.title);
    });
  });
});
