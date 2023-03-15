const dashboardService = require('./service');

module.exports = {
  getDashboardAdmin: async (req, res, next) => {
    try {
      const data = await dashboardService.dashboard(req.query);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
};
