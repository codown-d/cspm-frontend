const proxy = {
  dev: {
    '/ai': {
      target: process.env.SOCKET_URL,
      changeOrigin: true,
      pathRewrite: { '^/ai': '/ai' },
    },

    '/api/v1/ws': {
      target: 'wss://cspm-local02.tensorsecurity.cn',
      // target: 'ws://192.168.110.31:9090',
      changeOrigin: true,
      ws: true,
      pathRewrite: { '^/api/v1/ws': '/api/v1/ws' },
    },
    '/api': {
      // target: 'http://192.168.110.83:9090',
      // target: 'https://cspm-sit.tensorsecurity.cn',
      // target: 'http://192.168.110.31:9090',
      target: 'https://cspm-local02.tensorsecurity.cn',
      // target: 'http://127.0.0.1:4523/m1/3383157-811725-default',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
  },
};

export default proxy;
