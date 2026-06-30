const wtoken = [
  '0004_9DA4635D27314874C69BB7751B76C47FEBEA218F140FA07E93440F911853A98621AA478EEDF9378CED17EE7DE6209A7DCDCB137E0F51Q8TbZr8EB+4YpFpsptxFXx1IeW/mu5EHYDuNKP8E/fFdPliHwFz4cbKD24D+8aT4hR3LWFrKLGgZTkNiEwhg7l5DLu3laC4weExEwdihYdtjKt++MyqqCojl0+t/B/lkmMjzlLwp8vsk6JXGrAog99mCTVNN4ze6YxVo8cGu/2goVORQ4DN4f1sQGjgrYm9EiqIHqhNWrnWBPxIM62gnI54w2UPJv99hRpD6lT8Uzk3raUJuTMEWuRs49qubsfnFOpK0VX50tg7ApqTq3bLYMxpx21VB7NXo+0KTwGg+gErEcojnr2WbIIvhzaVpkENXT1e/MPqtD3n21GJoJLuYXD9vFjv189H2KRYURRmMPx5HsGsR6B6OjzFa7RURbecibIOrWmWsW8Dn8cMj3fNeHsR1W3EobyWvsaAR9yehrYJwh6n5HE+fulYhYFl2HtN9KiiOLLjQYU8B0xNgrzvQGnz1WmtnlKk1fbSJ07mEBzXdsybKmJQt+FxRH1O2fly68TZXDrSwpGD051hbierslMJUrFcETQbOsAWzV7si8cI2yeR8giZWri7tn+GHgQ2mCCJ4T1UNe6XLnlwm395nQ/eWfOoUz4QuexbJJDP4lP9D8hVblsIgPkbjh6yhqG2VK7S0obE1+xlszDeasU9RqkUuHPK+NfNFQj6RHMz45xlgKNvMbT0W8pkxk+H9K8N5KYLr79EBC0gpGTLYbIIcow==_fHw=_ddb6cb8e14fec33a-h-1776579392301-f029e4b0a0444fe0afdb3f62bc3c0642',
  '0004_9A14E3533434CFFC7B2F5F6DBD88551EB91AAA9A36EC326650B71F21BDB0E8D3083495DC04BB6C50E116BE8528F9C08F041398AE141BefPGrreevJE7RN5zm6Ihd+xVJIoGvQwJnYhMN8ENK+A9iQCpCrPuJ+QqVhXpwwIQRYbDqHHImaV09yq8rk1oZ6AijIN4SRu9ZoyXWkiRYDUHyvYTKmIsff6gSOqP1Wl5wbdUQBbPKmbnMzsrRSjoi51I+/qAzYSsnA671+rF235wS/GMkrAnM/dGm6qvpdYoGjFdj1PHNpxWHvSSnIFVZDgKoWjRm0igRWvLTRnbJWR20/xfuMNW8yyQe+rAbSCCEoWidACkTWCQ4qOqv3rm53mxwQNvKbDAGgx2Y0VvUHu9zyhn7MHOSLZcLhbFDrV7KyN9xl6E2X6/+EWrnsyu3GxLu3RY/SJPpDPlnvRHihrHynSY8QZhBAz5TfNIYkLT/6Kpf59L48trSiDOaUr2o5NkrKIqsYuNML398rcJbEbazTSRlmiN+3sXuhsUgrvT9EVjpQ/lHWfJ6QDMUrFNmGtdjkzxVkdXtbDcv0KmO9N7qTWPQMJgdQ3DRHGykKLA8anpxvavgxD/St5aBgOBPoJRxMwASCNjEBRlZexC+2bAmnUcnV+sD9zp71Qsjv7YyhpWg+eMkqTac8m2n5J0JmxnB+xBrB35zao1NWyPA9/oGhxcfORhC3iYFEwHlEzBV6K0pGu/iy+OhqvUVw+25eESr8IfuLHwcIDBhVknvB6VZuE0wrIVFBjJNkBMBuLUNLNDIIeEuCzklVdxTo3y3A==_fHw=_ddb6cb8e14fec33a-h-1761287023459-a9c9f59583a045c6be3a8d68fcf25705'
]
export default (deviceCode, token) => {
  const wToken = wtoken[Math.floor(Math.random() * wtoken.length)];
  // console.log(`Selected wToken: ${wToken}`);
  return {
    'User-Agent': 'okhttp/5.1.0',
    Connection: 'Keep-Alive',
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
    revision: '3.4.2',
    countryCode: 'id',
    appChannel: 'google play',
    appLanguage: 'en',
    timeZone: 'Asia/Jakarta',
    deviceCode: deviceCode,
    ucde: 't698',
    wToken: wToken,
    ...(token ? { token } : {}),
  };
};
