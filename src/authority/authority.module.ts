import { Module } from '@nestjs/common';
import { AuthorityController } from './authority.controller';
import { AuthorityService } from './authority.service';

@Module({
  controllers: [AuthorityController],
  providers: [AuthorityService]
})
export class AuthorityModule {}
