import { tool } from '@langchain/core/tools';
import { z } from 'zod';

export const getCurrentTime = tool(
  ({ timeZone }) => {
    console.log(`[tool] get_current_time called with timeZone=${timeZone}`);
    return new Date().toLocaleString('en-US', { timeZone });
  },
  {
    name: 'get_current_time',
    description: 'Get the current date and time in a time zone.',
    schema: z.object({
      timeZone: z
        .string()
        .describe('IANA time zone, e.g. "Asia/Kolkata" or "UTC"'),
    }),
  },
);

export const tools = [getCurrentTime];
