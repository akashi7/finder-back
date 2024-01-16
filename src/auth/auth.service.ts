import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ERole, User } from '@prisma/client';
import * as argon from 'argon2';
import { IAppConfig } from 'src/__shared__/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly Jwt: JwtService,
    private readonly config: ConfigService<IAppConfig>,
  ) {}

  private async generateToken(user: User) {
    const { id, role, phone, fullName } = user;
    const token = this.Jwt.sign(
      { id, role, phone, fullName },
      { secret: this.config.get('jwt').secret },
    );
    delete user.password;
    return {
      data: {
        user,
        token,
      },
    };
  }

  private async generateUser(
    role: ERole,
    dto: CreateUserDto,
  ): Promise<{ data: { user: User; token: string } }> {
    const { district, sector, cell } = dto;

    dto.role = role;
    const user = await this.prismaService.user.create({
      data: {
        fullName: dto.fullName,
        password: dto.password,
        phone: dto.phone,
        role: dto.role,
      },
    });
    if (user) {
      await this.prismaService.relative.create({
        data: {
          userId: user.id,
          district,
          sector,
          cell,
        },
      });
      return this.generateToken(user);
    }
  }

  async createUser(
    dto: CreateUserDto,
  ): Promise<{ data: { user: User; token: string } }> {
    const isUser = await this.prismaService.user.findUnique({
      where: {
        phone: dto.phone,
      },
    });
    if (isUser) {
      throw new ConflictException('User arleady exist');
    }
    const password = await argon.hash(dto.password);
    dto.password = password;
    return this.generateUser(dto.role, dto);
  }

  async loginUser(dto: LoginUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        phone: dto.phone,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    else if (!(await argon.verify(user.password, dto.password))) {
      throw new ForbiddenException('Wrong Admin password');
    } else return this.generateToken(user);
  }
}
