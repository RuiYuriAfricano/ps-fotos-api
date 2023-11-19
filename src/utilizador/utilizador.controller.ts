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
  constructor(private utilizadorService: UtilizadorService) {}

  @Post('login')
  login(@Body('nome') username: string, @Body('password') password: string) {
    return this.utilizadorService.login(username, password);
  }

  @Post('logout')
  async logout(@Body('nome') username: string) {
    await this.utilizadorService.logout(username);
    return { message: 'Logout realizado com sucesso.' };
  }

  @Get('session/:sessionId')
  async getSessionInfo(@Param('sessionId') sessionId: string) {
    const userInfo = await this.utilizadorService.getSessionInfo(sessionId);
    return { userInfo };
  }

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

  @Post('pesquisapornome')
  getOneByName(@Body('nome') nome: string) {
    return this.utilizadorService.getOneByName(nome);
  }

  @Get()
  getAll() {
    return this.utilizadorService.getAll();
  }
}
