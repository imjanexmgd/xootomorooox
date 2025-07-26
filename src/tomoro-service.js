import axios from 'axios';
import tomoroHeader from './tomoro-header.js';
import { loggerInfo, loggerSuccess } from './logger.js';

export async function tomoroLogout(deviceCode, token) {
  try {
    const { data } = await axios.post(
      'https://api-service.tomoro-coffee.id/portal/app/member/logout',
      '',
      {
        headers: tomoroHeader(token, deviceCode),
      }
    );
    console.log(data);
  } catch (error) {
    console.log('failed logout');
    throw error;
  }
}
export async function tomoroReqOtp(phoneNum, deviceCode) {
  try {
    loggerInfo(`Sending otp to ${phoneNum}`);

    const r = await axios.get(
      'https://api-service.tomoro-coffee.id/portal/app/member/sendMessage',
      {
        params: {
          phone: phoneNum, // 8xxxxxxxx
          areaCode: '62',
          verifyChannel: 'SMS',
        },
        headers: tomoroHeader(deviceCode),
      }
    );
    if (r.data.success == false) {
      loggerFailed(r.data.msg);
      if (r.data.msg == 'Request too frequent. Please try again in 1 hour') {
        const response = {
          success: false,
          limit: true,
          msg: r.data.msg,
        };
        return response;
      }
      throw Error(r.data.msg);
    }

    loggerSuccess(`OTP success send to ${phoneNum}`);
    return { success: true, serverRequestId: r.data.serverRequestId };
  } catch (error) {
    throw error;
  }
}
export async function tomoroLoginOrRegister(phoneNum, verifyCode, deviceCode) {
  try {
    const { data } = await axios.post(
      'https://api-service.tomoro-coffee.id/portal/app/member/loginOrRegister',
      {
        phoneArea: '62',
        phone: phoneNum,
        verifyCode: verifyCode,
        language: 'id',
        deviceCode: '1',
        deviceName: '1',
        channel: 'google play',
        revision: '3.0.0',
        type: 2,
        source: '563ZYE',
      },
      {
        headers: tomoroHeader(deviceCode),
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
}
export async function tomoroModifyData(
  deviceCode,
  token,
  email,
  nickname,
  gender,
  birthday,
  invitationCode
) {
  try {
    const res = await axios.post(
      'https://api-service.tomoro-coffee.id/portal/app/member/modifyData',
      {
        email: email,
        nickname: nickname,
        gender: parseInt(gender),
        birth: birthday,
        invitationCode: invitationCode,
      },
      {
        headers: tomoroHeader(deviceCode, token),
      }
    );
    // console.log(res.headers);

    return res;
  } catch (error) {
    throw error;
  }
}
export async function setPassword(deviceCode, token, md5pass) {
  try {
    const { data } = await axios.post(
      'https://api-service.tomoro-coffee.id/portal/app/member/v2/setPassWord',
      {
        password: `${md5pass}`,
      },
      {
        headers: tomoroHeader(deviceCode, token),
      }
    );
    if (data.success == false) {
      console.log(data);

      throw 'failed set pin';
    }
    console.log(data);
  } catch (error) {
    throw error;
  }
}
