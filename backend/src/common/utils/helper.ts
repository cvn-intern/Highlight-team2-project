export const randomString = (length: number): string => {
    const result: string = (Math.random() + 1).toString(36).substring(length);
    return result;
}

export const extractIdRoom = (codeRoom: string): number => {
    const idRoom = codeRoom.split("_")[codeRoom.split("_").length - 1];
    return Number.parseInt(idRoom);
}