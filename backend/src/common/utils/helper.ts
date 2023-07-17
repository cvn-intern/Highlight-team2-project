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
