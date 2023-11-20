/* eslint-disable prettier/prettier */
import { Injectable, ForbiddenException } from '@nestjs/common';
import { AddCatalogoAlbumDto } from './dto/addCatalogoAlbumDto';
import { UpdateCatalogoAlbumDto } from './dto/updateCatalogoAlbumDto';
import { ListCatalogoFotosDto } from './dto/listCatalogoFotosDto';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { google } from 'googleapis';
import * as fs from 'fs';
import { AddUtilizadorDto } from 'src/utilizador/dto/addUtilizadorDto';

@Injectable()
export class CatalogoAlbumService {
  constructor(private prisma: PrismaService) { }

  getDrive({
    access_token,
    id_token,
  }: {
    access_token: string;
    id_token: string;
  }) {
    const auth = new google.auth.OAuth2(
      '99147321916-mv9ccqp3fpjsgfqi14ndphuef7i485dv.apps.googleusercontent.com',
      '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',
      'https://developers.google.com/oauthplayground'
    );

    auth.setCredentials({
      access_token,
      id_token,
    });

    const drive = google.drive({ version: 'v3', auth });

    return drive;
  }

  async listarFotos(data: ListCatalogoFotosDto) {
    const drive = this.getDrive({
      access_token: data.accessToken,
      id_token: data.idToken,
    });

    const dataFotos = await this.verTodasFotos(Number(data?.folderId));
    const images = [];

    for (const item of dataFotos) {
      const response = await drive.files.list({
        q: "'" + item.coddrivealbum + "' in parents",
        fields: 'files(id, name, webViewLink, webContentLink, thumbnailLink)',
      });

      images.push(response.data.files);
    }

    return images.flat(1);
  }

  async writeCatalog({ content = [] }) {
    try {
      for (const url_ of content) {
        await fs.writeFileSync('./arquivo.txt', url_);
      }
      // file written successfully
    } catch (err) {
      console.error(err);
    }
  }

  async uploadCatalog({ drive, folderId }) {
    // Lê o conteúdo do arquivo
    const media = {
      mimeType: 'text/plain',
      body: fs.createReadStream('./arquivo.txt'),
    };

    // Cria o arquivo no Google Drive
    const response = await drive.files.create({
      fields: 'id',
      requestBody: {
        name: 'catalogo.txt',
        mimeType: 'text/plain',
        parents: [folderId],
      },
      media: media,
    });

    // fs.unlinkSync('./arquivo.txt');

    return response?.data?.id;
  }

  async createFolder({ drive, name }) {
    try {
      const response = await drive.files.create({
        fields: 'id',
        requestBody: {
          name,
          mimeType: 'application/vnd.google-apps.folder',
        },
      });

      console.log('Album Folder Id:', response);

      return response;
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

  async updateCatalog({ drive, fileId }) {
    // Lê o novo conteúdo do arquivo
    const media = {
      mimeType: 'text/plain',
      body: fs.createReadStream('arquivo.txt'),
    };

    // Atualiza o conteúdo do arquivo no Google Drive
    const response = await drive.files.update({
      fileId: fileId,
      media: media,
    });

    return response?.data.id;
  }

  async readCatalogContent({ drive, fileId }) {
    try {
      const response = await drive.files.export({
        fileId: fileId,
        mimeType: 'text/plain',
      });

      console.log('File Content:', response.data);

      return response.data;
    } catch (err) {
      console.error('Error reading file content:', err.message);
    }
  }

  async addUserCatalogo(codutilizador: number, codalbum: number) {

    const ultimoCatalogo = await this.prisma.catalogAlbum.findFirst({
      orderBy: {
        codcatalogo: 'desc',
      },
    });
    const catalogoalbum = await this.prisma.catalogAlbum.create({
      data: {
        fkutilizador: Number(codutilizador),
        fkalbum: Number(codalbum),
        coddrivealbum: Number(Number(ultimoCatalogo.codcatalogo) + 2).toString(), //fiz isso por ser unique, depois será atualizado
        coddrive: Number(Number(ultimoCatalogo.codcatalogo) + 100).toString(), //fiz isso por ser unique, depois será atualizado
        url: '',
      },
    });

    return catalogoalbum;
  }


  async add(data: AddCatalogoAlbumDto) {
    const drive = this.getDrive({
      access_token: data.accessToken,
      id_token: data.idToken,
    });

    //criar pasta no drive
    const responseFolder = await this.createFolder({
      drive,
      name: data.nome,
    });

    if (!responseFolder?.data?.id) {
      throw new ForbiddenException({
        error: 'folder not created',
      });
    }

    await this.writeCatalog({ content: [''] });

    //Realizar o upload do catalogo
    const responseCatalogId = await this.uploadCatalog({
      drive,
      folderId: responseFolder?.data?.id,
    });

    const user = data.users[0];

    const catalogoalbum = await this.prisma.catalogAlbum.create({
      data: {
        fkutilizador: Number(user),
        fkalbum: Number(data.codalbum),
        coddrivealbum: responseFolder?.data?.id,
        coddrive: responseCatalogId,
        url: '',
      },
    });

    return catalogoalbum;
  }

  async update(data: UpdateCatalogoAlbumDto) {
    data.codcatalogo = Number(data?.codcatalogo);

    const drive = this.getDrive({
      access_token: data.accessToken,
      id_token: data.idToken,
    });

    const response = await this.readCatalogContent({
      drive,
      fileId: data?.fileId,
    });

    await this.writeCatalog({ content: [response] });

    //Realizar o upload do catalogo
    const responseCatalogId = await this.updateCatalog({
      drive,
      fileId: data?.fileId,
    });

    const catalogoalbum = await this.prisma.catalogAlbum.update({
      where: {
        codcatalogo: data.codcatalogo,
      },
      data: {
        coddrive: responseCatalogId,
      },
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

  async verTodasFotos(albumId: number) {
    try {
      // Obter todos os catálogos associados ao álbum
      const coddrivealbum = await this.prisma.catalogAlbum.findMany({
        where: {
          fkalbum: albumId,
        },
        select: {
          coddrivealbum: true,
        },
      });

      return coddrivealbum;
    } catch (error) {
      throw new Error(`Erro ao visualizar o álbum: ${error.message}`);
    }
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
