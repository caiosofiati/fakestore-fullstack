import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateWishlistItemDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;
}
