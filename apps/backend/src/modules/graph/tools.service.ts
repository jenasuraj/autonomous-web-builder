import { Injectable } from '@nestjs/common';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

@Injectable()
export class ToolsService {
  readonly tools = [
    tool(({ timeZone }) => new Date().toLocaleString('en-US', { timeZone }), {
      name: 'get_current_time',
      description: 'Get the current date and time in a time zone.',
      schema: z.object({
        timeZone: z
          .string()
          .describe('IANA time zone, e.g. "Asia/Kolkata" or "UTC"'),
      }),
    }),
  ];
}
