import UserRoute from '../src/routes/user';

import productsRoute from '../src/routes/products';

import ordersRoute from '../src/routes/orders';

import paymentsRoute from '../src/routes/payments';

import employeesRoute from '../src/routes/employees';

import categoryRoute from '../src/routes/category';

import bonoRoute from '../src/routes/bono';

export default (server) => {
    server.use('/v1/api/user', UserRoute);
    server.use('/v1/api/products', productsRoute);
    server.use('/v1/api/orders', ordersRoute);
    server.use('/v1/api/payments', paymentsRoute);
    server.use('/v1/api/employees', employeesRoute);
    server.use('/v1/api/category', categoryRoute);
    server.use('/v1/api/bono', bonoRoute);
};
