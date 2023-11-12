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
  UseInterceptors
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { AddAlbumDto } from './dto/addAlbumDto';
import { UpdateAlbumDto } from './dto/updateAlbumDto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';


@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) { }

  @Post()
  add(@Body() data: AddAlbumDto) {
    return this.albumService.add(data);
  }

  @Put()
  update(@Body() data: UpdateAlbumDto) {
    return this.albumService.update(data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.albumService.remove(id);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.albumService.getOne(id);
  }

  @Get()
  getAll() {
    return this.albumService.getAll();
  }

  @Post('listarAlbuns')
  listarAlbunsDoUtilizador(@Body('nome') nome: string) {
    return this.albumService.listarAlbunsDoUtilizador(nome);
  }

  @Post('adicionarFotosAoAlbum/:albumId/:catalogoId')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'photos', maxCount: 10 },
  ]))
  adicionarFotosAoAlbum(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('catalogoId', ParseIntPipe) catalogoId: number,
    @UploadedFiles() photos: { photos: Express.Multer.File[] }
  ) {
    return this.albumService.adicionarFotosAoAlbum(albumId, photos.photos, catalogoId);
  }


}
