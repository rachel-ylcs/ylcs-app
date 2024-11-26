const Metro = require('metro');
const express = require('express');

const app = express();

let args = {};
let argv = process.argv.slice(2);
argv.forEach((arg, index) => {
  if (arg.startsWith('--')) {
    let key = arg.slice(2);
    let value = argv[index + 1];
    args[key] = value;
  }
});

Metro.loadConfig({ ...args, platforms: ['web'] }).then(async (config) => {
  console.log(config);
  const { server: { port } } = config;
  const metroBundlerServer = await Metro.runMetro(config);
  app.use(metroBundlerServer.processRequest.bind(metroBundlerServer));
  app.use('/', express.static('public'));
  app.listen(port, '0.0.0.0');
  console.log(`Dev server is listening on http://localhost:${port}`);
});
