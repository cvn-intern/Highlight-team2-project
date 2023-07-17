import { Controller, Get, HttpStatus, Logger, Res } from '@nestjs/common';
import { LanguageService } from './language.service';
import { Response } from 'express';
import { ResponseClient } from '../../common/types/responseClient';

@Controller('languages')
export class LanguageController {
  constructor(
    private languageService: LanguageService,
    private logger: Logger = new Logger(LanguageController.name),
  ) { }

  @Get()
  async getAllLanguage(
    @Res() response: Response
  ) {
    try {
      const languages =  await this.languageService.getAllLanguge();

      return response.status(HttpStatus.OK).json(languages);
    } catch (error) {
      this.logger.error(error);
      return response.status(error.statusCode | 500).json({
        statusCode: error.statusCode | 500,
        message: error,
        success: false,
      } as ResponseClient)
    }
  }

  @Get('/init')
  async initLanguage(
    @Res() response: Response,
  ) {
    try {
      await this.languageService.initLanguageForDb();

      return response.status(HttpStatus.OK); 
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
