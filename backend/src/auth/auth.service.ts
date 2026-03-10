import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private httpService: HttpService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, pass: string) {
    try {
      console.log(
        `🔐 [AuthService] Enviando POST com credenciais reais de '${username}' para FakeStore API (/auth/login)...`,
      );
      // Autentica diretamente com a FakeStore API
      await firstValueFrom(
        this.httpService.post<{ token: string }>(
          'https://fakestoreapi.com/auth/login',
          {
            username,
            password: pass,
          },
        ),
      );

      // Autenticamos com sucesso na FakeStore.
      // Não precisamos do token deles, pois emitiremos o nosso próprio JWT seguro.

      // Busca o perfil completo do usuário no nosso banco/API interna
      const user = await this.usersService.findOne(username);
      if (!user) {
        throw new UnauthorizedException('Perfil de usuário não encontrado');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user as {
        password?: string;
        id?: number;
        [key: string]: unknown;
      };

      const role = userWithoutPassword.id === 1 ? 'ADMIN' : 'USER';
      const payload = { sub: userWithoutPassword.id, username, role };

      console.log(
        `✅ [AuthService] Login aceito pela API externa! Gerando JWT Local Seguro (Role: ${role}) para '${username}'...`,
      );

      const localToken = await this.jwtService.signAsync(payload);

      // Retorna o token local e o usuário para uso no Frontend
      return {
        token: localToken,
        user: {
          ...userWithoutPassword,
          role,
        },
      };
    } catch {
      throw new UnauthorizedException('Credenciais inválidas na FakeStore API');
    }
  }
}
