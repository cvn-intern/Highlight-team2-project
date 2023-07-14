import { Body, Controller, HttpStatus, Logger, Post, Res, ValidationPipe } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { CreateThemeDTO } from './dto/createTheme';
import { Response } from 'express';
import { ResponseClient } from '../../common/types/responseClient';

@Controller('theme')
export class ThemeController {
  constructor(
    private themeService: ThemeService,
    private logger: Logger = new Logger(ThemeController.name),
  ) { }

  @Post('/create')
  async createNewTheme(
    @Body(new ValidationPipe()) themeInformation: CreateThemeDTO,
    @Res() response: Response,
  ) {
    try {
      const newTheme = await this.themeService.createNewTheme(themeInformation);

      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Create new theme successfully!',
        success: true,
        data: newTheme,
      } as ResponseClient)
    } catch (error) {
      this.logger.error(error);
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
