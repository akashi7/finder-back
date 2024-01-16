import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMissingChildDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'Kigali , nyarugenge' })
  location: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    default:
      'Lost on 12/12 please hb djhbvhjrbjh bjhv rbjkv brjlhkv rhjv rljhvr vlj',
  })
  message: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'http://' })
  imgSrc: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'Rwandan' })
  nationality: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    default: 'Jojo bizarre',
  })
  fullName: string;
}

export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    default: 'Found this kid jknjk bfjbvjhfbvjhrbvhrjbvrjhbvrjhvb',
  })
  notification: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    default: 'Jojo bizarre',
  })
  fullName: string;
}
