import { Global, Module } from '@nestjs/common';
import { TwilioModule } from 'nestjs-twilio';
import { SmsService } from './sms.service';

@Global()
@Module({
  providers: [SmsService],
  exports: [SmsService],
  imports: [
    TwilioModule.forRoot({
      accountSid: 'ACc3f1fb4be658528cd73a626f58380cbd',
      authToken: '55f3ca2e41852f99e7b3d7e72b25a2cb',
    }),
  ],
})
export class SmsModule {}
