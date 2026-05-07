/* eslint-disable no-undef */
const express = require('express');
const chalk = require('chalk');
const path = require('path');
const bodyParser = require('body-parser');
const requireDir = require('require-dir');
const { faker } = require('@faker-js/faker/locale/zh_CN');

const isPlainObject = (val) => {
  return Object.prototype.toString.call(val) === '[object Object]';
};

const app = express();
const router = express.Router();

const PORT = 8099;
const MOCK_DIRECTORY = './mock';

function walkRoutes(routes, directory) {
  console.log(routes);

  Object.keys(routes).forEach((name) => {
    const route = routes[name];

    if (isPlainObject(route) && Object.keys(route).length > 0) {
      walkRoutes(route, path.join(directory, name));
    } else if (typeof route === 'function') {
      route(router, faker);
    } else {
      console.error(
        chalk.red('[mock] expected a function being exported in %s/%s.js'),
        path.resolve(directory),
        name,
      );
    }
  });
}

walkRoutes(
  requireDir(path.resolve(MOCK_DIRECTORY), { recurse: true, extensions: ['.js', '.cjs', '.json'] }),
  MOCK_DIRECTORY,
);

app.use(bodyParser.json({ limit: '100MB' }));
app.use(bodyParser.urlencoded({ limit: '100MB', extended: true }));
app.use(router);

app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error(chalk.red(err));
    return;
  }

  console.log(
    `Mock server is running here: ${chalk.cyan(`http://127.0.0.1:${chalk.bold(PORT)}`)}\n`,
  );
});
