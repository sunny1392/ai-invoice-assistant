import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { PdfService } from './pdf.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, PdfService],
})
export class InvoiceModule {}