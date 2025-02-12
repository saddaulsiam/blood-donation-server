export const generateVerificationCode = (): string => {
  // Generates a number between 100000 and 999999 (6 digits)
  return Math.floor(100000 + Math.random() * 900000).toString();
};
