export default (deviceCode, token) => {
  return {
    'User-Agent': 'okhttp/4.11.0',
    Connection: 'Keep-Alive',
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
    revision: '3.0.0',
    countryCode: 'id',
    appChannel: 'google play',
    appLanguage: 'en',
    timeZone: 'Asia/Jakarta',
    deviceCode: deviceCode,
    ucde: 't698',
    wToken:
      '0003_92C32D216633333183567230D633E630A0ADEB3CA5C8AD3A42ADBA39A70C6334DB39A24EAFB01249DBC48B49D9DA1034841F893DCA0EkHU7eQLBTq9HQWHAJh++znpjsOA0tVWcPSimnvKYS8uyrYns3eyx287+kxX6nGaur/IIZCNc4T0mIlHICaUNGxCsrv9wcbsB359QbfXgGsP5K+f82C07nUl75ecSrKY0GwOqtG0++q7nDNWqU8o+EtNThm2DsXbVb9U+HskOhsTumY43h/xRoEMX7VPxrn0oXSUhCdWn2QVJIgGqGXJ72DFMQOUnhw3L+PsJQyNk4gYXnUDnfYvsJZqbuAWVmaq1Ee7+q8TcGKbLnZiDwkoLxCXJj4hnU5mVhXBM3y0ewunQFqbZtHYBOY0GRJGWdVR7oYadh8XsQ994cnD+Ew1Ffz97k2ib6ugu39LijSC4hMbjHqFQNbZeTLdDDvYPI60H/qu6SVlWQOCv5UFgpfbtE2FAKXbo2IAsPyYZtTThP7iL4dgq6VhFPBJylAWiMdMIm0WqN1l8GIJs57NHBDebgzy4jummjsx/UJIeZYv/HQ00nEHoBn8bNrzXPiuO+xaJoshvH4q1yveZDRbPOTrZSYxCcD4TrojPjIhwPfBEbSSafkHmnZnyNt6GKJVDAyJScbueogTd8G/SR98CQ+w3Jg==_fHx8',
    ...(token ? { token } : {}),
  };
};
