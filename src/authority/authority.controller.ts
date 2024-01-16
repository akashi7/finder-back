import {
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ERole } from '@prisma/client';
import { GenericResponse } from 'src/__shared__/dto';
import { AllowRoles } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ChildrenService } from 'src/children/children.service';

@Controller('authority')
@ApiTags('authority')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERole.AUTHORITY)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class AuthorityController {
  constructor(private readonly childrenService: ChildrenService) {}

  @ApiOkResponse({ description: 'notifications retrieved successfully' })
  @HttpCode(200)
  @Get('notifications')
  async notifications() {
    const result = await this.childrenService.ListNotifications();
    return new GenericResponse('notifications', result);
  }

  @ApiOkResponse({ description: 'one notification retrieved successfully' })
  @HttpCode(200)
  @ApiQuery({ name: 'id', required: true })
  @Get('notification')
  async oneNotification(@Query('id') id: number) {
    const result = await this.childrenService.ViewNotification(id);
    return new GenericResponse('one notification', result);
  }

  @ApiCreatedResponse({ description: 'notified sent successfully' })
  @ApiQuery({ name: 'id', required: true })
  @Post('notify')
  async sendNotification(@Query('id') id: number) {
    const result = await this.childrenService.NotifyRelative(id);
    return new GenericResponse('notified', result);
  }
}
