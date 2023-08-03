import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  Res,
  Logger,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { WordsCollectionService } from './wordsCollection.service';
import { AuthorizeJWT } from 'src/common/guards/authorizeJWT';
import { Response } from 'express';
import { IdUser } from 'src/common/decorators/idUser';
import { CreateWordsCollectionDto } from './dto/createWordsCollection';

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
    @Query('language_code') language_code: string,
    @Res() response: Response,
    @IdUser() idUser: number,
  ) {
    try {
      let wordsCollection = await this.wordsCollectionService.getWordsCollectionByQuery(type, language_code, idUser);

      wordsCollection = wordsCollection.map((wordsCollection: any) => {
        wordsCollection = {
          id: wordsCollection.id,
          creator_id: wordsCollection.creator_id,
          language_code: wordsCollection.language_code,
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

  @UseGuards(AuthorizeJWT)
  @Get('/:id')
  async getWordsCollectionDetailById(@Param('id') id: number, @Res() response: Response) {
    const wordsCollectionDetail = await this.wordsCollectionService.getWordsCollectionDetailById(id);
    return response.status(HttpStatus.OK).json(wordsCollectionDetail);
  }

  @UseGuards(AuthorizeJWT)
  @Post()
  async createWordsCollection(
    @Body() createWordsCollectionDto: CreateWordsCollectionDto,
    @Res() response: Response,
    @IdUser() idUser: number,
  ) {
    try {
      const creator_id = idUser;
      const is_created_by_system = false;
      const { theme_id, language_code, words_list } = createWordsCollectionDto;
      const wordsCollection = await this.wordsCollectionService.createWordsCollection(
        theme_id,
        language_code,
        creator_id,
        is_created_by_system,
        words_list,
      );
      return response.status(HttpStatus.OK).json(wordsCollection);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @UseGuards(AuthorizeJWT)
  @Put('/:id')
  async updateWordsCollection(
    @Param('id') id: number,
    @Body() createWordsCollectionDto: CreateWordsCollectionDto,
    @Res() response: Response,
    @IdUser() idUser: number,
  ) {
    const creator_id = idUser;
    const is_created_by_system = false;
    const { theme_id, language_code, words_list } = createWordsCollectionDto;
    // Update words collection data
    const words_collection = await this.wordsCollectionService.updateWordsCollection(
      Number(id),
      theme_id,
      language_code,
      creator_id,
      is_created_by_system,
      words_list,
    );
    if (!words_collection) {
      return response.status(HttpStatus.NOT_FOUND).json({
        message: `Words collection with id ${id} not found`,
      });
    }
    return response.status(HttpStatus.OK).json(words_collection);
  }

  @UseGuards(AuthorizeJWT)
  @Delete('/:id')
  async deleteWordsCollection(@Param('id') id: number, @Res() response: Response) {
    const words_collection_id = Number(id);
    const words_collection = await this.wordsCollectionService.getWordsCollectionDetailById(words_collection_id);
    if (!words_collection) {
      return response.status(HttpStatus.NOT_FOUND).json({
        message: `Words collection with id ${id} not found`,
      });
    }
    await this.wordsCollectionService.deleteWordsCollection(words_collection_id);
    return response.status(HttpStatus.OK).json({
      message: `Words collection with id ${id} has been deleted successfully`,
    });
  }
}
