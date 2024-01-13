/* eslint-disable prettier/prettier */
import { Injectable, ForbiddenException } from '@nestjs/common';
import { AddAlbumDto } from './dto/addAlbumDto';
import { UpdateAlbumDto } from './dto/updateAlbumDto';
import { google } from 'googleapis';
import { PrismaService } from 'src/prisma/prisma.service';

import * as fs from 'fs';
import { response } from 'express';

@Injectable()
export class AlbumService {
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

  async addFilesInFolder({ folderId, files, drive }) {
    const urls = [];

    for (const file of files) {
      const response = await drive.files.create({
        fields: 'webViewLink, webContentLink',
        requestBody: {
          name: file?.filename,
          mimeType: file?.mimetype,
          parents: [folderId],
        },
        media: {
          mimeType: file?.mimetype,
          body: fs.createReadStream(file?.path),
        },
      });

      urls.push(response?.data?.webViewLink);

      fs.unlinkSync(file?.path);
    }

    return urls;
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

  async add(data: AddAlbumDto, files: Array<Express.Multer.File>) {
    // autenticar com google
    const drive = this.getDrive({
      access_token: data.accessToken,
      id_token: data.idToken,
    });

    // criar album
    const album = await this.prisma.album.create({
      data: {
        nome: data.nome,
        access_token: data.accessToken,
        id_token: data.idToken,
      },
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

    //criar ficheiros na pasta
    const responseFiles = await this.addFilesInFolder({
      folderId: responseFolder?.data?.id,
      files,
      drive,
    });

    await this.writeCatalog({ content: responseFiles });

    //Realizar o upload do catalogo
    const responseCatalogId = await this.uploadCatalog({
      drive,
      folderId: responseFolder?.data?.id,
    });

    // vincular user
    const user = data.users[0];

    await this.prisma.catalogAlbum.create({
      data: {
        fkutilizador: Number(user),
        fkalbum: Number(album?.codalbum),
        coddrivealbum: responseFolder?.data?.id,
        coddrive: responseCatalogId,
        url: 'sim',
      },
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

  async updateAlbumTokensForCondition(newAccessToken: string, newIdToken: string, username: string) {

    const catalogItems = await this.prisma.catalogAlbum.findMany({
      where: {
        url: "sim",
        utilizador: {
          nome: username,
        },
      },
      select: {
        fkalbum: true,
      }
    });

    // Extrair os IDs dos álbuns
    const albumIds = catalogItems.map(item => item.fkalbum).filter(id => id !== null) as number[];

    // Atualizar os tokens dos álbuns encontrados
    for (const codalbum of albumIds) {
      await this.prisma.album.update({
        where: { codalbum: codalbum },
        data: {
          access_token: newAccessToken,
          id_token: newIdToken,
        },
      });
    }

    return this.prisma.album.findMany();
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

  async listarAlbunsDoUtilizador(nome: string) {
    const albuns = await this.prisma.utilizador.findUnique({
      where: {
        nome: nome,
      },
      select: {
        catalogAlbum: {
          select: {
            album: true,
          },
        },
      },
    });

    return albuns?.catalogAlbum?.map((item) => item.album) || [];
  }

  async getAll() {
    const albuns = await this.prisma.album.findMany();

    return albuns;
  }

  async adicionarFotosAoAlbum(
    albumId: number,
    fotos: Express.Multer.File[],
    catalogoId: number,
    usuarioCredenciais: any
  ) {
    try {
      // Salvar fotos no Google Drive
      const googleDriveLinks = await this.salvarNoGoogleDrive(
        fotos,
        usuarioCredenciais
      );



      // Atualizar o arquivo de texto no Google Drive com os links das novas fotos
      const txtFileLink = await this.atualizarArquivoDeTextoNoGoogleDrive(
        albumId,
        googleDriveLinks
      );

      // Atualizar a tabela catalogAlbum
      const catalogoalbum = await this.prisma.catalogAlbum.update({
        where: {
          codcatalogo: catalogoId,
        },
        data: {
          url: txtFileLink,
        },
      });

      return txtFileLink;
    } catch (error) {
      throw new Error(`Erro ao adicionar fotos ao álbum: ${error.message}`);
    }
  }

  async salvarNoGoogleDrive(
    fotos: Express.Multer.File[],
    usuarioCredenciais: any
  ) {
    // Configurar o cliente do Google Drive
    // Certifique-se de autenticar o cliente adequadamente
    const auth = await google.auth.getClient({
      credentials: usuarioCredenciais,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const drive = google.drive({
      version: 'v3',
      auth: auth,
    });

    const links = [];

    // Iterar sobre as fotos e enviar para o Google Drive
    for (const foto of fotos) {
      const response = await drive.files.create({
        requestBody: {
          name: foto.originalname,
          mimeType: foto.mimetype,
        },
        media: {
          mimeType: foto.mimetype,
          body: foto.buffer,
        },
      });

      // Adicionar o link do Google Drive à lista
      links.push(response.data.webContentLink);
    }

    return links;
  }

  async atualizarArquivoDeTextoNoGoogleDrive(
    albumId: number,
    novosLinks: string[]
  ) {
    // Configurar o cliente do Google Drive
    // Certifique-se de autenticar o cliente adequadamente
    const drive = google.drive({
      version: 'v3',
      // auth: YOUR_AUTHENTICATION_OBJECT,
    });

    // Procurar um arquivo de texto existente no Google Drive associado ao álbumId
    const query = `'${albumId}' in parents and mimeType='text/plain'`;
    const existingFiles = await drive.files.list({ q: query });

    // Se o arquivo não existir, crie um novo
    let fileId;
    if (existingFiles.data.files?.length === 0) {
      const newFile = await drive.files.create({
        requestBody: {
          name: `links_album_${albumId}.txt`,
          mimeType: 'text/plain',
          parents: [`${albumId}`],
        },
      });
      fileId = newFile.data.id;
    } else {
      fileId = existingFiles.data.files[0].id;
    }

    // Obter o conteúdo atual do arquivo
    const currentContent = await drive.files.export({
      fileId,
      mimeType: 'text/plain',
    });

    // Adicionar os novos links ao conteúdo existente
    const novoConteudo = currentContent.data + '\n' + novosLinks.join('\n');

    // Atualizar o conteúdo do arquivo
    await drive.files.update({
      fileId,
      media: {
        mimeType: 'text/plain',
        body: novoConteudo,
      },
    });

    return fileId;
  }
}
