import EventEmitter from 'events';

class AuthEventEmitter extends EventEmitter {}

const authEventEmitter: AuthEventEmitter = new AuthEventEmitter();

export default authEventEmitter;
