import { Controller } from '@nestjs/common';
import { WordsCollectionService } from './wordsCollection.service';

@Controller('words-collection')
export class WordsCollectionController {
  constructor(private wordsCollectionService: WordsCollectionService) {}
}
