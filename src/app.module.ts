/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AlbumModule } from './album/album.module';
import { CatalogoAlbumModule } from './catalogoalbum/catalogoalbum.module';
import { UtilizadorModule } from './utilizador/utilizador.module';
import { PrismaService } from './prisma/prisma.service';


@Module({
  imports: [AlbumModule, CatalogoAlbumModule, UtilizadorModule],
  providers: [PrismaService],
})
export class AppModule { }
