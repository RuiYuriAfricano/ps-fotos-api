import { Module } from '@nestjs/common';
import { UtilizadorService } from './utilizador.service';
import { UtilizadorController } from './utilizador.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UtilizadorController],
  providers: [UtilizadorService, PrismaService],
})
export class UtilizadorModule { }
