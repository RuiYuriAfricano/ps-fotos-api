import { Module } from '@nestjs/common';
import { CatalogoAlbumService } from './catalogoalbum.service';
import { CatalogoAlbumController } from './catalogoalbum.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CatalogoAlbumController],
  providers: [CatalogoAlbumService, PrismaService],
})
export class CatalogoAlbumModule {}
