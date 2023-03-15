// import express from 'express';
// import http from 'node:http';

const path = require('path');
const formidable = require('formidable');
const fs = require('fs/promises');

const uploadFile = async (req, res, next) => {
  try {
    const formidableOptions = {
      // uploadDir: os.tmpdir()
      uploadDir: './public',
    };
    console.log('Formidabl Option', formidableOptions);
    const form = formidable(formidableOptions);

    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      // let oldPath = files.profilePic.path;
      // let newPath = path.join(__dirname, 'uploads')
      //     + '/' + files.profilePic.name
      // let rawData = fs.readFileSync(oldPath)
      // fs.writeFile(newPath, rawData, function (err) {
      //     if (err) console.log(err)
      //     return res.send("Successfully uploaded")
      // })
      console.log('FIELDS: ', fields);
      console.log('FILES: ', files);
      res.json({fields, files});
    });
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      message: 'khong them dc ',
    });
  }
};
const deleteFile = async (req, res) => {
  console.log('Req params: ', req.params);
  console.log('Req body: ', req.body);
  console.log(__dirname);
  console.log(process.cwd());
  try {
    if (!req.params.fileName) {
      res.status(400).send('Please add file name !');
    }
    console.log('PATH: ', path.join(process.cwd(), 'public', req.params.fileName));
    await fs.unlink(path.join(process.cwd(), 'public', req.params.fileName));
    res.status.json({
      message: 'Delete success !',
    });
  } catch (error) {
    // console.log("error", error);
    res.status(400).json({
      message: 'File Not Found !',
    });
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
