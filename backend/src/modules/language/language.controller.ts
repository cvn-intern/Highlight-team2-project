import { Controller, Get, HttpStatus, Logger, Res } from '@nestjs/common';
import { LanguageService } from './language.service';
import { Response } from 'express';
import { ResponseClient } from 'src/common/types/responseClient';

@Controller('language')
export class LanguageController {
  constructor(
    private languageService: LanguageService,
    private logger: Logger = new Logger(LanguageService.name),
  ) { }

  @Get('/getAll')
  async getAllLanguage(
    @Res() response: Response
  ) {
    try {
      const listLanguage =  await this.languageService.getAllLanguge();

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Successfully!',
        success: true,
        data: listLanguage,
      })
    } catch (error) {
      this.logger.error(error);
      return response.status(error.statusCode | 500).json({
        statusCode: error.statusCode | 500,
        message: 'Anything is wrong!',
        success: false,
        data: {},
      } as ResponseClient)
    }
  }
}
