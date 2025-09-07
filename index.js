import os from 'node:os';
import smssxck from 'smssxck';
import clear from './src/clear.js';
import {
  setPassword,
  tomoroLoginOrRegister,
  tomoroReqOtp,
} from './src/tomoro-service.js';
import crypto from 'crypto';
import { readFileSync, appendFileSync } from 'fs';
import { loggerFailed, loggerInfo, loggerSuccess } from './src/logger.js';
import logUpdate from 'log-update';
import inquirer from 'inquirer';
import { format } from 'date-fns';
const generateRandomString = () => {
  return crypto
    .randomBytes(Math.ceil(16 / 2))
    .toString('hex')
    .slice(0, 16);
};
const config = JSON.parse(
  readFileSync(new URL('./config.json', import.meta.url))
);
(async () => {
  try {
    clear();
    loggerInfo(`TOMORO COFFEE ACCOUNT CREATOR`);
    loggerInfo(`script running at ${os.platform}`);
    if (config) {
      loggerInfo(`found invitation code ${config.invitationCode}`);
    }
    const OPERATOR = 'xl';
    const MAX_PRICE = '0.032';
    const apikey = readFileSync('apikey.txt', 'utf-8');

    loggerInfo(`using operator ${OPERATOR} max price ${MAX_PRICE}`);
    const smshub = new smssxck(apikey);
    const balanceSmshub = await smshub.getBalance();
    if (parseInt(balanceSmshub.ACCESS_BALANCE) === 0) {
      return loggerFailed('no balance');
    }

    const deviceCode = generateRandomString();
    loggerInfo(`Using device code ${deviceCode}`);
    const { PHONE_NUMBER, ORDER_ID } = await smshub.getNumber(
      'ang',
      '6',
      OPERATOR,
      MAX_PRICE
    );
    let phoneNum = PHONE_NUMBER.replace(/^62/, '');
    loggerInfo(`Trying request otp to ${phoneNum}`);
    await tomoroReqOtp(phoneNum, deviceCode);

    let reOrderNum = true;

    loggerInfo(`checking otp at ${phoneNum}.....`);
    let i = 0;
    let MAX_WAIT_TIME = 60000;
    let CHECK_INTERVAL = 3000;
    let ANIMATION_INTERVAL = 100;
    let totalTimeWaited = 0;
    let orderid = ORDER_ID;
    let code;
    const frames = ['-', '\\', '|', '/'];

    let lastCheck = 0;

    while (totalTimeWaited <= MAX_WAIT_TIME) {
      const frame = frames[i % frames.length];
      logUpdate(
        `[${format(
          new Date(),
          'HH:mm:ss.SSS'
        )}] waiting OTP (ORDER_ID: ${orderid}) ${frame} waited ${Math.floor(
          totalTimeWaited / 1000
        )}s`
      );
      if (totalTimeWaited - lastCheck >= CHECK_INTERVAL) {
        const { CODE } = await smshub.getCode(orderid);
        lastCheck = totalTimeWaited;

        if (CODE !== undefined) {
          code = CODE;
          logUpdate.clear();
          loggerSuccess(`Success get Code ${code}`);
          const { STATUS } = await smshub.changeStatus(orderid, '3');
          loggerSuccess(`success change status ${orderid} to ${STATUS}`);
          break;
        }

        if (totalTimeWaited >= MAX_WAIT_TIME) {
          logUpdate.clear();
          loggerFailed(`no otp found`);
          if (reOrderNum === true) {
            const { STATUS } = await smshub.changeStatus(orderid, '8');
            loggerSuccess(`success change status ${orderid} to ${STATUS}`);

            const reOrder = await smshub.getNumber(
              'ang',
              '6',
              OPERATOR,
              MAX_PRICE
            );
            phoneNum = reOrder.PHONE_NUMBER.replace(/^62/, '');
            orderid = reOrder.ORDER_ID;
            loggerInfo(`Trying request otp to ${phoneNum}`);
            await tomoroReqOtp(phoneNum, deviceCode);
            loggerInfo(`otp success sent to ${phoneNum}`);
            i = 0;
            totalTimeWaited = 0;
            lastCheck = 0;
          }
        }
      }

      await new Promise((resolve) => setTimeout(resolve, ANIMATION_INTERVAL));
      totalTimeWaited += ANIMATION_INTERVAL;
      i++;
    }
    logUpdate.clear();

    loggerInfo(`trying login or register`);
    const verfyingCode = await tomoroLoginOrRegister(
      phoneNum,
      code,
      deviceCode
    );
    loggerSuccess('Success loginOrRegister');
    loggerInfo(
      JSON.stringify(
        {
          accountCode: verfyingCode.data.accountCode,
          isNewUser: verfyingCode.data.isNewUser,
          token: verfyingCode.data.token,
        },
        null,
        2
      )
    );
    let token = verfyingCode.data.token;
    let email = null;
    const { pinInput } = await inquirer.prompt([
      {
        type: 'input',
        message: 'insert your pin example 000000',
        name: 'pinInput',
      },
    ]);
    loggerInfo(`trying set pin....`);
    const md5pass = crypto.createHash('md5').update(pinInput).digest('hex');
    loggerInfo(`using pin ${pinInput} with md5 ${md5pass}`);
    await setPassword(deviceCode, token, md5pass);
    loggerSuccess('success set pin');
    const resData = email
      ? `${phoneNum} ${pinInput} ${email} ${Math.floor(Date.now() / 1000)}\n`
      : `${phoneNum} ${pinInput} ${Math.floor(Date.now() / 1000)}\n`;
    appendFileSync(`result.txt`, resData);
    loggerSuccess(`result saved `);
  } catch (error) {
    console.log(error);
  }
})();
