import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(private readonly httpService: HttpService) {}

  async findOne(username: string): Promise<Record<string, unknown> | null> {
    try {
      console.log(
        `📡 [UsersService] Consultando lista de usuários na FakeStore API para encontrar '${username}'...`,
      );
      const response = await firstValueFrom(
        this.httpService.get<Record<string, unknown>[]>(
          'https://fakestoreapi.com/users',
        ),
      );
      const user = response.data.find((u) => u.username === username);
      if (!user) return null;
      console.log(
        `👤 [UsersService] Usuário FakeStore Encontrado: ID ${String(user.id)} - ${String(user.email)}`,
      );
      return user;
    } catch {
      return null;
    }
  }

  async findById(id: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<any>(`https://fakestoreapi.com/users/${id}`),
      );
      return response.data;
    } catch {
      return null;
    }
  }

  async create(data: Record<string, any>): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<any>('https://fakestoreapi.com/users', data),
      );
      return response.data;
    } catch {
      throw new Error('Falha ao criar usuário na FakeStore API');
    }
  }

  async findAll(): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<any[]>('https://fakestoreapi.com/users'),
      );
      return response.data;
    } catch {
      return [];
    }
  }
}
