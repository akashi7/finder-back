import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GenericResponse } from 'src/__shared__/dto';
import { ChildrenService } from './children.service';
import { SendNotificationDto } from './dto';

@Controller('children')
@ApiTags('children')
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @ApiOkResponse({ description: 'List retrieved successfully' })
  @HttpCode(200)
  @Get('missing-children')
  async missingChildren() {
    const result = await this.childrenService.listAllMissingChildren();
    return new GenericResponse('all List', result);
  }

  @ApiOkResponse({ description: 'one child retrieved successfully' })
  @HttpCode(200)
  @ApiQuery({ name: 'id', required: true })
  @Get('child')
  async oneChild(@Query('id') id: number) {
    const result = await this.childrenService.viewOneMissingChild(id);
    return new GenericResponse('one Child', result);
  }

  @ApiCreatedResponse({ description: 'notification sent successfully' })
  @ApiQuery({ name: 'id', required: true })
  @ApiBody({ type: SendNotificationDto })
  @Post('notification')
  async sendNotification(
    @Query('id') id: number,
    @Body() dto: SendNotificationDto,
  ) {
    const result = await this.childrenService.sendNotification(dto, id);
    return new GenericResponse('notification', result);
  }

  @ApiCreatedResponse({ description: 'message sent successfully' })
  @ApiQuery({ name: 'phone', required: true })
  @Post('message')
  async screateMessage(@Query('phone') phone: string) {
    const result = await this.childrenService.createMessage(phone);
    return new GenericResponse('notification', result);
  }
}
