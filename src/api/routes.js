const express = require('express');

const apiRouter = express.Router();

// import router
const userRouter = require('./users/router');
const slotRouter = require('./slots/router');
const orderRouter = require('./orders/router');
const teacherRouter = require('./teachers/router');
const demoClass = require('./demoClass/router');
const studentRouter = require('./students/router');
const paidClassRouter = require('./paidClass/router');
const courseRouter = require('./courses/router');
const authRouter = require('./auth/router');
const curriculumRouter = require('./curriculum/router');
const gameRouter = require('./game/router');
const leaderboardRouter = require('./loaderboard/router');
const playerResultRouter = require('./playerResult/router');
const quizRouter = require('./quiz/router');
const uploadRouter = require('./upload/router');
const dashboardRouter = require('./dashboard/router');
const feedbackRouter = require('./feedback/router');

// use router
apiRouter.use('/v1/users', userRouter);
apiRouter.use('/v1/slots', slotRouter);
apiRouter.use('/v1/orders', orderRouter);
apiRouter.use('/v1/teachers', teacherRouter);
apiRouter.use('/v1/demoClass', demoClass);
apiRouter.use('/v1/students', studentRouter);
apiRouter.use('/v1/paidClass', paidClassRouter);
apiRouter.use('/v1/courses', courseRouter);
apiRouter.use('/v1/auth', authRouter);
apiRouter.use('/v1/curriculum', curriculumRouter);
apiRouter.use('/v1/games', gameRouter);
apiRouter.use('/v1/leaderboard', leaderboardRouter);
apiRouter.use('/v1/playerResults', playerResultRouter);
apiRouter.use('/v1/quizes', quizRouter);
apiRouter.use('/v1/upload', uploadRouter);
apiRouter.use('/v1/dashboard', dashboardRouter);
apiRouter.use('/v1/feedbacks', feedbackRouter);

// api check
apiRouter.get('/checkstatus', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'OK',
  });
});

module.exports = apiRouter;
