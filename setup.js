process.version = '';
process.nextTick = setImmediate;
global.Buffer = global.Buffer || require('buffer').Buffer;
