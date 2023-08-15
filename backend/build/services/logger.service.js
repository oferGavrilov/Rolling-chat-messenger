import fs from 'fs';
import { asyncLocalStorage } from './als.service.js';
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}
function getTime() {
    const now = new Date();
    return now.toLocaleString('he');
}
function isError(e) {
    return e && e.stack && e.message;
}
function doLog(level, ...args) {
    var _a;
    const strs = args.map((arg) => typeof arg === 'string' || isError(arg) ? arg : JSON.stringify(arg));
    let line = strs.join(' | ');
    const store = asyncLocalStorage.getStore();
    const userId = (_a = store === null || store === void 0 ? void 0 : store.loggedinUser) === null || _a === void 0 ? void 0 : _a._id;
    const str = userId ? `(userId: ${userId})` : '';
    line = `${getTime()} - ${level} - ${line} ${str}\n`;
    console.log(line);
    fs.appendFile('./logs/backend.log', line, (err) => {
        if (err)
            console.log('FATAL: cannot write to log file');
    });
}
export const logger = {
    debug(...args) {
        if (process.env.NODE_ENV === 'production')
            return;
        doLog('DEBUG', ...args);
    },
    info(...args) {
        doLog('INFO', ...args);
    },
    warn(...args) {
        doLog('WARN', ...args);
    },
    error(...args) {
        doLog('ERROR', ...args);
    },
};
//# sourceMappingURL=logger.service.js.map