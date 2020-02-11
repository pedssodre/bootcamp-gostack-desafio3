import {
  isBefore,
  isAfter,
  setSeconds,
  setMinutes,
  setHours,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';
import Order from '../models/Order';

class OrderRetrieveController {
  async update(req, res) {
    const order = await Order.findOne({
      where: { deliverer_id: req.body.deliverer_id, id: req.params.id },
    });

    if (!order) {
      return res
        .status(401)
        .json({ error: "You can't update orders from another deliverer" });
    }

    const dateAfter = setSeconds(setMinutes(setHours(new Date(), 8), 0), 0);
    const dateBefore = setSeconds(setMinutes(setHours(new Date(), 18), 0), 0);

    const checkTime =
      isAfter(new Date(), dateAfter) && isBefore(new Date(), dateBefore);

    if (!checkTime) {
      return res
        .status(401)
        .json({ error: 'You can only retrieve packages between 8am and 6pm' });
    }

    const date = new Date();

    const checkOrderDate = await Order.findAll({
      where: {
        deliverer_id: req.body.deliverer_id,
        start_date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    });

    if (checkOrderDate.length > 5) {
      return res
        .status(401)
        .json({ error: 'You can only retrieve 5 packages per day' });
    }

    if (order.start_date !== null) {
      return res
        .status(401)
        .json({ error: 'You already retrieved this package' });
    }

    order.start_date = new Date();

    await order.save();

    return res.json({ message: 'You retrieved the package' });
  }
}

export default new OrderRetrieveController();
