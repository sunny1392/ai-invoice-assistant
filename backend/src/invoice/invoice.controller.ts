import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { InvoiceService } from './invoice.service';
import { PdfService } from './pdf.service';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly pdfService: PdfService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = Date.now() + extname(file.originalname);
          cb(null, name);
        },
      }),

      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(
            new BadRequestException('Only PDF files are allowed'),
            false,
          );
        }

        cb(null, true);
      },

      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async uploadInvoice(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Invoice PDF is required');
    }

    const text = await this.pdfService.extractText(file.path);

    const invoice = await this.invoiceService.createInvoice(file);

    return {
      message: 'Invoice uploaded successfully',
      invoice,
      extractedText: text,
    };
  }
}