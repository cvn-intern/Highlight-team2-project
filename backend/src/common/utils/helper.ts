export const randomString = (length: number) => {
    const result: string = (Math.random() + 1).toString(36).substring(length);
    return result;
}