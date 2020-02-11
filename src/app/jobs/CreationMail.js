import Mail from '../../lib/Mail';

class CreationMail {
  get key() {
    return 'CreationMail';
  }

  async handle({ data }) {
    const { order } = data;

    await Mail.sendMail({
      to: `${order.deliverer.name} <${order.deliverer.email}>`,
      subject: 'Novo Pedido',
      template: 'creation',
      context: {
        deliverer: order.deliverer.name,
        product: order.product,
        name: order.recipient.name,
        street: order.recipient.street,
        number: order.recipient.number,
        complement: order.recipient.complement,
        state: order.recipient.state,
        city: order.recipient.city,
        zipcode: order.recipient.zipcode,
      },
    });
  }
}

export default new CreationMail();
