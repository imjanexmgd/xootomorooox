import os from 'node:os';
import smssxck from 'smssxck';
import clear from './src/clear.js';
import {
  setPassword,
  tomoroLoginOrRegister,
  tomoroModifyData,
  tomoroReqOtp,
} from './src/tomoro-service.js';
import crypto from 'crypto';
import { readFileSync, appendFileSync } from 'fs';
import { loggerFailed, loggerInfo, loggerSuccess } from './src/logger.js';
import inquirer from 'inquirer';

const generateRandomString = () => {
  return crypto
    .randomBytes(Math.ceil(16 / 2))
    .toString('hex')
    .slice(0, 16);
};
const randint = () => {
  return crypto.randomInt(100, 9999);
};
const config = JSON.parse(
  readFileSync(new URL('./config.json', import.meta.url))
);
(async () => {
  try {
    clear();
    loggerInfo(`tomoro new account creator`);
    loggerInfo(`Script running at ${os.platform} ${os.release}`);
    if (config) {
      loggerInfo(`Found invitationCode ${config.invitationCode}`);
    }

    const apikey = readFileSync('apikey.txt', 'utf-8');
    const smshub = new smssxck(apikey);
    const balanceSmshub = await smshub.getBalance();
    if (parseInt(balanceSmshub.ACCESS_BALANCE) === 0) {
      return console.log('NO BALANCE');
    }

    const deviceCode = generateRandomString();
    loggerInfo(`Using device code ${deviceCode}`);
    const { PHONE_NUMBER, ORDER_ID } = await smshub.getNumber(
      'ang',
      '6',
      'telkomsel',
      '0.0444'
    );
    let phoneNum = PHONE_NUMBER.replace(/^62/, '');
    loggerInfo(`Trying request otp to ${phoneNum}`);
    await tomoroReqOtp(phoneNum, deviceCode);
    let reOrderNum = true;
    // check otp
    loggerInfo('Checking OTP');
    let MAX_WAIT_TIME = 60000;
    let CHECK_INTERVAL = 3000;
    let totalTimeWaited = 0;
    let orderid = ORDER_ID;
    let code;
    while (totalTimeWaited <= MAX_WAIT_TIME) {
      await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL));
      loggerInfo('GET OTP ORDER_ID : ' + orderid);
      const { CODE } = await smshub.getCode(orderid);
      if (CODE !== undefined) {
        code = CODE;
        loggerInfo(`Success get Code ${code}`);
        const { STATUS } = await smshub.changeStatus(orderid, '3');
        loggerSuccess(`Success change status ${orderid} to ${STATUS}`);
        break;
      }
      totalTimeWaited += CHECK_INTERVAL;
      if (totalTimeWaited >= MAX_WAIT_TIME) {
        loggerFailed(`No otp found`);
        if (reOrderNum == true) {
          const { STATUS } = await smshub.changeStatus(orderid, '8');
          loggerSuccess(`Success change status ${orderid} to ${STATUS}`);
          const reOrder = await smshub.getNumber(
            'ang',
            '6',
            'telkomsel',
            '0.0444'
          );
          phoneNum = reOrder.PHONE_NUMBER.replace(/^62/, '');
          orderid = reOrder.ORDER_ID;
          loggerInfo(`Trying request otp to ${phoneNum}`);
          await tomoroReqOtp(phoneNum, deviceCode);
          totalTimeWaited = 0;
        }
      }
      continue;
    }
    loggerInfo(`trying login or register`);
    const verfyingCode = await tomoroLoginOrRegister(
      phoneNum,
      code,
      deviceCode
    );
    loggerSuccess('Success loginOrRegister');
    loggerInfo(`accountCode : ${verfyingCode.data.accountCode}`);
    loggerInfo(`isNewUser : ${verfyingCode.data.isNewUser}`);
    let token = verfyingCode.data.token;
    // console.log(token);
    let email = null;

    // loggerInfo(`Editing user data`);
    loggerInfo(`Phone num : ${phoneNum}`);
    // loggerInfo(`Dont send otp at the tomoro app`);
    // const { nickname } = await inquirer.prompt({
    //   type: 'input',
    //   message: 'input your name',
    //   name: 'nickname',
    // });
    // const email = `${nickname.split(' ')[0]}${randint()}@gmail.com`;
    // const genderList = [
    //   { name: 'male', value: 1 },
    //   {
    //     name: 'female',
    //     value: 0,
    //   },
    // ];
    // const { gender } = await inquirer.prompt([
    //   {
    //     type: 'list',
    //     message: 'select gender',
    //     name: 'gender',
    //     choices: genderList,
    //   },
    // ]);
    // loggerInfo(`Trying modify user ${verfyingCode.data.accountCode} data`);
    // const now = new Date();
    // const threeMonthsLater = new Date(now.setMonth(now.getMonth() + 3));
    // threeMonthsLater.setFullYear(2000);
    // const birthday = threeMonthsLater.toISOString().split('T')[0];
    // const resModifydata = await tomoroModifyData(
    //   deviceCode,
    //   token,
    //   email,
    //   nickname,
    //   gender,
    //   birthday,
    //   config.invitationCode
    // );
    // const modifyData = resModifydata.data;
    // console.log(modifyData.headers);

    // loggerSuccess(`Success change user data ${modifyData.serverRequestId}`);
    // check otp
    // reOrderNum = false;
    // loggerInfo(`Send otp at tomoro app now`);
    // loggerInfo(`Checking OTP at ${phoneNum}`);
    // MAX_WAIT_TIME = 120000;
    // CHECK_INTERVAL = 3000;
    // totalTimeWaited = 0;
    // code;
    // while (totalTimeWaited <= MAX_WAIT_TIME) {
    //   await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL));
    //   loggerInfo('GET OTP ORDER_ID : ' + orderid);
    //   const { CODE } = await smshub.getCode(orderid);
    //   if (CODE !== undefined) {
    //     code = CODE;
    //     loggerInfo(`Success get Code ${code}`);
    //     const { STATUS } = await smshub.changeStatus(orderid, '6');
    //     loggerSuccess(`Success change status ${orderid} to ${STATUS}`);
    //     break;
    //   }
    //   totalTimeWaited += CHECK_INTERVAL;
    //   if (totalTimeWaited >= MAX_WAIT_TIME) {
    //     loggerFailed(`No otp found`);

    //     if (reOrderNum == true) {
    //       const reOrder = await smshub.getNumber('ang', '6', 'any', '0.0444');
    //       phoneNum = reOrder.PHONE_NUMBER.replace(/^62/, '');
    //       orderid = ORDER_ID;
    //       loggerInfo(`Trying request otp to ${phoneNum}`);
    //       await tomoroReqOtp(phoneNum, deviceCode);
    //       totalTimeWaited = 0;
    //     }
    //     break;
    //   }
    //   continue;
    // }
    loggerInfo(`Trying set pin`);
    const { pinInput } = await inquirer.prompt([
      {
        type: 'input',
        message: 'insert your pin example 000000',
        name: 'pinInput',
      },
    ]);
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
/*
  THIS SCRIPT CREATED BY JANEXMGD
  DONT SHARE THIS WITHOUT MY PERMISSION
*/
