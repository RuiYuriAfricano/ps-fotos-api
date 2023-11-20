import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';
import { CatalogoAlbumService } from './catalogoalbum.service';
import { AddCatalogoAlbumDto } from './dto/addCatalogoAlbumDto';
import { UpdateCatalogoAlbumDto } from './dto/updateCatalogoAlbumDto';
import { ListCatalogoFotosDto } from './dto/listCatalogoFotosDto';

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

  @Post('fotos')
  getAlbumPhotos(@Body() data: ListCatalogoFotosDto) {
    return this.catalogoAlbumService.listarFotos(data);
  }

  @Post('addUsers')
  async addUsersCatalogo(@Body() requestBody: { codutilizadores: number[], codalbum: number }) {
    // Verifica se codutilizadores é uma array válida e não é vazia
    if (requestBody.codutilizadores && requestBody.codutilizadores.length) {
      const catalogoAlbums = [];

      for (let i = 0; i < requestBody.codutilizadores.length; i++) {
        const catalogoalbum = await this.catalogoAlbumService.addUserCatalogo(requestBody.codutilizadores[i], requestBody.codalbum);
        catalogoAlbums.push(catalogoalbum);
      }

      return catalogoAlbums;
    } else {
      // Trate o caso em que codutilizadores é undefined, null ou vazio
      return { error: 'A lista de utilizadores é inválida ou vazia.' };
    }
  }



}
