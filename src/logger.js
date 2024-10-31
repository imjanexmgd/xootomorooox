import chalk from 'chalk';
export const loggerFailed = (message) => {
  const formattedMessage = `[ ${chalk.red('X')} ] ${message}`;
  return console.log(formattedMessage);
};
export const loggerSuccess = (message) => {
  const formattedMessage = `[ ${chalk.green('✓')} ] ${message}`;
  return console.log(formattedMessage);
};
export const loggerInfo = (message) => {
  const formattedMessage = `[ ${chalk.green('!')} ] ${message}`;
  return console.log(formattedMessage);
};
