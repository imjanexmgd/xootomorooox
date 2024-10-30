export const loggerFailed = (message) => {
  const formattedMessage = `[ X ] ${message}`;
  return console.log(formattedMessage);
};
export const loggerSuccess = (message) => {
  const formattedMessage = `[ ✓ ] ${message}`;
  return console.log(formattedMessage);
};
export const loggerInfo = (message) => {
  const formattedMessage = `[ ! ] ${message}`;
  return console.log(formattedMessage);
};
