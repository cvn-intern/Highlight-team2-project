import { open } from 'node:fs/promises';
import { ANSWER_APPROXIMATELY, ANSWER_CORRETLY, ANSWER_WRONG, MINIMUM_CHAR_WRONG } from '../variables/constVariable';

export const randomString = (length: number): string => {
  const result: string = (Math.random() + 1).toString(36).substring(length);
  return result;
}

export const extractIdRoom = (codeRoom: string): number => {
  const idRoom = codeRoom.split("_")[codeRoom.split("_").length - 1];
  return Number.parseInt(idRoom);
}


type Language = {
  code: string;
  name: string;
};

export const getLanguages = async (): Promise<Array<Language>> => {
  const languages: Array<Language> = [];
  const languageFile = await open('src/common/files/language.txt');

  for await (const line of languageFile.readLines()) {
    const [code, name] = line.split(',');
    languages.push({
      code: code,
      name: name,
    });
  }

  await languageFile.close();

  return languages;
}

export const checkTypeAnswer = (answerRound: string, answerUser: string): number => {
  if (answerRound === answerUser) {
    return ANSWER_CORRETLY;
  }

  if (answerRound.length !== answerUser.length && answerUser.includes(answerRound)) {
    return ANSWER_APPROXIMATELY;
  }

  let countCharCorretly = 0;
  for (let index: number = 0; index < answerRound.length; index++) {
    if (answerRound[index] === answerUser[index]) {
      countCharCorretly++;
    }
  }

  if (answerRound.length - countCharCorretly <= MINIMUM_CHAR_WRONG) {
    return ANSWER_APPROXIMATELY;
  }

  return ANSWER_WRONG;
}
