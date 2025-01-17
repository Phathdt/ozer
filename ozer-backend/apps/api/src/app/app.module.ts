import { LoggerModule } from 'nestjs-pino';
import { PrismaModule, PrismaServiceOptions } from 'nestjs-prisma';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import pretty from 'pino-pretty';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EcomModule } from '@ozer-backend/ecom';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
          },
        },
        customProps: (req) => {
          return {
            traceId: req['traceId'],
          };
        },
      },
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory(configService: ConfigService): PrismaServiceOptions {
        return {
          prismaOptions: {
            log: [configService.getOrThrow('LOG_LEVEL')],
            datasourceUrl: configService.getOrThrow('DATABASE_URL'),
          },
        };
      },
      inject: [ConfigService],
    }),
    EcomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
