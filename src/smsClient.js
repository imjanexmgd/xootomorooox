import { request } from 'undici';

export default class SmsProvider {
  #baseUrl;
  #mode;

  constructor({ apiKey, provider = 'smshub' }) {
    if (!apiKey) throw new Error('API key required');

    const providers = {
      smshub: {
        url: 'https://smshub.org/stubs/handler_api.php',
        mode: 'text',
      },
      smsActive: {
        url: 'https://sms-active.ru/api/handler_api.php',
        mode: 'text',
      },
      smsActivate: {
        url: 'https://api.sms-activate.io/stubs/handler_api.php',
        mode: 'json',
      },
      heroSms: {
        url: 'https://hero-sms.com/stubs/handler_api.php',
      },
      smsOnline: {
        url: 'https://sms-online.pro/stubs/handler_api.php',
      },
    };

    if (!providers[provider]) {
      throw new Error(`Unsupported provider ${provider}`);
    }

    this.#baseUrl = `${providers[provider].url}?api_key=${apiKey}`;
    this.#mode = providers[provider].mode;
    this.providerName = providers;
  }

  async #call(params) {
    const url = `${this.#baseUrl}&${params}`;
    // console.log(url)
    const { body, statusCode } = await request(url);
    if (statusCode !== 200) {
      throw new Error(`HTTP ${statusCode}`);
    }

    const raw = await body.text();
    return raw;
  }

  /* =====================
     PUBLIC METHODS
  ====================== */

  async getBalance() {
    const res = await this.#call('action=getBalance');

    if (typeof res === 'object') {
      return { ACCESS_BALANCE: res.balance };
    }

    return { ACCESS_BALANCE: parseFloat(res.split(':')[1]) };
  }

  async getNumber(service, country, operator = 'any', maxPrice = '') {
    let params;
    if (this.providerName == 'smsOnline') {
      params = `action=getNumber&service=${service}&country=${country}&operator=${operator}&maxPrice=${maxPrice}&ref=136298`;
    } else {
      params = `action=getNumber&service=${service}&country=${country}&operator=${operator}&maxPrice=${maxPrice}`;
    }
    const res = await this.#call(params);

    if (typeof res === 'object') {
      if (res.status !== 'success') return null;
      return {
        ORDER_ID: res.activation_id,
        PHONE_NUMBER: res.phone,
      };
    }

    if (!res.startsWith('ACCESS_NUMBER')) return null;

    const [, id, phone] = res.split(':');
    return { ORDER_ID: id, PHONE_NUMBER: phone };
  }

  async getCode(orderId) {
    const res = await this.#call(`action=getStatus&id=${orderId}`);

    // JSON (sms-activate)
    if (typeof res === 'object') {
      if (res.status === 'received') {
        return { CODE: res.code };
      }
      return {};
    }

    // TEXT
    if (res.startsWith('STATUS_OK')) {
      return { CODE: res.split(':')[1] };
    }

    return {};
  }

  async changeStatus(orderId, status) {
    await this.#call(`action=setStatus&id=${orderId}&status=${status}`);
    return true;
  }
  async getPrices(service, country) {
    const res = await this.#call(
      `action=getPrices&service=${service}&country=${country}`,
    );
    //
    // console.log(res[country]);
    return res;
  }
}
