const _quiz = require('./model');

module.exports = {
  findAll: async (filter) => {
    const curriculum = await _quiz.find()
      
      
    return curriculum;
  },
  find: async (filter) => {
    const quiz = await _quiz.findOne(filter);
    return quiz;
  },
//   update: async (condition, doc, option) => {
//     const curriculum = await _curriculum.findOneAndUpdate(condition, doc, option);
//     return curriculum;
//   },
//   remove: async (condition) => {
//     const curriculum = await _curriculum.findOneAndUpdate(
//       condition,
//       {is_deleted: true},
//       {new: true}
//     );
//     return curriculum;
//   },
//   create: async (data) => {
//     const curriculum = await _curriculum.create(data);
//     return curriculum;
//   },
};
