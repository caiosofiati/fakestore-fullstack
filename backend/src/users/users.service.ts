import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

interface FakeStoreUser {
  id: number;
  email: string;
  username: string;
  password?: string;
  name?: {
    firstname: string;
    lastname: string;
  };
  address?: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
  };
  phone?: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async findOne(username: string): Promise<FakeStoreUser | null> {
    try {
      console.log(
        `📡 [UsersService] Consultando lista de usuários na FakeStore API para encontrar '${username}'...`,
      );
      const response = await firstValueFrom(
        this.httpService.get<FakeStoreUser[]>(
          'https://fakestoreapi.com/users',
        ),
      );
      const user = response.data.find((u) => u.username === username);
      if (!user) return null;
      console.log(
        `👤 [UsersService] Usuário FakeStore Encontrado: ID ${user.id} - ${user.email}`,
      );
      return user;
    } catch {
      return null;
    }
  }

  async upsertLocalUser(externalUser: FakeStoreUser): Promise<User> {
    try {
      console.log(
        `💾 [UsersService] Sincronizando usuário ID ${externalUser.id} (${externalUser.username}) com banco de dados local...`,
      );

      // Mapping FakeStore API user structure to our local User model
      const userData = {
        id: externalUser.id,
        email: externalUser.email,
        username: externalUser.username,
        password: externalUser.password || '', // We store original pass for proxy compatibility
        firstname: externalUser.name?.firstname || 'User',
        lastname: externalUser.name?.lastname || '',
        city: externalUser.address?.city || '',
        street: externalUser.address?.street || '',
        number: externalUser.address?.number || 0,
        zipcode: externalUser.address?.zipcode || '',
        phone: externalUser.phone || '',
        role: externalUser.id === 1 ? 'ADMIN' : 'USER',
      };

      return await this.prisma.user.upsert({
        where: { id: externalUser.id },
        update: userData,
        create: userData,
      });
    } catch (error: any) {
      console.error(
        `❌ [UsersService] Falha ao sincronizar usuário local:`,
        error.message || error,
      );
      throw error;
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
