import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async createInvoice(file: any) {
    const invoice = await this.prisma.invoice.create({
      data: {
        fileName: file.originalname,
        filePath: file.path,
      },
    });

    return {
      message: 'Invoice uploaded successfully',
      invoice,
    };
  }
}