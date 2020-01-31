import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const recipient = await Recipient.findAll();

    return res.json(recipient);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      recipientId: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid Id' });
    }

    const { recipientId } = req.params;

    const recipient = await Recipient.findByPk(recipientId);

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient does not exist ' });
    }

    return res.json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number()
        .positive()
        .required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.string()
        .required()
        .length(9),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }

    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipiente ja existe' });
    }

    const {
      id,
      name,
      street,
      number,
      state,
      city,
      zipcode,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      state,
      city,
      zipcode,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipientId: Yup.number()
        .positive()
        .required(),
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number().positive(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zipcode: Yup.string().length(9),
    });

    if (!(await schema.isValid({ ...req.params, ...req.body }))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }

    const { recipientId } = req.params;

    let recipient = await Recipient.findByPk(recipientId);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exist' });
    }

    const { name, street, number } = req.body;

    if (
      name === recipient.name &&
      street === recipient.street &&
      number === recipient.number
    ) {
      return res
        .status(400)
        .json({ error: 'Recipient already exist in this address' });
    }

    recipient = await recipient.update(req.body);

    return res.json(recipient);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      recipientId: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid Id' });
    }

    const { recipientId } = req.params;

    const recipient = await Recipient.findByPk(recipientId);

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient does not exist' });
    }
    recipient.destroy({ where: recipient });

    return res.json({ message: 'Recipient has been deleted' });
  }
}

export default new RecipientController();
