const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/*.do",
    //createProxyMiddleware("https://www.dhlottery.co.kr/common.do", {
    createProxyMiddleware("https://www.dhlottery.co.kr", {
      changeOrigin: true,
      logLevel: "debug",
    })
  );
};
