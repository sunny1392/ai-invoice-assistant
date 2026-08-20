import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from './pdf.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfService: PdfService,
    private readonly aiService: AiService,
  ) {}

  async createInvoice(file: any) {
    const pdfText = await this.pdfService.extractText(file.path);

    const extractedData =
      await this.aiService.extractInvoiceData(pdfText);

    // Convert financial values from strings to numbers
    const subtotal =
      extractedData.subtotal !== null
        ? Number(String(extractedData.subtotal).replace(/,/g, ''))
        : null;

    const taxAmount =
      extractedData.taxAmount !== null
        ? Number(String(extractedData.taxAmount).replace(/,/g, ''))
        : null;

    let totalAmount =
      extractedData.totalAmount !== null
        ? Number(String(extractedData.totalAmount).replace(/,/g, ''))
        : null;

    // Validate and correct the total amount
    if (subtotal !== null && taxAmount !== null) {
      const calculatedTotal = subtotal + taxAmount;

      if (
        totalAmount === null ||
        Math.abs(calculatedTotal - totalAmount) > 0.01
      ) {
        totalAmount = calculatedTotal;
      }
    }

    // Update extracted data with normalized numbers
    extractedData.subtotal = subtotal;
    extractedData.taxAmount = taxAmount;
    extractedData.totalAmount = totalAmount;

    const invoice = await this.prisma.invoice.create({
      data: {
        fileName: file.originalname,
        filePath: file.path,

        vendorName: extractedData.vendorName,
        invoiceNumber: extractedData.invoiceNumber,
        invoiceDate: extractedData.invoiceDate,
        dueDate: extractedData.dueDate,

        subtotal,
        taxAmount,
        totalAmount,
        currency: extractedData.currency,

        extractedData: JSON.stringify(extractedData),
      },
    });

    return {
      invoice,
      extractedText: pdfText,
    };
  }
}