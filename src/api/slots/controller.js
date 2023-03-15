const slotService = require('./service');
const {sortTimeOrder} = require('../../helpers/date');

module.exports = {
  createSlot: async (req, res, next) => {
    try {
      const slot = await slotService.create(req.body);
      return res.status(200).json(slot);
    } catch (error) {
      next(error);
    }
  },
  getAllSlots: async (req, res, next) => {
    try {
      const slots = await slotService.getAll();
      await sortTimeOrder(slots);
      return res.status(200).json(slots);
    } catch (error) {
      next(error);
    }
  },
  getSlot: async (req, res, next) => {
    try {
      const slot = await slotService.get(req.params.id);
      return res.status(200).json(slot);
    } catch (error) {
      next(error);
    }
  },
  removeSlot: async (req, res, next) => {
    try {
      const slot = await slotService.remove(req.params.id);
      return res.status(200).json(slot);
    } catch (error) {
      next(error);
    }
  },
  updateSlot: async (req, res, next) => {
    try {
      const slot = await slotService.update(req.params.id, req.body);
      return res.status(200).json(slot);
    } catch (error) {
      next(error);
    }
  },
};
