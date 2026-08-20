import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
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
    }),
  )
  async uploadInvoice(@UploadedFile() file: any) {
    const result = await this.invoiceService.createInvoice(file);

    return {
      message: 'Invoice uploaded successfully',
      ...result,
    };
  }

  constructor(
    private readonly invoiceService: InvoiceService,
  ) {}
}