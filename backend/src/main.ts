import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Bảo mật HTTP Headers (Câu 4c)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // Cho phép tải ảnh bìa tĩnh từ frontend
    }),
  );

  // Xử lý cookie bảo mật HttpOnly (Câu 3d & 4c)
  app.use(cookieParser());

  // Cấu hình CORS cho phép Frontend tương tác an toàn
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Tiền tố API toàn cục
  app.setGlobalPrefix('api');

  // Phục vụ tài nguyên tĩnh (Ảnh bìa truyện - Covers)
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  // Validation Pipe tự động chuẩn hóa dữ liệu
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Tự động loại bỏ password_hash và thông tin nhạy cảm (Bài học Gumtree F12 - Câu 3d)
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TransformInterceptor(),
  );

  // Bộ lọc ngoại lệ toàn diện RESTful (Câu 7a)
  app.useGlobalFilters(new AllExceptionsFilter());

  // Cấu hình Swagger OpenAPI UI (Câu 4b)
  const config = new DocumentBuilder()
    .setTitle('Novel Manager API - Đề án Web Nâng Cao Phenikaa')
    .setDescription(
      'Hệ thống API RESTful Quản lý Novel và Truyện Tranh xây dựng trên NestJS, TypeORM, MySQL 8.0, xác thực JWT HttpOnly Cookie bảo mật.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Auth', 'Xác thực, phân quyền, đăng ký, đăng nhập')
    .addTag('Users', 'Quản lý thông tin hồ sơ người dùng')
    .addTag('Novels', 'Quản lý, tìm kiếm và lọc danh sách tiểu thuyết')
    .addTag('Chapters', 'Quản lý và đọc nội dung chương truyện')
    .addTag('Categories', 'Thể loại tiểu thuyết')
    .addTag('Authors', 'Hồ sơ tác giả')
    .addTag('Bookmarks', 'Lưu truyện yêu thích 1-click')
    .addTag('Ratings', 'Đánh giá điểm Booking.com và nhận xét')
    .addTag('Comments', 'Bình luận và thảo luận phân cấp')
    .addTag('Reading History', 'Tự động lưu và đồng bộ tiến trình đọc')
    .addTag('Tags', 'Nhãn phân loại truyện')
    .addTag('Admin', 'Quản trị và thống kê KPI hệ thống')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Novel Manager Swagger Docs - Phenikaa Uni',
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`[Novel Manager Backend] Server is running on: http://localhost:${port}/api`);
  console.log(`[Novel Manager Swagger] Documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
