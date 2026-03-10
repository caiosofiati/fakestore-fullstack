import { IsInt, IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsInt()
  productId!: number;

  @IsString()
  title!: string;

  @IsNumber()
  price!: number;

  @IsString()
  image!: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  quantity?: number;
}
