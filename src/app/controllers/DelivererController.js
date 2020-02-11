import * as Yup from 'yup';

import Deliverer from '../models/Deliverer';
import File from '../models/File';

class DelivererController {
  async index(req, res) {
    const { page = 1, per_page = 20 } = req.query;

    const deliverers = await Deliverer.findAll({
      order: ['name'],
      attributes: ['id', 'name', 'avatar_id', 'email'],
      limit: per_page,
      offset: (page - 1) * per_page,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const { id, name, email } = await Deliverer.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const { id: delivererId } = req.params;

    const deliverer = await Deliverer.findByPk(delivererId);

    if (!deliverer) {
      return res.status(400).json({ error: 'Deliverer not found!' });
    }

    await deliverer.update(req.body);

    const { id, name, email, avatar } = await Deliverer.findByPk(delivererId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({ id, name, email, avatar });
  }

  async delete(req, res) {
    const deliverer = await Deliverer.findByPk(req.params.id);

    if (!deliverer) {
      return res.status(400).json({ error: 'Deliverer not found' });
    }
    await deliverer.destroy();

    return res.json(deliverer);
  }
}

export default new DelivererController();
