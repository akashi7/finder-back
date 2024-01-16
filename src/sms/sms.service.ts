import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import { SmsDto } from './dto';

@Injectable()
export class SmsService {
  constructor(private readonly twilioService: TwilioService) {}

  async sendSMS(dto: SmsDto) {
    return this.twilioService.client.messages.create({
      body: `Dear ${dto.fullName} hope you are good , regarding your missing child case ${dto.name} have infonation regarding it please come at the office `,
      from: '+19564462810',
      to: dto.phone,
    });
  }
}
