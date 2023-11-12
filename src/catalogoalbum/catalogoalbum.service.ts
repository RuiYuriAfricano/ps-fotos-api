import { Injectable } from '@nestjs/common';
import { AddCatalogoAlbumDto } from './dto/addCatalogoAlbumDto';
import { UpdateCatalogoAlbumDto } from './dto/updateCatalogoAlbumDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CatalogoAlbumService {
  constructor(private prisma: PrismaService) { }

  async add(data: AddCatalogoAlbumDto) {
    const catalogoalbum = await this.prisma.catalogAlbum.create({
      data,
    });
    return catalogoalbum;
  }


  async update(data: UpdateCatalogoAlbumDto) {
    data.codcatalogo = Number(data?.codcatalogo);

    const catalogoalbum = await this.prisma.catalogAlbum.update({
      where: {
        codcatalogo: data.codcatalogo,
      },
      data,
    });

    return catalogoalbum;
  }

  async remove(id: number) {
    const response = await this.prisma.catalogAlbum.delete({
      where: { codcatalogo: id },
    });

    return response;
  }

  async getOne(id: number) {
    const catalogoalbum = await this.prisma.catalogAlbum.findUnique({
      where: {
        codcatalogo: id,
      },
    });

    return catalogoalbum;
  }

  async getAll() {
    const catalogoalbuns = await this.prisma.catalogAlbum.findMany();

    return catalogoalbuns;
  }
}
