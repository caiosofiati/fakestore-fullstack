import { IsInt, IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateWishlistItemDto {
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

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;
}
