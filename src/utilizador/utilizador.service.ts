import { Injectable } from '@nestjs/common';
import { AddUtilizadorDto } from './dto/addUtilizadorDto';
import { UpdateUtilizadorDto } from './dto/updateUtilizadorDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UtilizadorService {
  constructor(private prisma: PrismaService) { }

  async add(data: AddUtilizadorDto) {
    const utilizador = await this.prisma.utilizador.create({
      data,
    });
    return utilizador;
  }


  async update(data: UpdateUtilizadorDto) {
    data.codutilizador = Number(data?.codutilizador);

    const utilizador = await this.prisma.utilizador.update({
      where: {
        id: data.codutilizador,
      },
      data,
    });

    return utilizador;
  }

  async remove(id: number) {
    const response = await this.prisma.utilizador.delete({
      where: { id },
    });

    return response;
  }

  async getOne(id: number) {
    const utilizador = await this.prisma.utilizador.findUnique({
      where: {
        id,
      },
    });

    return utilizador;
  }

  async getAll() {
    const utilizadores = await this.prisma.utilizador.findMany();

    return utilizadores;
  }
}
