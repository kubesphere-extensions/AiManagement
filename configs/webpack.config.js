// const { merge } = require('webpack-merge');
// const baseConfig = require('@ks-console/bootstrap/webpack/webpack.dev.conf');

// module.exports = {
//   devServer: {
//     proxy: {
//       '/kapis/aicp.kubesphere.io': {
//         // target: 'https://hpc-ai.qingcloud.com',
//         target: 'http://60.216.39.180:30881',
//         changeOrigin: true,
//         pathRewrite: {'/kapis/aicp.kubesphere.io' : '/aicp.kubesphere.io'},
//         onProxyReq: (proxyReq, req, res) => {
//           const username = 'admin';
//           const password = 'Zhu@88jie123';
//           const auth = Buffer.from(`${username}:${password}`).toString('base64');
//           proxyReq.setHeader('Authorization', `Basic ${auth}`);
//         },
//       },
//     },
//   },
// };

// console.log(JSON.stringify(webpackDevConfig));

// module.exports = webpackDevConfig;

// module.exports =  {
//   devServer: {
//     proxy: {
//       '/aicp': {
//         target: 'https://hpc-ai.qingcloud.com',
//         changeOrigin: true,
//         secure: true,
//       },
//       '/aaa':{
//         target: 'http://jsonplaceholder.typicode.com',
//         pathRewrite: {'^/aaa' : ''},
//         changeOrigin: true,
//       }
//     },
//   },
// };
