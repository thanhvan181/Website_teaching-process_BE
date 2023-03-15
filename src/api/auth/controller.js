const authService = require('./service');
const emailExistence = require('email-existence');
const dns = require('dns');
const net = require('net');
const async = require('async');

const authController = {
  checkUserLogin: async (req, res, next) => {
    try {
      const accessToken = await authService.checkUser(req);
      if (accessToken) {
        return authService.findUser(accessToken, (user) => {
          if (user) return res.status(200).json({accessToken, user});
          return res.status(404).send({
            message: 'Not found',
          });
        });
      }
      return res.status(404).send({
        message: 'Not found',
      });
    } catch (error) {
      next(error);
    }
  },
  getUserLogin: (req, res, next) => {
    try {
      authService.findUser(req.body.accessToken, (user) => {
        if (user) return res.status(200).json(user);
        return res.status(404).send({
          message: 'Not found',
        });
      });
    } catch (error) {
      next(error);
    }
  },
  getListPermisstion: async (req, res, next) => {
    try {
      const lstPers = await authService.findListPermisstions();
      return res.status(200).json(lstPers);
    } catch (error) {
      next(error);
    }
  },
  getListModel: (req, res, next) => {
    try {
      const models = authService.findListModels();
      res.status(200).json(models);
    } catch (error) {
      next(error);
    }
  },
  createPermisstion: async (req, res, next) => {
    try {
      await authService.createNewPermisstion(req.body);
      res.status(201).send('OK');
    } catch (error) {
      next(error);
    }
  },
  updatePermisstion: async (req, res, next) => {
    try {
      await authService.updatePermisstionById(req.params.id, req.body);
      res.status(200).send('OK');
    } catch (error) {
      next(error);
    }
  },
  superAdminLogin: async (req, res, next) => {
    try {
      const result = await authService.superAdminLogin(req.body);
      if (result) {
        return res.status(200).json({
          status: 200,
          message: 'Get data success',
          results: result,
        });
      }
      return res.status(200).json({
        status: 404,
        message: 'Login failed',
      });
    } catch (error) {
      return res.status(200).json({
        status: 404,
        message: 'Login failed',
      });
    }
  },
  checkEmailExist: async (req, res, next) => {
    try {
      await emailExistence.check(req.body.email, (err, response) => {
        return res.status(200).json({
          status: 200,
          result: response,
        });
      });
    } catch (error) {
      next(error);
    }
  },
  checkEmailExistV2: async (req, res, next) => {
    try {
      const {email} = req.body;
      dns.resolveMx(email.split('@')[1], (err, addresses) => {
        if (err || addresses.length === 0) {
          return response.status(404).json({
            status: 404,
            message: 'Email not available',
          });
        }
        addresses = addresses.sort(function (a, b) {
          return a.priority - b.priority;
        });
        var res, undetermined;
        var cond = false,
          j = 0;
        async.doWhilst(
          function (done) {
            var conn = net.createConnection(25, addresses[j].exchange);
            var commands = [
              'helo ' + addresses[j].exchange,
              'mail from: <' + email + '>',
              'rcpt to: <' + email + '>',
            ];
            var i = 0;
            conn.setEncoding('ascii');
            conn.setTimeout(5000);
            conn.on('error', function () {
              conn.emit('false');
            });
            conn.on('false', function () {
              res = false;
              undetermined = false;
              cond = false;
              done(err, false);
              conn.removeAllListeners();
              conn.destroy();
            });
            conn.on('connect', function () {
              conn.on('prompt', function () {
                if (i < 3) {
                  conn.write(commands[i]);
                  conn.write('\r\n');
                  i++;
                } else {
                  res = true;
                  undetermined = false;
                  cond = false;
                  done(err, true);
                  conn.removeAllListeners();
                  conn.destroy();
                }
              });
              conn.on('undetermined', function () {
                j++;
                cond = true;
                res = false;
                undetermined = true;
                done(err, false, true);

                conn.removeAllListeners();
                conn.destroy();
              });
              conn.on('timeout', function () {
                conn.emit('undetermined');
              });
              conn.on('data', function (data) {
                if (
                  data.indexOf('220') == 0 ||
                  data.indexOf('250') == 0 ||
                  data.indexOf('\n220') != -1 ||
                  data.indexOf('\n250') != -1
                ) {
                  conn.emit('prompt');
                } else if (data.indexOf('\n550') != -1 || data.indexOf('550') == 0) {
                  conn.emit('false');
                } else {
                  conn.emit('undetermined');
                }
              });
            });
          },
          function () {
            return j < addresses.length && cond;
          },
          function (err) {
            if (!res) {
              return response.status(404).json({
                status: 404,
                message: 'Email not available',
              });
            }
            return response.status(200).json({
              status: 200,
              message: 'Email ok',
            });
          }
        );
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
