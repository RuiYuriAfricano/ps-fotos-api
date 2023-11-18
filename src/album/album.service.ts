/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { AddAlbumDto } from './dto/addAlbumDto';
import { UpdateAlbumDto } from './dto/updateAlbumDto';
import multer from 'multer';
import { google } from 'googleapis';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async createFolder() {

    const auth = new google.auth.OAuth2(
      "99147321916-mv9ccqp3fpjsgfqi14ndphuef7i485dv.apps.googleusercontent.com",
      "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",
      'https://developers.google.com/oauthplayground'
  );

  auth.setCredentials({
    access_token: "ya29.a0AfB_byCJJLkaG9XFoUYRCJBJKHk5LxVDBOpj6eUFt_XYK1OHEww7OJ8Ymo6mu5mZErpwK5TglOfLoTWsTi1tkgfsbTDnH0zJoz0mShwW0v8lpCDYY-fT8zYSirOkAonLPE7si9TkFdwAHoEFto-UEv5vSjH83IOwCzYaCgYKAW8SARISFQHGX2Mil0oOqf5TxJmamZeKPdJWsg0170",
    id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjViMzcwNjk2MGUzZTYwMDI0YTI2NTVlNzhjZmE2M2Y4N2M5N2QzMDkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyODU2OTU2MTk1NTAtNTN2bnF2Y2pxNnVtOTU2YWFobDEyZGRsM3Y2OHB2dnIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyODU2OTU2MTk1NTAtOWsxa2E3MXJzNHBpODA1OHNoZzRna2tsZTlpdTlrZGcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDcyODI4MzkzNTE2MTEwMDUyMzEiLCJlbWFpbCI6Impvc2Vkb21pbmdvczkxOUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6Ikpvc8OpIERvbWluZ29zIENhc3N1YSBOZG9uZ2UiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS2tYYlBmMEFubE5kYmJ2c2RTcXJvWXd0MDdmQVBwRmE4VzB4LUVwOEMtZFE9czk2LWMiLCJnaXZlbl9uYW1lIjoiSm9zw6kgRG9taW5nb3MgQ2Fzc3VhIiwiZmFtaWx5X25hbWUiOiJOZG9uZ2UiLCJsb2NhbGUiOiJwdC1CUiIsImlhdCI6MTcwMDMwMzc2NCwiZXhwIjoxNzAwMzA3MzY0fQ.t7QkVX3GYiGCrU0t9hW4j3KsJz3wmYrnRkXWX_H9t6Z573VLgonANv2VmJEODmNp-mts2p5Kz70g_LOc9-XOXQnkoV5Rv8G8gt_0Gi42gNUJ-hfoZg0cYiEkPmc1qGk0Z4Vrsq8hAwh36Kec9gqKF7r4F02mJx9Un6ckN7-ZXmxO_Fuzx-PRxVBsUwNdxfe9eBwOq-FB5ortCNmWcyKf33S0w2jFwWolFFr6Tbm08Pilyiyj4J4c2U5U11I-WfEYHFnoL7uDyAknYQUqd6qk9_GqnRz4semgSaGufpLrUJdyj8RTQM4G9EYSS63KvTvtaAYosyuEEhSm8q1V168lCg",
  });


    const drive = google.drive({ version: 'v3', auth });
    try {
      const response = await drive.files.create({
        fields: "id",
        requestBody: {
            name: 'Album Z',
            mimeType: 'application/vnd.google-apps.folder'
        },
    });
      console.log('Album Folder Id:', response);
      return response;
    } catch (err) {
      // TODO(developer) - Handle error
      throw err;
    }
  }

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
