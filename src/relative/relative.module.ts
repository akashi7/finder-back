import { Module } from '@nestjs/common';
import { RelativeController } from './relative.controller';
import { RelativeService } from './relative.service';

@Module({
  controllers: [RelativeController],
  providers: [RelativeService]
})
export class RelativeModule {}
