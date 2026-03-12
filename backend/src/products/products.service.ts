import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface Product {
  id: number;
  [key: string]: any;
}

@Injectable()
export class ProductsService {
  // Variável em memória para simular persistência já que a FakeStoreAPI não salva as alterações no banco deles.
  private memoryCache: Map<number, Product> = new Map();
  private deletedIds: Set<number> = new Set();

  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<Product[]> {
    try {
      console.log(
        '📡 [ProductsService] Buscando todos os produtos diretamente da FakeStore API (Proxy Externo)...',
      );
      const response = await firstValueFrom(
        this.httpService.get<Product[]>('https://fakestoreapi.com/products'),
      );

      // Remove os itens deletados localmente da lista que veio da API
      const baseProducts = response.data.filter(
        (p) => !this.deletedIds.has(p.id),
      );

      // Substitui os itens que vieram da API pelas versões que estão cacheadas em memória
      const finalProducts = baseProducts.map((p) =>
        this.memoryCache.has(p.id) ? this.memoryCache.get(p.id)! : p,
      );

      // Adiciona na lista os novos produtos criados (que só existem no nosso cache local)
      const baseIds = new Set(baseProducts.map((p) => p.id));
      for (const [id, product] of this.memoryCache.entries()) {
        if (!baseIds.has(id)) {
          finalProducts.push(product);
        }
      }

      // Ordena por ID para manter a consistência da API original
      finalProducts.sort((a, b) => a.id - b.id);

      console.log(
        `📦 [ProductsService] Recebido ${response.data?.length} produtos da API externa (e mesclado com cache local ${this.memoryCache.size} modificados/criados - ${this.deletedIds.size} deletados)!`,
      );
      return finalProducts;
    } catch {
      throw new HttpException(
        'Falha ao buscar produtos da FakeStore API',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number): Promise<Product> {
    if (this.deletedIds.has(Number(id))) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    if (this.memoryCache.has(Number(id))) {
      return this.memoryCache.get(Number(id))!;
    }

    try {
      console.log(
        `📡 [ProductsService] Buscando detalhes do produto ID ${id} na FakeStore API...`,
      );
      const response = await firstValueFrom(
        this.httpService.get<Product>(
          `https://fakestoreapi.com/products/${id}`,
        ),
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

  async create(data: Record<string, any>): Promise<Product> {
    try {
      await firstValueFrom(
        this.httpService.post<Product>(
          'https://fakestoreapi.com/products',
          data,
        ),
      );

      // A FakeStore API sempre retorna id: 21 no POST. Criamos um nosso para evitar colisão na memória:
      const allProducts = await this.findAll();
      const maxId = allProducts.reduce(
        (max, p) => (p.id > max ? p.id : max),
        0,
      );
      const newProduct: Product = { ...data, id: maxId + 1 };
      this.memoryCache.set(newProduct.id, newProduct);
      return newProduct;
    } catch {
      throw new Error('Falha ao criar produto na FakeStore API');
    }
  }

  async update(id: number, data: Record<string, any>): Promise<Product> {
    const numId = Number(id);
    if (this.deletedIds.has(numId)) {
      throw new NotFoundException(`Produto com ID ${numId} não encontrado`);
    }

    try {
      await firstValueFrom(
        this.httpService.put<Product>(
          `https://fakestoreapi.com/products/${numId}`,
          data,
        ),
      );

      let existingProduct = this.memoryCache.get(numId);
      if (!existingProduct) {
        // Se ainda não está no cache, temos que buscar na API para mesclar as alterações apenas nelas
        const res = await firstValueFrom(
          this.httpService.get<Product>(
            `https://fakestoreapi.com/products/${numId}`,
          ),
        );
        existingProduct = res.data;
      }

      const updatedProduct: Product = {
        ...existingProduct,
        ...data,
        id: numId,
      };
      this.memoryCache.set(numId, updatedProduct);
      return updatedProduct;
    } catch {
      throw new Error('Falha ao atualizar produto na FakeStore API');
    }
  }

  async remove(id: number): Promise<Product> {
    const numId = Number(id);
    if (this.deletedIds.has(numId)) {
      throw new NotFoundException(`Produto com ID ${numId} não encontrado`);
    }

    try {
      const response = await firstValueFrom(
        this.httpService.delete<Product>(
          `https://fakestoreapi.com/products/${numId}`,
        ),
      );

      // Adiciona o item aos removidos e remove do cache local (se houver)
      this.deletedIds.add(numId);
      this.memoryCache.delete(numId);

      return response.data;
    } catch {
      throw new Error('Falha ao deletar produto na FakeStore API');
    }
  }
}
