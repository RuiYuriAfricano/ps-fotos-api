/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AddUtilizadorDto } from './dto/addUtilizadorDto';
import { UpdateUtilizadorDto } from './dto/updateUtilizadorDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UtilizadorService {
  constructor(private prisma: PrismaService) { }


  async login(username: string, password: string) {
    // Validar as credenciais
    const utilizador = await this.prisma.utilizador.findFirst({
      where: {
        nome: username,
        password: password,
      },
    });

    if (!utilizador) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Se as credenciais são válidas, gerar e associar um novo ID de sessão
    const sessionId = this.generateSessionId();
    const utilizador2 = await this.prisma.utilizador.update({
      where: { nome: username },
      data: { sessionId: sessionId },
    });

    return utilizador2;
  }

  async logout(username: string) {
    // Limpar o ID de sessão associado ao utilizador (faz logout)
    await this.prisma.utilizador.update({
      where: { nome: username },
      data: { sessionId: "" },
    });
  }

  async getSessionInfo(sessionId: string) {
    // Verificar se o ID de sessão é válido
    const utilizador = await this.prisma.utilizador.findFirst({
      where: { sessionId: sessionId },
    });

    if (!utilizador) {
      throw new UnauthorizedException('Sessão inválida');
    }

    // Retornar informações sobre o utilizador associado ao ID de sessão
    return utilizador;
  }

  // ... Restante do código do serviço ...

  private generateSessionId(): string {
    // Lógica para gerar um ID de sessão único, por exemplo, usando uuid
    // Você pode usar uma biblioteca como `uuid` para gerar IDs de sessão
    // npm install uuid
    const uuid = require('uuid');
    return uuid.v4();
  }

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
        codutilizador: data.codutilizador,
      },
      data,
    });

    return utilizador;
  }

  async remove(id: number) {
    const response = await this.prisma.utilizador.delete({
      where: { codutilizador: id },
    });

    return response;
  }

  async getOne(id: number) {
    const utilizador = await this.prisma.utilizador.findUnique({
      where: {
        codutilizador: id,
      },
    });

    return utilizador;
  }

  async getOneByName(nome: string) {
    const utilizador = await this.prisma.utilizador.findUnique({
      where: {
        nome: nome,
      },
    });

    return utilizador;
  }

  async getAll(codalbum: number) {
    const utilizadores = await this.prisma.utilizador.findMany({
      where: {
        NOT: {
          catalogAlbum: {
            some: {
              fkalbum: {
                equals: codalbum,
              },
            },
          },
        },
      },
    });


    // Agora, 'utilizadores' conterá uma lista de objetos com os utilizadores
    // que não estão associados ao codalbum fornecido.

    return utilizadores;
  }

}
