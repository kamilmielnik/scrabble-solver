import dotenv from 'dotenv';
import NodeSsh from 'node-ssh';
import { log, logError, logInfo, logSuccess } from './utils';

dotenv.config();

const REMOTE_NODE_PATH = '/root/.nvm/versions/node/v12.15.0/bin/node';
const SOURCE_DIRECTORY = 'dist';
const WWW_DIRECTORY = '/var/www';
const TARGET_DIRECTORY = 'scrabble-solver';
const BACKEND_ENTRY_FILE = 'index.js';
const UNIQUE_PID = 'scrabble-solver';

const connect = async (ssh) => {
  logInfo('> Connecting');
  await ssh.connect({
    host: process.env.DEPLOY_HOST,
    username: process.env.DEPLOY_USERNAME,
    password: process.env.DEPLOY_PASSWORD
  });
};

const getBackendPid = async (ssh) => {
  logInfo('> Getting backend PID');
  let pid = null;
  const result = await ssh.exec(`ps axf | grep ${UNIQUE_PID} | grep -v grep | awk '{print $1}'`, [], {
    onStdout(chunk) {
      pid = chunk.toString('utf8');
    }
  });
  return pid;
};

const killBackend = async (ssh) => {
  try {
    const pid = await getBackendPid(ssh);
    if (!pid) {
      return logInfo('> Backend is not running');
    }

    logInfo('> Killing backend');
    await ssh.exec(`kill -9 ${pid}`);
  } catch (error) {
    logError('> Failed to kill backend');
    log(error, 1);
  }
};

const removeOldFiles = async (ssh) => {
  try {
    logInfo('> Removing old files');
    await ssh.exec(`rm -rf ${TARGET_DIRECTORY}`, [], { cwd: WWW_DIRECTORY });
  } catch (error) {
    logError('> Failed to remove old files');
    log(error, 1);
  }
};

const ensureDirectoryExists = async (ssh) => {
  logInfo('> Ensuring directory exists');
  await ssh.exec(`mkdir ${TARGET_DIRECTORY}`, [], { cwd: WWW_DIRECTORY });
};

const upload = async (ssh) => {
  logInfo('> Uploading');
  await ssh.putDirectory(SOURCE_DIRECTORY, `${WWW_DIRECTORY}/${TARGET_DIRECTORY}/`, {
    recursive: true
  });
};

const startServer = async (ssh) => {
  logInfo('> Starting server');
  const envVariables = [];
  await ssh.execCommand(
    `nohup ${REMOTE_NODE_PATH} ${BACKEND_ENTRY_FILE} dictionaries/ --${UNIQUE_PID} > /dev/null 2>&1 &`,
    {
      cwd: `${WWW_DIRECTORY}/${TARGET_DIRECTORY}/`
    }
  );
};

const disconnect = (ssh) => {
  logInfo('> Disconnecting');
  ssh.dispose();
};

const retry = async (action, retries = 3) => {
  try {
    await action();
  } catch (error) {
    if (retries > 0) {
      log(error, 1);
      await retry(action, retries - 1);
    } else {
      throw error;
    }
  }
};

const deploy = async () => {
  const ssh = new NodeSsh();

  try {
    await connect(ssh);
    await killBackend(ssh);
    await removeOldFiles(ssh);
    await ensureDirectoryExists(ssh);
    await retry(() => upload(ssh));
    await startServer(ssh);
  } catch (error) {
    log(error, 1);
  } finally {
    disconnect(ssh);
  }
};

deploy();
