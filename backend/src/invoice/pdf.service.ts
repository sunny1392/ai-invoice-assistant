import { Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import * as fs from 'fs';

@Injectable()
export class PdfService {
  async extractText(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;
  }
}