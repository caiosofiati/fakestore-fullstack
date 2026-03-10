import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Get('users')
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('users/:id')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Record<string, unknown>> {
    const user = (await this.usersService.findById(id)) as Record<
      string,
      unknown
    >;
    if (!user) throw new NotFoundException(`User ${id} not found`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...res } = user as {
      password?: string;
      [key: string]: unknown;
    };
    return res;
  }
}
