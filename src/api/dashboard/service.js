const _orders = require('../orders/model');
const _paidClass = require('../paidClass/model');
const _students = require('../students/model');
const _teachers = require('../teachers/model');
const _users = require('../users/model');
const _courses = require('../courses/model');

module.exports = {
  dashboard: async (params) => {
    const date = new Date();
    if (!params.year) {
      params.year = date.getFullYear();
    }

    const FIRST_MONTH = 1;
    const LAST_MONTH = 12;
    const MONTHS_ARRAY = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ];

    const nullObj = MONTHS_ARRAY.reduce((obj, current) => {
      return {...obj, [current]: 0};
    }, {});

    const LAST_YEAR = new Date(`${params.year}-12-31`);
    const FIRST_YEAR = new Date(`${params.year}-01-01`);

    const orders = await _orders
      .aggregate([
        {
          $match: {
            createdAt: {$gte: FIRST_YEAR, $lte: LAST_YEAR},
          },
        },
        {
          $group: {
            _id: {year_month: {$substrCP: ['$createdAt', 0, 7]}},
            count: {$sum: 1},
          },
        },
        {
          $sort: {'_id.year_month': 1},
        },
        {
          $project: {
            _id: 0,
            count: 1,
            month_year: {
              $concat: [
                {
                  $arrayElemAt: [
                    MONTHS_ARRAY,
                    {$subtract: [{$toInt: {$substrCP: ['$_id.year_month', 5, 2]}}, 1]},
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            data: {$push: {k: '$month_year', v: '$count'}},
          },
        },
        {
          $addFields: {
            start_year: {$substrCP: [FIRST_YEAR, 0, 4]},
            end_year: {$substrCP: [FIRST_YEAR, 0, 4]},
            months1: {
              $range: [{$toInt: {$substrCP: [FIRST_YEAR, 5, 2]}}, {$add: [LAST_MONTH, 1]}],
            },
            months2: {
              $range: [FIRST_MONTH, {$add: [{$toInt: {$substrCP: [FIRST_YEAR, 5, 2]}}, 1]}],
            },
          },
        },
        {
          $addFields: {
            template_data: {
              $concatArrays: [
                {
                  $map: {
                    input: '$months1',
                    as: 'm1',
                    in: {
                      count: 0,
                      month_year: {
                        $concat: [{$arrayElemAt: [MONTHS_ARRAY, {$subtract: ['$$m1', 1]}]}],
                      },
                    },
                  },
                },
                {
                  $map: {
                    input: '$months2',
                    as: 'm2',
                    in: {
                      count: 0,
                      month_year: {
                        $concat: [{$arrayElemAt: [MONTHS_ARRAY, {$subtract: ['$$m2', 1]}]}],
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $addFields: {
            data: {
              $map: {
                input: '$template_data',
                as: 't',
                in: {
                  k: '$$t.month_year',
                  v: {
                    $reduce: {
                      input: '$data',
                      initialValue: 0,
                      in: {
                        $cond: [
                          {$eq: ['$$t.month_year', '$$this.k']},
                          {$add: ['$$this.v', '$$value']},
                          {$add: [0, '$$value']},
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            data: {$arrayToObject: '$data'},
            total: {$sum: 1},
            _id: 0,
          },
        },
        {
          $replaceRoot: {
            newRoot: '$data',
          },
        },
      ])
      .exec();

    const income = await _paidClass
      .aggregate([
        {
          $match: {
            createdAt: {$gte: FIRST_YEAR, $lte: LAST_YEAR},
          },
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'course',
            foreignField: '_id',
            as: 'course',
          },
        },
        {$unwind: {path: '$course', preserveNullAndEmptyArrays: true}},
        {
          $group: {
            _id: {year_month: {$substrCP: ['$createdAt', 0, 7]}},
            count: {
              $sum: '$course.fee',
            },
          },
        },
        {
          $sort: {'_id.year_month': 1},
        },
        {
          $project: {
            _id: 0,
            count: 1,
            month_year: {
              $concat: [
                {
                  $arrayElemAt: [
                    MONTHS_ARRAY,
                    {$subtract: [{$toInt: {$substrCP: ['$_id.year_month', 5, 2]}}, 1]},
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            data: {$push: {k: '$month_year', v: '$count'}},
          },
        },
        {
          $addFields: {
            start_year: {$substrCP: [FIRST_YEAR, 0, 4]},
            end_year: {$substrCP: [FIRST_YEAR, 0, 4]},
            months1: {
              $range: [{$toInt: {$substrCP: [FIRST_YEAR, 5, 2]}}, {$add: [LAST_MONTH, 1]}],
            },
            months2: {
              $range: [FIRST_MONTH, {$add: [{$toInt: {$substrCP: [FIRST_YEAR, 5, 2]}}, 1]}],
            },
          },
        },
        {
          $addFields: {
            template_data: {
              $concatArrays: [
                {
                  $map: {
                    input: '$months1',
                    as: 'm1',
                    in: {
                      count: 0,
                      month_year: {
                        $concat: [{$arrayElemAt: [MONTHS_ARRAY, {$subtract: ['$$m1', 1]}]}],
                      },
                    },
                  },
                },
                {
                  $map: {
                    input: '$months2',
                    as: 'm2',
                    in: {
                      count: 0,
                      month_year: {
                        $concat: [{$arrayElemAt: [MONTHS_ARRAY, {$subtract: ['$$m2', 1]}]}],
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $addFields: {
            data: {
              $map: {
                input: '$template_data',
                as: 't',
                in: {
                  k: '$$t.month_year',
                  v: {
                    $reduce: {
                      input: '$data',
                      initialValue: 0,
                      in: {
                        $cond: [
                          {$eq: ['$$t.month_year', '$$this.k']},
                          {$add: ['$$this.v', '$$value']},
                          {$add: [0, '$$value']},
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            data: {$arrayToObject: '$data'},
            total: {$sum: 1},
            _id: 0,
          },
        },
        {
          $replaceRoot: {
            newRoot: '$data',
          },
        },
      ])
      .exec();

    const students = await _students
      .aggregate([
        {
          $match: {
            createdAt: {$gte: FIRST_YEAR, $lte: LAST_YEAR},
          },
        },
        {
          $group: {
            _id: {year_month: {$substrCP: ['$createdAt', 0, 7]}},
            count: {$sum: 1},
          },
        },
        {
          $sort: {'_id.year_month': 1},
        },
        {
          $project: {
            _id: 0,
            count: 1,
            month_year: {
              $concat: [
                {
                  $arrayElemAt: [
                    MONTHS_ARRAY,
                    {$subtract: [{$toInt: {$substrCP: ['$_id.year_month', 5, 2]}}, 1]},
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            data: {$push: {k: '$month_year', v: '$count'}},
          },
        },
        {
          $addFields: {
            start_year: {$substrCP: [FIRST_YEAR, 0, 4]},
            end_year: {$substrCP: [FIRST_YEAR, 0, 4]},
            months1: {
              $range: [{$toInt: {$substrCP: [FIRST_YEAR, 5, 2]}}, {$add: [LAST_MONTH, 1]}],
            },
            months2: {
              $range: [FIRST_MONTH, {$add: [{$toInt: {$substrCP: [FIRST_YEAR, 5, 2]}}, 1]}],
            },
          },
        },
        {
          $addFields: {
            template_data: {
              $concatArrays: [
                {
                  $map: {
                    input: '$months1',
                    as: 'm1',
                    in: {
                      count: 0,
                      month_year: {
                        $concat: [{$arrayElemAt: [MONTHS_ARRAY, {$subtract: ['$$m1', 1]}]}],
                      },
                    },
                  },
                },
                {
                  $map: {
                    input: '$months2',
                    as: 'm2',
                    in: {
                      count: 0,
                      month_year: {
                        $concat: [{$arrayElemAt: [MONTHS_ARRAY, {$subtract: ['$$m2', 1]}]}],
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $addFields: {
            data: {
              $map: {
                input: '$template_data',
                as: 't',
                in: {
                  k: '$$t.month_year',
                  v: {
                    $reduce: {
                      input: '$data',
                      initialValue: 0,
                      in: {
                        $cond: [
                          {$eq: ['$$t.month_year', '$$this.k']},
                          {$add: ['$$this.v', '$$value']},
                          {$add: [0, '$$value']},
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            data: {$arrayToObject: '$data'},
            total: {$sum: 1},
            _id: 0,
          },
        },
        {
          $replaceRoot: {
            newRoot: '$data',
          },
        },
      ])
      .exec();

    const result = {
      statistic: {
        course: await _courses.countDocuments({createdAt: {$gte: FIRST_YEAR, $lte: LAST_YEAR}}),
        orders: orders[0] || nullObj,
        income: income[0] || nullObj,
        students: students[0] || nullObj,
      },
      statistic_year: params.year,
    };

    if (params.use === 'admin') {
      const teachers = await _teachers
        .aggregate([
          {
            $match: {
              createdAt: {$gte: FIRST_YEAR, $lte: LAST_YEAR},
            },
          },
          {
            $group: {
              _id: {year_month: {$substrCP: ['$createdAt', 0, 7]}},
              count: {$sum: 1},
            },
          },
          {
            $sort: {'_id.year_month': 1},
          },
          {
            $project: {
              _id: 0,
              count: 1,
              month_year: {
                $concat: [
                  {
                    $arrayElemAt: [
                      MONTHS_ARRAY,
                      {$subtract: [{$toInt: {$substrCP: ['$_id.year_month', 5, 2]}}, 1]},
                    ],
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              data: {$push: {k: '$month_year', v: '$count'}},
            },
          },
          {
            $addFields: {
              start_year: {$substrCP: [FIRST_YEAR, 0, 4]},
              end_year: {$substrCP: [FIRST_YEAR, 0, 4]},
              months1: {
                $range: [{$toInt: {$substrCP: [FIRST_YEAR, 5, 2]}}, {$add: [LAST_MONTH, 1]}],
              },
              months2: {
                $range: [FIRST_MONTH, {$add: [{$toInt: {$substrCP: [FIRST_YEAR, 5, 2]}}, 1]}],
              },
            },
          },
          {
            $addFields: {
              template_data: {
                $concatArrays: [
                  {
                    $map: {
                      input: '$months1',
                      as: 'm1',
                      in: {
                        count: 0,
                        month_year: {
                          $concat: [{$arrayElemAt: [MONTHS_ARRAY, {$subtract: ['$$m1', 1]}]}],
                        },
                      },
                    },
                  },
                  {
                    $map: {
                      input: '$months2',
                      as: 'm2',
                      in: {
                        count: 0,
                        month_year: {
                          $concat: [{$arrayElemAt: [MONTHS_ARRAY, {$subtract: ['$$m2', 1]}]}],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            $addFields: {
              data: {
                $map: {
                  input: '$template_data',
                  as: 't',
                  in: {
                    k: '$$t.month_year',
                    v: {
                      $reduce: {
                        input: '$data',
                        initialValue: 0,
                        in: {
                          $cond: [
                            {$eq: ['$$t.month_year', '$$this.k']},
                            {$add: ['$$this.v', '$$value']},
                            {$add: [0, '$$value']},
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            $project: {
              data: {$arrayToObject: '$data'},
              total: {$sum: 1},
              _id: 0,
            },
          },
          {
            $replaceRoot: {
              newRoot: '$data',
            },
          },
        ])
        .exec();

      const users = await _users
        .aggregate([
          {
            $match: {
              createdAt: {$gte: FIRST_YEAR, $lte: LAST_YEAR},
            },
          },
          {
            $group: {
              _id: {year_month: {$substrCP: ['$createdAt', 0, 7]}},
              count: {$sum: 1},
            },
          },
          {
            $sort: {'_id.year_month': 1},
          },
          {
            $project: {
              _id: 0,
              count: 1,
              month_year: {
                $concat: [
                  {
                    $arrayElemAt: [
                      MONTHS_ARRAY,
                      {$subtract: [{$toInt: {$substrCP: ['$_id.year_month', 5, 2]}}, 1]},
                    ],
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              data: {$push: {k: '$month_year', v: '$count'}},
            },
          },
          {
            $addFields: {
              start_year: {$substrCP: [FIRST_YEAR, 0, 4]},
              end_year: {$substrCP: [FIRST_YEAR, 0, 4]},
              months1: {
                $range: [{$toInt: {$substrCP: [FIRST_YEAR, 5, 2]}}, {$add: [LAST_MONTH, 1]}],
              },
              months2: {
                $range: [FIRST_MONTH, {$add: [{$toInt: {$substrCP: [FIRST_YEAR, 5, 2]}}, 1]}],
              },
            },
          },
          {
            $addFields: {
              template_data: {
                $concatArrays: [
                  {
                    $map: {
                      input: '$months1',
                      as: 'm1',
                      in: {
                        count: 0,
                        month_year: {
                          $concat: [{$arrayElemAt: [MONTHS_ARRAY, {$subtract: ['$$m1', 1]}]}],
                        },
                      },
                    },
                  },
                  {
                    $map: {
                      input: '$months2',
                      as: 'm2',
                      in: {
                        count: 0,
                        month_year: {
                          $concat: [{$arrayElemAt: [MONTHS_ARRAY, {$subtract: ['$$m2', 1]}]}],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            $addFields: {
              data: {
                $map: {
                  input: '$template_data',
                  as: 't',
                  in: {
                    k: '$$t.month_year',
                    v: {
                      $reduce: {
                        input: '$data',
                        initialValue: 0,
                        in: {
                          $cond: [
                            {$eq: ['$$t.month_year', '$$this.k']},
                            {$add: ['$$this.v', '$$value']},
                            {$add: [0, '$$value']},
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            $project: {
              data: {$arrayToObject: '$data'},
              total: {$sum: 1},
              _id: 0,
            },
          },
          {
            $replaceRoot: {
              newRoot: '$data',
            },
          },
        ])
        .exec();

      result.statistic.teachers = teachers[0] || nullObj;
      result.statistic.users = users[0] || nullObj;
    }

    return result;
  },
};
