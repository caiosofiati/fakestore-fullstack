import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [HttpModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
