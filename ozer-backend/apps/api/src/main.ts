import { Logger as PinoLogger } from 'nestjs-pino'

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  })

  app.enableCors({
    origin: '*',
    credentials: true,
  })

  app.useLogger(app.get(PinoLogger))

  await app.listen(4000, () => {
    Logger.log(`🚀 App running on http://localhost:4000`)
  })
}

bootstrap()
