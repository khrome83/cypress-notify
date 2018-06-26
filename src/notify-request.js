#! /usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import program from 'commander';
import FormData from 'form-data';
import mime from 'mime-types';
import fetch from 'node-fetch';

const sendRequest = async (endpoint, method, headersRaw, bodyRaw, file) => {
  try {
    let res;
    const headers = JSON.parse(headersRaw);
    const body = JSON.parse(bodyRaw);

    // File Param was specified
    if (file) {
      const fileExists = await fs.pathExists(file);

      if (!fileExists) {
        // File was not found
      }

      const form = new FormData();
      const { size } = fs.statSync(file);
      const type = mime.lookup(file);
      const name = path.basename(file);
      Object.entries(body).forEach(([key, value]) => form.append(key, value));
      form.append('name', name);
      form.append('type', type);
      form.append('size', size);
      form.append('file', fs.createReadStream(file));
      res = await fetch(endpoint, { method, headers: Object.assign({}, headers, form.getHeaders()), body: form });
    } else {
      // console.log('Basic Endpoint: ',endpoint, {method, headers, body});
      res = await fetch(endpoint, { method, headers, body: JSON.stringify(body) });
    }

    // Handle Request
    if (res.status > 400) {
      // Failure
    }

    // Success

  } catch (err) {
    // Request Failed
    console.error(err)
  }
};

program
  .version(`${chalk.green('Version:')} 1.0.0`)
  .option('-e --endpoint <endpoint>', `Endpoint to send notification too`)
  .option('-m --method <method>', 'Method', /^(POST|GET)$/i, 'POST')
  .option('-h --headers <headers>', 'Headers', JSON.stringify({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }))
  .option('-b --body <body>', 'Body')
  .option('-f, --file <path>', `File Payload`)
  .parse(process.argv);

const {endpoint, method, headers, body, file} = program;
// console.log(JSON.stringify({endpoint, method, headers, body, file}));

if (endpoint, body) {
  sendRequest(endpoint, method, headers, body, file);
}

