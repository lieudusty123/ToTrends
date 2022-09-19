// const {createProxyMiddleware} = require("http-proxy-middleware")

// module.exports = (app) => {
//   app.use(
//     createProxyMiddleware("/functions/", {
//       target: "http://localhost:9000/",
//       pathRewrite: {
//         "^\\.netlify/functions": "",
//       },
//     })
//   );
// };

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware( "/functions",{
      target: "http://localhost:9000/",
      secure: false,
      changeOrigin: true,
      pathRewrite:{
        "^\\.netlify/functions": ""
      }
    })
  );
};
// const { createProxyMiddleware } = require('http-proxy-middleware');

// const context = [
//     "/functions",
// ];

// module.exports = function (app) {

//     const webApiProxy = createProxyMiddleware(context[0], {
//         target: 'http://localhost:9000',
//         secure: false,
//         changeOrigin: true,
//         // headers: {
//         //     Connection: 'Keep-Alive'
//         // },
//         logLevel: 'debug'
//     });

//     app.use(webApiProxy);
// };


// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(
//     '/functions',
//     createProxyMiddleware({
//       target: 'http://localhost:9000',
//       changeOrigin: true,
//             pathRewrite: {
//         "../.netlify/functions": "",
//       },
//     })
//   );
// };