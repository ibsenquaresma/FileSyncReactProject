import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileSystemModule } from './app/file-system/file-system.module';

@Module({
  imports: [FileSystemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
