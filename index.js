// import RedisService from './bootstrap/redis';
// (async() => { await RedisService.init(); })();
// import './bootstrap/datagram';
import './bootstrap/database';
// import './bootstrap/startupProcessor';
import { app as server } from './bootstrap/server';
import config from 'config';

const PORT = config.get('Server_Port') || 8000;


// process.on('uncaughtException', (err) => {
//     console.log('Uncaught Exception: ', err);
//     // console.log(err.stack);
// });
//
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

process.on('rejectionHandled', (err) => {
    console.log(err.code);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`app running on port ${PORT}`);
});