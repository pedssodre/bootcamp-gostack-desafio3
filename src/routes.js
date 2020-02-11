import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import DelivererController from './app/controllers/DelivererController';
import OrderController from './app/controllers/OrderController';
import OrderRetrieveController from './app/controllers/OrderRetrieveController';
import OrderDeliveredController from './app/controllers/OrderDeliveredController';
import AvailableOrderController from './app/controllers/AvailableOrderController';
import ClosedOrderController from './app/controllers/ClosedOrderController';
import OrderProblemController from './app/controllers/OrderProblemController';
import OrderWithProblemController from './app/controllers/OrderWithProblemController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);

// Login with user email and password
routes.post('/sessions', SessionController.store);

// Retrieve order
routes.put('/order/retrieve/:id', OrderRetrieveController.update);

// Order finished
routes.put(
  '/order/delivered/:delivererId/deliveries/:orderId',
  upload.single('file'),
  OrderDeliveredController.update
);

// list all packages available to retrieve
routes.get('/order/deliverer/:id/deliveries', AvailableOrderController.index);
// List all packages already delivered
routes.get(
  '/order/deliverer/:id/deliveriesClosed',
  ClosedOrderController.index
);

// Deliverer creates problem
routes.post('/order/:order_id/problems', OrderProblemController.store);

routes.use(authMiddleware);

// list all problems of an order
routes.get('/order/:id/problems', OrderWithProblemController.index);

// list all problems
routes.get('/problems', OrderProblemController.index);
// list one problem
routes.get('/problems/:id', OrderProblemController.show);
// list all problems from one order
routes.get('/order/:id/problems', OrderWithProblemController.index);
// Cancel a order with a problem.
routes.put('/problems/:id/cancel-delivery', OrderProblemController.update);

// create a new user
routes.put('/users', UserController.update);

// upload a File
routes.post('/files', upload.single('file'), FileController.store);

// list all recipients
routes.get('/recipients', RecipientController.index);
// list one recipient
routes.get('/recipients/:recipientId', RecipientController.show);
// create new recipient
routes.post('/recipients', RecipientController.store);
// update recipient
routes.put('/recipients/:recipientId', RecipientController.update);
// delete recipient
routes.delete('/recipients/:recipientId', RecipientController.delete);

// list all deliverer
routes.get('/deliverer', DelivererController.index);
// create new deliverer
routes.post('/deliverer', DelivererController.store);
// update deliverer
routes.put('/deliverer/:id', DelivererController.update);
// delete deliverer
routes.delete('/deliverer/:id', DelivererController.delete);

// list all orders
routes.get('/order', OrderController.index);
// create new order
routes.post('/order', OrderController.store);
// update order
routes.put('/order/:id', OrderController.update);
// delete order
routes.delete('/order/:id', OrderController.delete);

export default routes;
