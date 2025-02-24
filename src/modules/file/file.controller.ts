import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common'
import { FileService } from './file.service'
import { CreateFileDto } from './dto/create-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { FileSizeValidationPipe } from 'src/common/file.validator'
import { ResponseMessage } from 'src/public.decorator'

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @ResponseMessage("Tải file lên thành công")
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.fileService.upload(files)
  }
}
