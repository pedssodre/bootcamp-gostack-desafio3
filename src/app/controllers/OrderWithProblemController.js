import OrderProblem from '../models/OrderProblem';

class OrderWithProblemController {
  async index(req, res) {
    const { id } = req.params;
    const orderProblems = await OrderProblem.findAll({
      where: { order_id: id },
    });

    if (!orderProblems) {
      return res.status(401).json({ error: 'This order has no problems' });
    }

    return res.json(orderProblems);
  }
}

export default new OrderWithProblemController();
