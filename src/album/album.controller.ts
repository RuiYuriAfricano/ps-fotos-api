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
import { AlbumService } from './album.service';
import { AddAlbumDto } from './dto/addAlbumDto';
import { UpdateAlbumDto } from './dto/updateAlbumDto';

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
}
