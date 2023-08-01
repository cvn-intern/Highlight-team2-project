import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { WordsCollectionService } from './wordsCollection.service';
import { AuthorizeJWT } from 'src/common/guards/authorizeJWT';
import { Response } from 'express';
import { IdUser } from 'src/common/decorators/idUser';

@Controller('words-collection')
export class WordsCollectionController {
  constructor(
    private wordsCollectionService: WordsCollectionService,
    private logger: Logger = new Logger(WordsCollectionController.name),
  ) {}

  @UseGuards(AuthorizeJWT)
  @Get()
  async getWordsCollectionByType(
    @Query('type') type: number,
    @Res() response: Response,
    @IdUser() idUser: number,
  ) {
    try {
      let wordsCollection =
        await this.wordsCollectionService.getWordsCollectionByType(
          type,
          idUser,
        );

      wordsCollection = wordsCollection.map((wordsCollection: any) => {
        wordsCollection = {
          id: wordsCollection.id,
          creator_id: wordsCollection.creator_id,
          is_created_by_system: wordsCollection.is_created_by_system,
          theme_name: wordsCollection.theme.name,
          theme_thumbnail: wordsCollection.theme.thumbnail,
          created_at: wordsCollection.created_at,
          updated_at: wordsCollection.updated_at,
        };
        return wordsCollection;
      });

      return response.status(HttpStatus.OK).json(wordsCollection);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
