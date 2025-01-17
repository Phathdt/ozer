import { LoggerModule } from 'nestjs-pino'
import { PrismaModule, PrismaServiceOptions } from 'nestjs-prisma'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import pretty from 'pino-pretty'

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule, ClerkAuthGuard, ClerkClientProvider } from '@ozer-backend/auth'
import { EcomModule } from '@ozer-backend/ecom'

import { ProductController } from '../controllers'
import { AppController } from './app.controller'
import { AppService } from './app.service'

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
          }
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
        }
      },
      inject: [ConfigService],
    }),
    AuthModule,
    EcomModule,
  ],
  controllers: [AppController, ProductController],
  providers: [
    AppService,
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AppModule {}
