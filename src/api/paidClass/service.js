const _paidClass = require('./model');

const findAll = async (filter) => {
  const paidClasses = await _paidClass
    .find({...filter, is_deleted: {$ne: true}})
    .populate('teacher')
    .populate('student')
    .populate('course')
    .populate('schedule.slot')
    .populate('schedule.curriculum');
  return paidClasses;
};
const find = async (filter) => {
  const paidClass = await _paidClass
    .findOne({...filter, is_deleted: {$ne: true}})
    .populate('teacher')
    .populate('student')
    .populate('course')
    .populate('schedule.slot')
    .populate('schedule.curriculum');
  return paidClass;
};
const update = async (condition, doc, option) => {
  const paidClass = await _paidClass.findOneAndUpdate(condition, doc, option);
  return paidClass;
};
const remove = async (condition) => {
  const paidClass = await _paidClass.findOneAndUpdate(condition, {is_deleted: true}, {new: true});
  return paidClass;
};
const create = async (data) => {
  let response = await _paidClass.create(data);
  const paidClass = await find({_id: response._id});
  return paidClass;
};
module.exports = {
  findAll,
  find,
  update,
  remove,
  create,
};
