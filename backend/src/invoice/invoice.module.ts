import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { PdfService } from './pdf.service';
import { AiService } from './ai.service';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService,PdfService,AiService]
})
export class InvoiceModule {}
