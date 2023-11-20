/* eslint-disable prettier/prettier */
import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  Controller,
  ParseIntPipe,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CatalogoAlbumService } from './catalogoalbum.service';
import { AddCatalogoAlbumDto } from './dto/addCatalogoAlbumDto';
import { UpdateCatalogoAlbumDto } from './dto/updateCatalogoAlbumDto';
import { ListCatalogoFotosDto } from './dto/listCatalogoFotosDto';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('catalogoalbum')
export class CatalogoAlbumController {
  constructor(private catalogoAlbumService: CatalogoAlbumService) { }

  @Post()
  add(@Body() data: AddCatalogoAlbumDto) {
    return this.catalogoAlbumService.add(data);
  }

  @Put()
  update(@Body() data: UpdateCatalogoAlbumDto) {
    return this.catalogoAlbumService.update(data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoAlbumService.remove(id);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoAlbumService.getOne(id);
  }

  @Get()
  getAll() {
    return this.catalogoAlbumService.getAll();
  }

  @Post('todas')
  getAllPhotos(@Body() data: ListCatalogoFotosDto) {
    const id = data.folderId;
    return this.catalogoAlbumService.verTodasFotos(Number(id));
  }

  @Post('fotos')
  getAlbumPhotos(@Body() data: ListCatalogoFotosDto) {
    return this.catalogoAlbumService.listarFotos(data);
  }

  @Post('addFotos')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, 'upload/');
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            file.fieldname + '-' + uniqueSuffix + file.originalname
          );
        },
      }),
    })
  )
  addAlbumPhotos(@Body() data: AddCatalogoAlbumDto,
    @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.catalogoAlbumService.addFoto(data, files);
  }


  @Post('file')
  getFileId(@Body() data: UpdateCatalogoAlbumDto) {
    const idutilizador = data.fkutilizador;
    const idalbum = data.fkalbum;
    return this.catalogoAlbumService.getFileId(Number(idutilizador), Number(idalbum));
  }
  @Post('addUserCatalogo')
  async addUsersCatalogo(
    @Body() requestBody: { users: number[]; codalbum: number }
  ) {
    // Verifica se codutilizadores é uma array válida e não é vazia
    if (requestBody.users && requestBody.users.length) {
      const catalogoAlbums = [];

      for (let i = 0; i < requestBody.users.length; i++) {
        const catalogoalbum = await this.catalogoAlbumService.addUserCatalogo(
          Number(requestBody.users[i]),
          Number(requestBody.codalbum)
        );
        catalogoAlbums.push(catalogoalbum);
      }

      return catalogoAlbums;
    } else {
      // Trate o caso em que codutilizadores é undefined, null ou vazio
      return { error: 'A lista de utilizadores é inválida ou vazia.' };
    }
  }
}
