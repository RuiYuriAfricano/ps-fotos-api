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
import { AlbumService } from './album.service';
import { AddAlbumDto } from './dto/addAlbumDto';
import { UpdateAlbumDto } from './dto/updateAlbumDto';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) { }

  @Post()
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
  add(
    @Body() data: AddAlbumDto,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return this.albumService.add(data, files);
  }

  @Post()
  uploadImage(@Body() data: AddAlbumDto) {
    //return this.albumService.add(data);
  }

  @Put()
  update(@Body() data: UpdateAlbumDto) {
    return this.albumService.update(data);
  }
  @Post('updateTokens')
  updateAlbumTokens(
    @Body('newAccessToken') newAccessToken: string,
    @Body('newIdToken') newIdToken: string,
    @Body('username') username: string
  ) {
    return this.albumService.updateAlbumTokensForCondition(newAccessToken, newIdToken, username);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.albumService.remove(id);
  }

  @Get('pasta')
  getFolder() {
    // return this.albumService.createFolder();
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
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photos', maxCount: 10 }]))
  adicionarFotosAoAlbum(
    @Param('albumId', ParseIntPipe) albumId: number,
    @Param('catalogoId', ParseIntPipe) catalogoId: number,
    @UploadedFiles() photos: { photos: Express.Multer.File[] },
    @Body() usuarioCredenciais: any
  ) {
    return this.albumService.adicionarFotosAoAlbum(
      albumId,
      photos.photos,
      catalogoId,
      usuarioCredenciais
    );
  }
}
