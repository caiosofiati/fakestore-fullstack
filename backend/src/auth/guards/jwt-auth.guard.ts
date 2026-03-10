import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.warn(
        `\n🚫 [JwtAuthGuard] Acesso Negado em ${request.url}: Header Ausente`,
      );
      throw new UnauthorizedException('Token não encontrado');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: number;
        username: string;
        role: string;
      }>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      (request as Request & { user: any }).user = payload;

      console.log(
        `\n🟢 [JwtAuthGuard] Autorizado (${request.method} ${request.url}): JWT Válido para Usuario ID ${payload.sub} (${payload.username})`,
      );
    } catch {
      console.error(
        `\n❌ [JwtAuthGuard] JWT Recusado (Inválido/Expirado) tentou acessar: ${request.url}`,
      );
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
