import { Injectable } from '@nestjs/common';
import { AddAlbumDto } from './dto/addAlbumDto';
import { UpdateAlbumDto } from './dto/updateAlbumDto';
import multer from 'multer';
import { google } from 'googleapis';
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

  async adicionarFotosAoAlbum(albumId: number, fotos: Express.Multer.File[], catalogoId: number, usuarioCredenciais: any) {
    try {
      // Salvar fotos no Google Drive
      const googleDriveLinks = await this.salvarNoGoogleDrive(fotos, usuarioCredenciais);

      // Atualizar o arquivo de texto no Google Drive com os links das novas fotos
      const txtFileLink = await this.atualizarArquivoDeTextoNoGoogleDrive(albumId, googleDriveLinks);

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


  async salvarNoGoogleDrive(fotos: Express.Multer.File[], usuarioCredenciais: any) {
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

  async atualizarArquivoDeTextoNoGoogleDrive(albumId: number, novosLinks: string[]) {
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
    const currentContent = await drive.files.export({ fileId, mimeType: 'text/plain' });

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


