import Order from '../models/Order';
// import Deliverer from '../models/Deliverer';
import File from '../models/File';

class OrderDeliveredController {
  async update(req, res) {
    const order = await Order.findOne({
      where: { deliverer_id: req.params.delivererId, id: req.params.orderId },
    });

    if (!order) {
      return res
        .status(401)
        .json({ error: "You can't change other deliverer order" });
    }

    if (order.start_date === null) {
      return res
        .status(401)
        .json({ error: "You can't deliver package without retrieving it" });
    }

    if (order.end_date != null) {
      return res
        .status(401)
        .json({ error: 'You already set this order as delivered.' });
    }

    const end_date = new Date();

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    await order.update({
      end_date,
      signature_id: file.id,
    });

    return res.json(order);
  }
}

export default new OrderDeliveredController();
