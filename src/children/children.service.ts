import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ENotification,
  EStatus,
  MissingChildren,
  Notification,
} from '@prisma/client';
import { catchError, lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { SmsService } from 'src/sms/sms.service';
import { CreateMissingChildDto, SendNotificationDto } from './dto';

@Injectable()
export class ChildrenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly Sms: SmsService,
    private readonly httpService: HttpService,
  ) {}

  async listAllMissingChildren(): Promise<MissingChildren[]> {
    const children = await this.prismaService.missingChildren.findMany({
      include: {
        user: {
          select: {
            phone: true,
          },
        },
      },
    });
    return children;
  }

  async viewOneMissingChild(id: number): Promise<MissingChildren> {
    const child = await this.prismaService.missingChildren.findFirst({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    return child;
  }

  async MyMissingChildren(id: number): Promise<MissingChildren[]> {
    const children = await this.prismaService.missingChildren.findMany({
      where: {
        userId: id,
      },
      include: {
        user: {
          select: {
            phone: true,
          },
        },
      },
    });
    return children;
  }

  async createMissingChild(
    dto: CreateMissingChildDto,
    id: number,
  ): Promise<MissingChildren> {
    const child = await this.prismaService.missingChildren.create({
      data: {
        userId: id,
        ...dto,
      },
    });
    return child;
  }

  async sendNotification(
    dto: SendNotificationDto,
    id: number,
  ): Promise<Notification> {
    const notification = await this.prismaService.notification.create({
      data: {
        ...dto,
        childId: id,
      },
    });
    return notification;
  }

  async ListNotifications(): Promise<Notification[]> {
    const notifications = await this.prismaService.notification.findMany();
    return notifications;
  }

  async ViewNotification(id: number): Promise<Notification> {
    const notification = await this.prismaService.notification.findFirst({
      where: {
        id,
      },
      include: {
        child: {
          include: {
            user: true,
          },
        },
      },
    });
    await this.prismaService.notification.update({
      where: {
        id,
      },
      data: {
        status: EStatus.VIEWED,
      },
    });

    return notification;
  }

  async NotifyRelative(id: number) {
    const notification = await this.prismaService.notification.findFirst({
      where: {
        id,
      },
      include: {
        child: {
          include: {
            user: true,
          },
        },
      },
    });
    const obj = {
      phone: `+25${notification.child.user.phone}`,
      name: notification.fullName,
      fullName: notification.child.user.fullName,
    };

    await this.prismaService.notification.update({
      where: {
        id,
      },
      data: {
        notified: ENotification.NOTIFIED,
      },
    });

    return this.Sms.sendSMS(obj);
  }

  async createMessage(phone: string) {
    let count = 1;
    let message = '';
    try {
      const username = 'coolnet.solutions';
      const password = 'intouch098';

      const credentials = `${username}:${password}`;
      const recipient = encodeURIComponent(phone);
      const sender = encodeURIComponent('alahi');
      const msgg = encodeURIComponent('testing');
      const urlParameters = `recipients=${recipient}&sender=${sender}&message=${msgg}`;

      const encodedCredentials = Buffer.from(credentials, 'utf-8').toString(
        'base64',
      );
      const url = 'https://www.intouchsms.co.rw/api/sendsms/.json';

      const response = await lastValueFrom(
        this.httpService
          .post<any>(url, urlParameters, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${encodedCredentials}`,
            },
          })
          .pipe(
            catchError((err) => {
              console.log({ err });
              throw new BadRequestException('Error sending message');
            }),
          ),
      );

      const responseData = response.data;
      console.log('\nSending POST request to URL:', url);
      console.log('Post parameters:', urlParameters);
      console.log('Response Code:', response.status);
      console.log('Response Code:', responseData);

      if (response.data.success === false && response.data.response) {
        const errors = response.data.response[0].errors;
        console.log({ errors });
      }

      // Process the response data
      const detailsList = responseData.details || [];
      let success = 0;
      let failure = 0;
      let failedNumbers = '';
      for (const d of detailsList) {
        if (d.cost > 0) {
          success++;
        } else {
          failure++;
          failedNumbers += `${d.receipient},`;
        }
      }

      if (failure > 0) {
        message = `${success} message(s) sent successfully, ${failure} message(s) were not delivered successfully. Here is a list of the failed numbers: ${failedNumbers} Please select Custom Numbers and paste in an edited list of these failed numbers and try to resend.`;
      } else {
        message = `${success} message(s) sent successfully, ${failure} message(s) were not delivered successfully.`;
      }
    } catch (error) {
      count = 0;
      console.log('ERROR IN SENDING MESSAGE:', error);
      console.error(error);
    }

    return message;
  }
}
