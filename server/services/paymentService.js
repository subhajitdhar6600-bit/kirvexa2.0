import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import { PAYMENT_STATUS } from '../config/constants.js';

export const processMockPayment = async ({ paymentId, success = true }) => {
  const payment = await Payment.findOne({ id: paymentId });
  if (!payment) {
    throw new Error('Payment record not found.');
  }

  if (success) {
    payment.status = PAYMENT_STATUS.SUCCESS;
    payment.paidAt = new Date();
    payment.gatewayResponse = { status: 'captured', method: payment.paymentMethod, mock: true };
    await payment.save();

    await Order.findOneAndUpdate(
      { id: payment.orderId },
      { paymentStatus: PAYMENT_STATUS.SUCCESS }
    );
  } else {
    payment.status = PAYMENT_STATUS.FAILED;
    payment.gatewayResponse = { status: 'failed', reason: 'User cancelled or bank decline', mock: true };
    await payment.save();

    await Order.findOneAndUpdate(
      { id: payment.orderId },
      { paymentStatus: PAYMENT_STATUS.FAILED }
    );
  }

  return payment;
};

export default {
  processMockPayment,
};
