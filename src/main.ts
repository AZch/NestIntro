import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExeptionFilter } from './common/filters/http-exeption.filter';
import { RolesGuard } from './common/guards/roles.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new HttpExeptionFilter());
  // app.useGlobalGuards(new RolesGuard());
  // app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  await app.listen(3000);
}
bootstrap();
