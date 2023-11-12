import { Injectable } from '@nestjs/common';
import { AddAlbumDto } from './dto/addAlbumDto';
import { UpdateAlbumDto } from './dto/updateAlbumDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) { }

  async add(data: AddAlbumDto) {
    const album = await this.prisma.album.create({
      data,
    });
    return album;
  }


  async update(data: UpdateAlbumDto) {
    data.codalbum = Number(data?.codalbum);

    const album = await this.prisma.album.update({
      where: {
        codalbum: data.codalbum,
      },
      data,
    });

    return album;
  }

  async remove(id: number) {
    const response = await this.prisma.album.delete({
      where: { codalbum: id },
    });

    return response;
  }

  async getOne(id: number) {
    const album = await this.prisma.album.findUnique({
      where: {
        codalbum: id,
      },
    });

    return album;
  }

  async getAll() {
    const albuns = await this.prisma.album.findMany();

    return albuns;
  }
}
