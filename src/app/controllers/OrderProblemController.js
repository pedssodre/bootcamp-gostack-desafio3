import * as Yup from 'yup';
import { Op } from 'sequelize';

import File from '../models/File';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliverer from '../models/Deliverer';
import OrderProblem from '../models/OrderProblem';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class OrderProblemController {
  async index(req, res) {
    const problems = await OrderProblem.findAll({
      order: ['created_at', 'updated_at'],
      attributes: ['id', 'order_id', 'description'],
      include: [
        {
          model: Order,
          as: 'order',
          attributes: [
            'id',
            'product',
            'canceled_at',
            'start_date',
            'end_date',
          ],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: [
                'id',
                'name',
                'street',
                'number',
                'complement',
                'state',
                'city',
                'zipcode',
              ],
            },
            {
              model: Deliverer,
              as: 'deliverer',
              attributes: ['id', 'name', 'email'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['id', 'name', 'path', 'url'],
                },
              ],
            },
            {
              model: File,
              as: 'signature',
              attributes: ['id', 'name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(problems);
  }

  async show(req, res) {
    const { id } = req.params;

    const problem = await OrderProblem.findOne({
      where: { order_id: id },
      order: ['created_at', 'updated_at'],
      attributes: ['id', 'order_id', 'description'],
      include: [
        {
          model: Order,
          as: 'order',
          attributes: [
            'id',
            'product',
            'canceled_at',
            'start_date',
            'end_date',
          ],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: [
                'id',
                'name',
                'street',
                'number',
                'complement',
                'state',
                'city',
                'zipcode',
              ],
            },
            {
              model: Deliverer,
              as: 'deliverer',
              attributes: ['id', 'name', 'email'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['id', 'name', 'path', 'url'],
                },
              ],
            },
            {
              model: File,
              as: 'signature',
              attributes: ['id', 'name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(problem);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { order_id } = req.params;
    const { description } = req.body;

    const order = await Order.findByPk(order_id, {
      where: {
        end_date: { [Op.is]: null },
      },
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zipcode',
          ],
        },
        {
          model: Deliverer,
          as: 'deliverer',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'name', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    if (order.start_date === null) {
      return res.status(400).json({
        error:
          'This order still on our facility, please first take it before you add some problem',
      });
    }

    const { id } = await OrderProblem.create({ order_id, description });

    return res.json({
      problem: {
        id,
        order,
        description,
      },
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const problem = await OrderProblem.findByPk(id, {
      attributes: ['id', 'order_id', 'description'],
      include: [
        {
          model: Order,
          as: 'order',
          attributes: [
            'id',
            'product',
            'canceled_at',
            'start_date',
            'end_date',
          ],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: [
                'id',
                'name',
                'street',
                'number',
                'complement',
                'state',
                'city',
                'zipcode',
              ],
            },
            {
              model: Deliverer,
              as: 'deliverer',
              attributes: ['id', 'name', 'email'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['id', 'name', 'path', 'url'],
                },
              ],
            },
            {
              model: File,
              as: 'signature',
              attributes: ['id', 'name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    if (!problem) {
      return res
        .status(400)
        .json({ error: 'First insert one problem to this order' });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    if (order.canceled_at !== null) {
      return res.status(401).json({ error: 'Order already canceled' });
    }

    order.canceled_at = new Date();

    await order.save();

    await Queue.add(CancellationMail.key, {
      problem,
    });

    return res.json(order);
  }
}

export default new OrderProblemController();
