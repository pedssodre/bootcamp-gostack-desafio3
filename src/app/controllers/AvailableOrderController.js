import Order from '../models/Order';
import Deliverer from '../models/Deliverer';

class AvailableOrderController {
  async index(req, res) {
    const checkDeliverer = await Deliverer.findByPk(req.params.id);

    if (!checkDeliverer) {
      return res.status(401).json({ error: 'Deliverer not found' });
    }

    const orders = await Order.findAll({
      where: {
        deliverer_id: req.params.id,
        start_date: null,
        end_date: null,
        canceled_at: null,
      },
    });

    if (!orders) {
      return res.status(400).json({ error: 'No order available' });
    }

    return res.json(orders);
  }
}

export default new AvailableOrderController();
