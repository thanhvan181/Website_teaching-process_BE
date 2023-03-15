const os = require('os');
const app = require('./src/app');
const environment = require('./src/configs/environment.config');

process.env.TZ = 'Asia/Bangkok';
process.env.UV_THREADPOOL_SIZE = os.cpus().length;

app.listen(environment.port, () => {
  console.log(`Running http://localhost:${environment.port}`);
});
