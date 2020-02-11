import { Op } from 'sequelize';
import Order from '../models/Order';

class ClosedOrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      where: {
        deliverer_id: req.params.id,
        end_date: {
          [Op.not]: null,
        },
      },
    });

    if (!orders) {
      return res.status(400).json({ error: 'Order not found' });
    }

    return res.json(orders);
  }
}

export default new ClosedOrderController();
