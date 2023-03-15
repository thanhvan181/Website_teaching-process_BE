const slotService = require('../api/slots/service');
const courseService = require('../api/courses/service');
const curriculumService = require('../api/curriculum/service');
const {WEEKENDS} = require('../constants');

const getDateByDay = (data) => {
  const indexDay = findIndexDay(data.day);
  const currentIndexDay = new Date().getDay();
  let result = [];
  let effect = indexDay - currentIndexDay;
  if (effect < 0) {
    effect = effect + 7;
  }
  for (let i = 0; i < 4; i++) {
    result.push(new Date(new Date().setDate(new Date().getDate() + (effect + i * 7))));
  }
  return result;
};

const loopSchedule = async (schedule, start_date, course) => {
  let newSchedule = [];
  let result = [];
  let flag = [];
  const curriculum = await curriculumService.findAll({courses: course});
  let {total_lesson} = await courseService.get(course);
  let number_iterations =
    total_lesson % schedule.length == 0
      ? total_lesson / schedule.length
      : Math.floor(total_lesson / schedule.length) + 1;
  const initIndex = new Date(start_date).getDay();
  const arrIndex = [0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6].splice(initIndex, 7);

  for (let i = 0; i < schedule.length; i++) {
    const indexItem = findIndexDay(schedule[i].day);
    arrIndex.forEach((val, index) => {
      if (val == indexItem) {
        if (newSchedule[index]?.length > 0) {
          newSchedule[index].push(schedule[i]);
        } else {
          newSchedule[index] = [schedule[i]];
        }
      }
    });
  }

  newSchedule = await Promise.all(
    newSchedule.map(async (item) => {
      if (!item.length || item.length < 2) return item;
      await sortTimeOrder(item);
      return item;
    })
  );

  newSchedule = newSchedule.filter((el) => el !== undefined).flat();

  for (let i = 0; i < number_iterations; i++) {
    flag.push(...newSchedule);
    for (let j = 0; j < newSchedule.length; j++) {
      const indexDay = findIndexDay(flag[j].day);
      const startDay = new Date(start_date).getDay();
      let effect = indexDay - startDay;
      if (effect < 0) {
        effect = effect + 7;
      }
      const date = new Date(start_date).setDate(new Date(start_date).getDate() + effect + i * 7);
      const currIndex = curriculum.findIndex((item) => item.lesson == j);
      result.push({
        ...flag[j],
        date: await mergeStartTimeSlotToDate(date, flag[j].slot),
        curriculum: curriculum[currIndex],
      });
    }
  }

  return result.splice(0, total_lesson);
};

const groupDayOfWeek = (schedule) => {
  let result = [];
  for (let i = 0; i < schedule.length; i++) {
    if (result[findIndexDay(schedule[i].day)]?.length > 0) {
      result[findIndexDay(schedule[i].day)].push(schedule[i]);
    } else {
      result[findIndexDay(schedule[i].day)] = [schedule[i]];
    }
  }
  return result;
};

const findIndexDay = (day) => {
  if (!WEEKENDS.includes(day.toLowerCase().trim())) {
    throw 'Parameter is not a day!';
  }
  for (let i = 0; i < WEEKENDS.length; i++) {
    if (WEEKENDS[i] == day.toLowerCase().trim()) {
      return i;
    }
  }
};

async function getEffectDate(id) {
  const slot = await slotService.get(id);
  const date = new Date(slot.start).setFullYear(2022, 1, 1);
  return Date.parse(new Date(date));
}

const sortTimeOrder = async (arr) => {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const parseI = await getEffectDate(arr[i].slot || arr[i]._id);
      const parseJ = await getEffectDate(arr[j].slot || arr[j]._id);
      if (parseI > parseJ) {
        let tg = arr[i];
        arr[i] = arr[j];
        arr[j] = tg;
      }
    }
  }
};
const sortDateOrder = (arr) => {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const parseI = Date.parse(new Date(arr[i].date || arr[i].schedule.date));
      const parseJ = Date.parse(new Date(arr[j].date || arr[j].schedule.date));
      if (parseI > parseJ) {
        let tg = arr[i];
        arr[i] = arr[j];
        arr[j] = tg;
      }
    }
  }
  return arr;
};

const mergeStartTimeSlotToDate = async (date, slot) => {
  let time = await slotService.get(slot);
  time = new Date(time.start);
  return new Date(new Date(date).setHours(time.getHours(), time.getMinutes(), 0));
};

module.exports = {
  getDateByDay,
  loopSchedule,
  sortTimeOrder,
  sortDateOrder,
  findIndexDay,
  groupDayOfWeek,
  mergeStartTimeSlotToDate,
};
