import chalk from 'chalk';
import { format } from 'date-fns';
function timestampMessage(message) {
  return `[${format(new Date(), 'HH:mm:ss.SSS')}] ${message}`;
}
export const loggerFailed = (message) => {
  const formattedMessage = timestampMessage(
    `${chalk.red.underline('error')} ${message}`
  );
  return console.log(formattedMessage);
};
export const loggerSuccess = (message) => {
  const formattedMessage = timestampMessage(
    `${chalk.green.underline('ok')} ${message}`
  );
  return console.log(formattedMessage);
};
export const loggerInfo = (message) => {
  const formattedMessage = timestampMessage(
    `${chalk.cyan.underline('info')} ${message}`
  );
  return console.log(formattedMessage);
};
