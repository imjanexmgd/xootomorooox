import axios from 'axios';
import tomoroHeader from './tomoro-header.js';
import { HttpsProxyAgent } from 'https-proxy-agent';

const createConfig = (deviceCode, token = null, proxyUrl = null) => {
  const config = {
    headers: tomoroHeader(deviceCode, token),
    timeout: 15000,
  };
  if (proxyUrl) {
    config.httpsAgent = new HttpsProxyAgent(proxyUrl);
    config.proxy = false;
  }
  return config;
};

export async function tomoroReqOtp(phoneNum, deviceCode, proxyUrl = null) {
  try {
    const config = createConfig(deviceCode, null, proxyUrl);
    config.params = { phone: phoneNum, areaCode: '62', verifyChannel: 'SMS' };
    const r = await axios.get(
      'https://api-service.tomoro-coffee.id/portal/app/member/sendMessage',
      config,
    );
    console.log(r.data)
    return r.data;
  } catch (error) {
    return { success: false, msg: error.message };
  }
}

export async function tomoroLoginOrRegister(
  phoneNum,
  verifyCode,
  deviceCode,
  proxyUrl = null,
) {
  try {
    const config = createConfig(deviceCode, null, proxyUrl);
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
      config,
    );
    return data;
  } catch (error) {
    throw new Error(`Login Failed: ${error.message}`);
  }
}

export async function tomoroModifyData(
  deviceCode,
  token,
  payload,
  proxyUrl = null,
) {
  try {
    const config = createConfig(deviceCode, token, proxyUrl);
    const { data } = await axios.post(
      'https://api-service.tomoro-coffee.id/portal/app/member/modifyData',
      {
        email: payload.email || '',
        nickname: payload.nickname || 'User',
        gender: parseInt(payload.gender) || 1, // 1: Male, 2: Female
        birth: payload.birthday || '2000-01-01',
        invitationCode: payload.invitationCode || '',
      },
      config,
    );
    return data;
  } catch (error) {
    throw new Error(`Modify Data Failed: ${error.message}`);
  }
}

export async function setPassword(deviceCode, token, md5pass, proxyUrl = null) {
  try {
    const config = createConfig(deviceCode, token, proxyUrl);
    const { data } = await axios.post(
      'https://api-service.tomoro-coffee.id/portal/app/member/v2/setPassWord',
      { password: `${md5pass}` },
      config,
    );
    return data;
  } catch (error) {
    throw new Error(`Set PIN Failed: ${error.message}`);
  }
}
export async function checkMemberByPhone(deviceCode, phoneNum, areaCode = '62', proxyUrl = null) {
  try {
    const config = createConfig(deviceCode, null, proxyUrl);

    config.params = {
      phone: phoneNum,
      areaCode: areaCode,
    };

    const { data } = await axios.get(
      'https://api-service.tomoro-coffee.id/portal/app/member/v2/checkMemberByPhone',
      config,
    );

    return data;
  } catch (error) {
    console.log(error);
    throw new Error(`Check Member Failed: ${error.message}`);
  }
}
export async function loginPhone(deviceCode, phoneNum, md5pass, phoneArea = '62', proxyUrl = null) {
  try {
    const config = createConfig(deviceCode, null, proxyUrl);
    const { data } = await axios.post(
      'https://api-service.tomoro-coffee.id/portal/app/member/v2/loginPhone',
      {
        'phoneArea': phoneArea,
        'phone': phoneNum,
        'password': md5pass,
      },
      config,
    );
    return data;
  } catch (error) {
    throw new Error(`Login Failed: ${error.message}`);
  }
}
export async function getStoreList(deviceCode, searchQuery = '', proxyUrl = null) {
  try {
    const config = createConfig(deviceCode, null, proxyUrl);
    config.params = {
      'pageNo': '1',
      'pageSize': '20',
      'storeName': searchQuery || '',
    };

    const { data } = await axios.get(
      'https://api-service.tomoro-coffee.id/portal/app/basic/storeInfo/getStoreList/v3',
      config,
    );

    return data;
  } catch (error) {
    console.log(error);
    throw new Error(`Check Member Failed: ${error.message}`);
  }
}
export async function getMenuList(deviceCode, storeCode, proxyUrl = null) {
  try {
    const config = createConfig(deviceCode, null, proxyUrl);
    config.params = {
      'storeCode': storeCode,
      'mainMenuType': '1'
    };

    const { data } = await axios.get(
      'https://api-service.tomoro-coffee.id/portal/app/basic/menu/getMenuList',
      config,
    );

    return data;
  } catch (error) {
    console.log(error);
    throw new Error(`Check Member Failed: ${error.message}`);
  }
}
export async function getMenuDetail(deviceCode, storeCode, itemCode, proxyUrl = null) {
  try {
    const config = createConfig(deviceCode, null, proxyUrl);
    config.params = {
      'storeCode': storeCode,
      'itemCode': itemCode,
      'mainMenuType': '1'
    }
    const { data } = await axios.get(
      'https://api-service.tomoro-coffee.id/portal/app/basic/item/getItemDetails',
      config,
    );
    return data.data
  } catch (error) {
    console.log(error)
  }
}
export async function tomoroLogout(deviceCode, token, proxyUrl = null) {
  try {
    const config = createConfig(deviceCode, token, proxyUrl);
    const { data } = await axios.post(
      'https://api-service.tomoro-coffee.id/portal/app/member/logout',
      {},
      config,
    );
    return data;
  } catch (error) {
    return { success: false, msg: error.message };
  }
}
