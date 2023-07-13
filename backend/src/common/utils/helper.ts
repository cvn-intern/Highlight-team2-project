import { open } from 'node:fs/promises';

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

export const readFileLanguage = async (): Promise<Array<Language>> => {
    const listLanguage = [];
    const file = await open('src/common/files/language.txt');

    for await (const line of file.readLines()) {
        const language = line.split(',');
        listLanguage.push({
            code: language[0],
            name: language[1],
        });
    }

    return listLanguage;
}