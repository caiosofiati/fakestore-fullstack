import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<any[]> {
    try {
      console.log(
        '📡 [ProductsService] Buscando todos os produtos diretamente da FakeStore API (Proxy Externo)...',
      );
      const response = await firstValueFrom(
        this.httpService.get<any[]>('https://fakestoreapi.com/products'),
      );
      console.log(
        `📦 [ProductsService] Recebido ${response.data?.length} produtos da API externa!`,
      );
      return response.data;
    } catch {
      throw new HttpException(
        'Falha ao buscar produtos da FakeStore API',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      console.log(
        `📡 [ProductsService] Buscando detalhes do produto ID ${id} na FakeStore API...`,
      );
      const response = await firstValueFrom(
        this.httpService.get<any>(`https://fakestoreapi.com/products/${id}`),
      );
      if (!response.data) throw new NotFoundException();
      console.log(
        `📦 [ProductsService] Detalhes recebidos:`,
        JSON.stringify(response.data).substring(0, 100),
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as Record<string, Record<string, unknown>>;
      if (
        (err?.response && err.response?.status === 404) ||
        error instanceof NotFoundException
      ) {
        throw new NotFoundException(`Produto com ID ${id} não encontrado`);
      }
      throw new HttpException(
        'Falha ao buscar produto da FakeStore API',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(data: Record<string, any>): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<any>('https://fakestoreapi.com/products', data),
      );
      return response.data;
    } catch {
      throw new Error('Falha ao criar produto na FakeStore API');
    }
  }

  async update(id: number, data: Record<string, any>): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.put<any>(
          `https://fakestoreapi.com/products/${id}`,
          data,
        ),
      );
      return response.data;
    } catch {
      throw new Error('Falha ao atualizar produto na FakeStore API');
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.delete<any>(`https://fakestoreapi.com/products/${id}`),
      );
      return response.data;
    } catch {
      throw new Error('Falha ao deletar produto na FakeStore API');
    }
  }
}
