import { Injectable } from '@nestjs/common';
import ollama from 'ollama';

@Injectable()
export class AiService {
  async extractInvoiceData(text: string) {
    const response = await ollama.chat({
      model: 'llama3.2:3b',
      messages: [
        {
          role: 'system',
          content: `
You are an invoice extraction assistant.

Extract these fields:
- vendorName
- invoiceNumber
- invoiceDate
- dueDate
- totalAmount
- taxAmount
- currency

Return ONLY valid JSON.
If a field is missing, use null.
          `,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      format: 'json',
    });

    return JSON.parse(response.message.content);
  }
}