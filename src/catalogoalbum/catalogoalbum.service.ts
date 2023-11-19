import { Injectable } from '@nestjs/common';
import { AddCatalogoAlbumDto } from './dto/addCatalogoAlbumDto';
import { UpdateCatalogoAlbumDto } from './dto/updateCatalogoAlbumDto';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CatalogoAlbumService {
  constructor(private prisma: PrismaService) {}

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

  async verAlbum(albumId: number) {
    try {
      // Obter todos os catálogos associados ao álbum
      const catalogosAlbum = await this.prisma.catalogAlbum.findMany({
        where: {
          fkalbum: albumId,
        },
        select: {
          url: true,
        },
      });

      if (!catalogosAlbum || catalogosAlbum.length === 0) {
        throw new Error(
          `Nenhum catálogo encontrado para o álbum com ID ${albumId}.`
        );
      }

      // Obter todas as fotos dos arquivos associados aos catálogos
      const fotos = await Promise.all(
        catalogosAlbum.map(async (catalogo) =>
          this.obterFotosDoArquivo(catalogo.url)
        )
      );

      // Flatten a matriz de matrizes em uma única matriz
      const todasAsFotos = fotos.flat();

      return todasAsFotos;
    } catch (error) {
      throw new Error(`Erro ao visualizar o álbum: ${error.message}`);
    }
  }

  async obterFotosDoArquivo(urlArquivo: string) {
    try {
      // Fazer uma requisição HTTP para obter o conteúdo do arquivo de texto
      const resposta = await axios.get(urlArquivo);

      if (resposta.status !== 200) {
        throw new Error(
          `Falha ao obter o conteúdo do arquivo. Código de status: ${resposta.status}`
        );
      }

      // O conteúdo do arquivo é a resposta.data
      const conteudoArquivo = resposta.data;

      // Processar o conteúdo para obter os links das fotos
      const linksFotos = conteudoArquivo.split('\n').map((link) => link.trim());

      return linksFotos;
    } catch (error) {
      throw new Error(`Erro ao obter fotos do arquivo: ${error.message}`);
    }
  }
}
