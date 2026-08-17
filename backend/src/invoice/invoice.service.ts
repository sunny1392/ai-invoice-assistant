import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from './pdf.service';
import { AiService } from './ai.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfService: PdfService,
    private readonly aiService: AiService,
  ) {}

  async createInvoice(file: any) {
    // Extract text from PDF
    const pdfText = await this.pdfService.extractText(file.path);

    // Send text to AI
    const extractedData =
      await this.aiService.extractInvoiceData(pdfText);

    // Save invoice
    const invoice = await this.prisma.invoice.create({
      data: {
        fileName: file.originalname,
        filePath: file.path,
        extractedData: JSON.stringify(extractedData),
      },
    });

    return invoice;
  }
}