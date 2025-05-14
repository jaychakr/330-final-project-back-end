module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '8.0.6',
      skipMD5: true,
    },
    autoStart: true,
    instance: {
      dbName: 'jest',
    },
  },
};
