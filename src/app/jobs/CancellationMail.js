import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CacellationMail';
  }

  async handle({ data }) {
    const { problem } = data;

    await Mail.sendMail({
      to: `${problem.order.deliverer.name} <${problem.order.deliverer.email}>`,
      subject: 'Pedido Cancelado',
      template: 'cancellation',
      context: {
        deliverer: problem.order.deliverer.name,
        product: problem.order.product,
        name: problem.order.recipient.name,
        description: problem.description,
      },
    });
  }
}

export default new CancellationMail();
