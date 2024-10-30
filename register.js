import smssxck from 'smssxck';
import clear from './src/clear.js';
import { tomoroLoginOrRegister, tomoroReqOtp } from './src/tomoro-service.js';
import crypto from 'crypto';
import { readFileSync } from 'fs';
import { loggerFailed, loggerInfo, loggerSuccess } from './src/logger.js';
const generateRandomString = () => {
  return crypto
    .randomBytes(Math.ceil(16 / 2))
    .toString('hex')
    .slice(0, 16);
};
(async () => {
  try {
    clear();
    const apikey = readFileSync('apikey.txt', 'utf-8');

    const smshub = new smssxck(apikey);
    const balanceSmshub = await smshub.getBalance();
    if (parseInt(balanceSmshub.ACCESS_BALANCE) === 0) {
      return console.log('NO BALANCE');
    }

    const deviceCode = generateRandomString();
    const { PHONE_NUMBER, ORDER_ID } = await smshub.getNumber(
      'ang',
      '6',
      'any',
      '0.0210'
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
          const reOrder = await smshub.getNumber('ang', '6', 'any', '0.0210');
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
    // console.log(reqotp);
    loggerSuccess('Success loginOrRegister');
    loggerInfo(`accountCode : ${verfyingCode.data.accountCode}`);
    loggerInfo(`isNewUser : ${verfyingCode.data.isNewUser}`);

    // check otp
    reOrderNum = false;
    loggerInfo('Checking OTP');
    MAX_WAIT_TIME = 120000;
    CHECK_INTERVAL = 3000;
    totalTimeWaited = 0;
    code;
    while (totalTimeWaited <= MAX_WAIT_TIME) {
      await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL));
      loggerInfo('GET OTP ORDER_ID : ' + orderid);
      const { CODE } = await smshub.getCode(orderid);
      if (CODE !== undefined) {
        code = CODE;
        loggerInfo(`Success get Code ${code}`);
        const { STATUS } = await smshub.changeStatus(orderid, '6');
        loggerSuccess(`Success change status ${orderid} to ${STATUS}`);
        break;
      }
      totalTimeWaited += CHECK_INTERVAL;
      if (totalTimeWaited >= MAX_WAIT_TIME) {
        loggerFailed(`No otp found`);
        if (reOrderNum == true) {
          const reOrder = await smshub.getNumber('ang', '6', 'any', '0.0210');
          phoneNum = reOrder.PHONE_NUMBER.replace(/^62/, '');
          orderid = ORDER_ID;
          loggerInfo(`Trying request otp to ${phoneNum}`);
          await tomoroReqOtp(phoneNum, deviceCode);
          totalTimeWaited = 0;
        }
        break;
      }
      continue;
    }
  } catch (error) {
    console.log(error);
  }
})();
