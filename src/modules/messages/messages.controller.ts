import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import axios, { isAxiosError } from 'axios';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs'
import FormData from 'form-data';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  @UseInterceptors(FileInterceptor('document'))
  async create(@Body() createMessageDto: any, @UploadedFile() document: Express.Multer.File) {
    const formData = new FormData()
    formData.append('chat_id', createMessageDto.chatId)
    formData.append('document', fs.createReadStream(document.path), document.originalname)

    const axioInstance = axios.create({
      baseURL: `https://api.telegram.org/bot${process.env.BOT_TOKEN}`,
      headers: { Accept: "application/json" },
    })

    try {
      const response = await axioInstance({
        url: "/sendDocument",
        method: "POST",
        data: formData
      }
        // `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendDocument`,
      )
      return response.data
    } catch (error) {
      if (isAxiosError(error)) return error.response.data
    }
    // return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
