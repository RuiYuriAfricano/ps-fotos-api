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
import { UtilizadorService } from './utilizador.service';
import { AddUtilizadorDto } from './dto/addUtilizadorDto';
import { UpdateUtilizadorDto } from './dto/updateUtilizadorDto';

@Controller('utilizador')
export class UtilizadorController {
  constructor(private utilizadorService: UtilizadorService) { }

  @Post()
  add(@Body() data: AddUtilizadorDto) {
    return this.utilizadorService.add(data);
  }

  @Put()
  update(@Body() data: UpdateUtilizadorDto) {
    return this.utilizadorService.update(data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.utilizadorService.remove(id);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.utilizadorService.getOne(id);
  }

  @Get()
  getAll() {
    return this.utilizadorService.getAll();
  }
}
