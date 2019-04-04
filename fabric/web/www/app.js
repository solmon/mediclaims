'use strict';

import { Server } from 'http';
import express from 'express';
import socketIo from 'socket.io';
import configureExpress from './config/express';
import customerRouter, { wsConfig as customerWsConfig }
  from './routers/customer.router';
import hospitalRouter, { wsConfig as hospitalWsConfig }
  from './routers/hospital.router';
import insuranceRouter, { wsConfig as insuranceWsConfig }
  from './routers/insurance.router';
import cors from 'cors';

let path = require("path");
const INSURANCE_ROOT_URL = '/api/insurance';
const HOSPITAL_ROOT_URL = '/api/hospital';
const CUSTOMER_ROOT_URL = '/api/customer';

const app = express();
const httpServer = new Server(app);
app.use(cors({ origin: '*' }));

// Setup web sockets
const io = socketIo(httpServer);
customerWsConfig(io.of(CUSTOMER_ROOT_URL));
hospitalWsConfig(io.of(HOSPITAL_ROOT_URL));
insuranceWsConfig(io.of(INSURANCE_ROOT_URL));

configureExpress(app);

const dpdRoutes = ["api"];

app.get('/[^.]+$', function(req, res, next)
{
    const first_path = req.path.split('/');

    if(dpdRoutes.indexOf(first_path[1]) > -1) // api requests
    {
        return next();
    }
    else // angular requests
    {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    }

});


// Setup routing
app.use(CUSTOMER_ROOT_URL, customerRouter);
app.use(HOSPITAL_ROOT_URL, hospitalRouter);
app.use(INSURANCE_ROOT_URL, insuranceRouter);

export default httpServer;
