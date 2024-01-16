import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ERole, User } from '@prisma/client';
import { GenericResponse } from 'src/__shared__/dto';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ChildrenService } from 'src/children/children.service';
import { CreateMissingChildDto } from 'src/children/dto';
import { RelativeService } from './relative.service';

@Controller('relative')
@ApiTags('relative')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERole.RELATIVE)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class RelativeController {
  constructor(
    private readonly relativeService: RelativeService,
    private readonly childrenService: ChildrenService,
  ) {}

  @ApiOkResponse({ description: 'List retrieved successfully' })
  @HttpCode(200)
  @Get('missing-children')
  async missingChildren(@GetUser() user: User) {
    const result = await this.childrenService.MyMissingChildren(user.id);
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

  @ApiCreatedResponse({ description: 'created successfully' })
  @ApiBody({ type: CreateMissingChildDto })
  @Post('child')
  async createMissingChild(
    @GetUser() user: User,
    @Body() dto: CreateMissingChildDto,
  ) {
    const result = await this.childrenService.createMissingChild(dto, user.id);
    return new GenericResponse('created', result);
  }
}
