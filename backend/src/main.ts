import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dns from 'node:dns';

// Force usage of IPv4 for DNS resolution to avoid connection issues on some networks (e.g., Mac, Render)
// that favor IPv6 but don't fully support it or have routing issues.
dns.setDefaultResultOrder('ipv4first');


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL, // Production URL from env
      'https://arete-flax.vercel.app',         // Allow all Vercel previews/deployments
    ].filter(Boolean),
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
