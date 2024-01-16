import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ERole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'Akashi christian' })
  fullName: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, default: '0781273704' })
  phone: string;
  @IsNotEmpty()
  @IsEnum(ERole)
  @ApiProperty({ required: true, enum: ERole })
  role: ERole;
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  password: string;
  @IsOptional()
  @ApiPropertyOptional({ type: String, required: true, default: 'Kigali' })
  district?: string;
  @IsOptional()
  @ApiPropertyOptional({ type: String, required: true, default: 'Gasabo' })
  sector?: string;
  @IsOptional()
  @ApiPropertyOptional({ type: String, required: true, default: 'Karururma' })
  cell?: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, default: '0781273704' })
  phone: string;
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  password: string;
}
