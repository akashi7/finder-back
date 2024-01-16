import { Global, Module } from '@nestjs/common';
import { ChildrenController } from './children.controller';
import { ChildrenService } from './children.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  controllers: [ChildrenController],
  imports: [HttpModule],
  providers: [ChildrenService],
  exports: [ChildrenService],
})
export class ChildrenModule {}
