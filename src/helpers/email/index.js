const nodemailer = require('nodemailer');
const mailConfig = require('../../configs/mailConfig');
const teacherService = require('../../api/teachers/service');
const studentService = require('../../api/students/service');
const __path = require('path');

const fs = require('fs');
const handlebars = require('handlebars');

const readHTMLFile = function (path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
    if (err) {
      callback(err);
      throw err;
    } else {
      callback(null, html);
    }
  });
};
const getDataEmail = async (input) => {
  const teacher = await teacherService.find({_id: input.teacher});
  return await Promise.all(
    input.student.map(async (item) => {
      const student = await studentService.get({_id: item});
      return {
        subject: 'Thông báo lịch học trung tâm Bight-Champs',
        to: student.email,
        username: student.name,
        teacher: teacher.name,
        link: teacher.link,
      };
    })
  );
};
module.exports = {
  sendEmail: async (replacements, options, path_file) => {
    try {
      const transporter = nodemailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        secure: false,
        auth: {
          user: mailConfig.USERNAME,
          pass: mailConfig.PASSWORD,
        },
      });
      readHTMLFile(
        __path.resolve(__dirname + `/template/${path_file}`),
        async function (err, html) {
          const template = handlebars.compile(html);
          const htmlToSend = template(replacements);
          //execute send mail
          await transporter.sendMail({from: mailConfig.FROM_ADDRESS, html: htmlToSend, ...options});
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
};
