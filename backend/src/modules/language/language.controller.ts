import { Controller, Get, HttpStatus, Logger, Res, UseGuards } from '@nestjs/common';
import { LanguageService } from './language.service';
import { Response } from 'express';
import { AuthorizeJWT } from 'src/common/guards/authorizeJWT';

@Controller('languages')
export class LanguageController {
  constructor(private languageService: LanguageService, private logger: Logger = new Logger(LanguageController.name)) {}

  @UseGuards(AuthorizeJWT)
  @Get()
  async getAllLanguage(@Res() response: Response) {
    try {
      const languages = await this.languageService.getAllLanguge();

      return response.status(HttpStatus.OK).json(languages);
    } catch (error) {
      this.logger.error(error);
      return response.status(error.status).json(error);
    }
  }
}
