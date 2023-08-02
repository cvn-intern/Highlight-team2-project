import { Body, Controller, HttpStatus, Logger, Post, Get, Res, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { CreateThemeDTO } from './dto/createTheme';
import { Response } from 'express';
import { AuthorizeJWT } from 'src/common/guards/authorizeJWT';

@Controller('themes')
export class ThemeController {
  constructor(private themeService: ThemeService, private logger: Logger = new Logger(ThemeController.name)) {}

  @UseGuards(AuthorizeJWT)
  @Get()
  async getAllTheme(@Res() response: Response) {
    try {
      const themes = await this.themeService.getAllTheme();
      return response.status(HttpStatus.OK).json(themes);
    } catch (error) {
      this.logger.error(error);
      return response.status(error.status).json(error);
    }
  }

  @UseGuards(AuthorizeJWT)
  @Post()
  async createNewTheme(@Body(new ValidationPipe()) themeInformation: CreateThemeDTO, @Res() response: Response) {
    try {
      const newTheme = await this.themeService.createNewTheme(themeInformation);

      return response.status(HttpStatus.CREATED).json(newTheme);
    } catch (error) {
      this.logger.error(error);
      return response.status(error.status).json(error);
    }
  }
}
