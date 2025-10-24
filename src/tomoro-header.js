export default (deviceCode, token) => {
  return {
    'User-Agent': 'okhttp/5.1.0',
    Connection: 'Keep-Alive',
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
    revision: '3.3.7',
    countryCode: 'id',
    appChannel: 'google play',
    appLanguage: 'en',
    timeZone: 'Asia/Jakarta',
    deviceCode: deviceCode,
    ucde: 't698',
    wToken:
      '0004_9A14E3533434CFFC7B2F5F6DBD88551EB91AAA9A36EC326650B71F21BDB0E8D3083495DC04BB6C50E116BE8528F9C08F041398AE141BefPGrreevJE7RN5zm6Ihd+xVJIoGvQwJnYhMN8ENK+A9iQCpCrPuJ+QqVhXpwwIQRYbDqHHImaV09yq8rk1oZ6AijIN4SRu9ZoyXWkiRYDUHyvYTKmIsff6gSOqP1Wl5wbdUQBbPKmbnMzsrRSjoi51I+/qAzYSsnA671+rF235wS/GMkrAnM/dGm6qvpdYoGjFdj1PHNpxWHvSSnIFVZDgKoWjRm0igRWvLTRnbJWR20/xfuMNW8yyQe+rAbSCCEoWidACkTWCQ4qOqv3rm53mxwQNvKbDAGgx2Y0VvUHu9zyhn7MHOSLZcLhbFDrV7KyN9xl6E2X6/+EWrnsyu3GxLu3RY/SJPpDPlnvRHihrHynSY8QZhBAz5TfNIYkLT/6Kpf59L48trSiDOaUr2o5NkrKIqsYuNML398rcJbEbazTSRlmiN+3sXuhsUgrvT9EVjpQ/lHWfJ6QDMUrFNmGtdjkzxVkdXtbDcv0KmO9N7qTWPQMJgdQ3DRHGykKLA8anpxvavgxD/St5aBgOBPoJRxMwASCNjEBRlZexC+2bAmnUcnV+sD9zp71Qsjv7YyhpWg+eMkqTac8m2n5J0JmxnB+xBrB35zao1NWyPA9/oGhxcfORhC3iYFEwHlEzBV6K0pGu/iy+OhqvUVw+25eESr8IfuLHwcIDBhVknvB6VZuE0wrIVFBjJNkBMBuLUNLNDIIeEuCzklVdxTo3y3A==_fHw=_ddb6cb8e14fec33a-h-1761287023459-a9c9f59583a045c6be3a8d68fcf25705',
    ...(token ? { token } : {}),
  };
};
