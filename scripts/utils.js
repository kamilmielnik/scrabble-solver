import fs from 'fs-extra';
import http from 'http';
import https from 'https';
import path from 'path';
import request from 'request';
import unzip from 'unzip';
import url from 'url';

const YELLOW = '\x1b[33m%s\x1b[0m';
const RED = '\x1b[31m%s\x1b[0m';
const GREEN = '\x1b[32m%s\x1b[0m';

// eslint-disable-next-line no-console
export const log = (message) => console.log(YELLOW, message);
// eslint-disable-next-line no-console
export const logError = (error) => console.log(RED, error);
// eslint-disable-next-line no-console
export const logSuccess = (message) => console.log(GREEN, message);
export const logAction = (message, action) => {
  let result = null;
  try {
    const start = Date.now();
    log(`${message}...`);
    result = action();
    Promise.resolve(result).then((promiseResult) => {
      const end = Date.now();
      const time = end - start;
      logSuccess(`[${time}ms] ${message} successful`);
      return promiseResult;
    });
  } catch (error) {
    logError(`${message} failed\n\t${error}`);
    throw error;
  }
  return result;
};

export const getFilenameFromUrl = (fileUrl) => path.basename(url.parse(fileUrl).pathname);

export const tryRemovingDirectory = (path) => {
  if(fs.existsSync(path)) {
    logAction(
      `Deleting directory: "${path}"`,
      () => fs.removeSync(path)
    );
  } else {
    logError(`"${path}" does not exist`);
  }
};

export const downloadHtml = (url) => logAction(
  `Downloading html from "${url}"`,
  () => new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      let data = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve(data);
      });
    });
  })
);

export const downloadFile = (url, outputFilepath) => logAction(
  `Downloading file from "${url}"`,
  () => new Promise((resolve) => request
    .get(url, resolve)
    .pipe(fs.createWriteStream(outputFilepath))
  )
);

export const unzipFile = (zipfilepath, outputFilepath, filename) => logAction(
  `Unzipping "${filename}" as "${outputFilepath}" from "${zipfilepath}"`,
  () => new Promise((resolve) => fs.createReadStream(zipfilepath)
    .pipe(unzip.Parse())
    .on('entry', (entry) => {
      if(entry.path === filename) {
        entry.pipe(fs.createWriteStream(outputFilepath));
      } else {
        entry.autodrain();
      }
    })
    .on('finish', resolve)
  )
);

export const readFile = (filepath) => logAction(
  `Reading "${filepath}"`,
  () => fs.readFileSync(filepath, 'utf-8')
);

export const writeFile = (filepath, json) => logAction(
  `Writing "${filepath}"`,
  () => fs.writeFileSync(filepath, JSON.stringify(json))
);

export const removeFile = (filepath) => logAction(
  `Removing "${filepath}"`,
  () => fs.remove(filepath)
);
