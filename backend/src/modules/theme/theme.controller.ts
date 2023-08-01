import { Body, Controller, HttpStatus, Logger, Post, Res, ValidationPipe } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { CreateThemeDTO } from './dto/createTheme';
import { Response } from 'express';

@Controller('themes')
export class ThemeController {
  constructor(private themeService: ThemeService, private logger: Logger = new Logger(ThemeController.name)) {}

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
