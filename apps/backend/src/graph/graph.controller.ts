import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { InvokeGraphDto } from './dto/invoke-graph.dto.js';
import { GraphService } from './graph.service.js';

@Controller('graph')
export class GraphController {
  constructor(private readonly graph: GraphService) {}

  @Post('invoke')
  @HttpCode(200)
  invoke(@Body() { message, threadId }: InvokeGraphDto) {
    return this.graph.invoke(message, threadId);
  }

  @Get('state/:threadId')
  getState(@Param('threadId', ParseUUIDPipe) threadId: string) {
    return this.graph.getState(threadId);
  }
}