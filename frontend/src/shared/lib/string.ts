export const handleStringThatIsTooLong = (
  baseString: string,
  maxLength: number
) => {
  const stringLength = baseString.length;
  if (stringLength > maxLength) {
    return baseString.substring(0, maxLength) + "...";
  }
  return baseString;
};
