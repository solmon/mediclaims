'use strict';

import express from 'express';

import * as CustomerPeer from '../blockchain/customerPeer';


const router = express.Router();

router.post('/create-customer', async (req, res) => {
  let { customer } = req.body;
  let { googleUID, firstName, lastName, email } = customer || {};
  let pId = "ZD" + Math.floor(Math.random() * 90000) + 10000;
  if (typeof customer === 'object' &&
    typeof googleUID === 'string' &&
    typeof firstName === 'string' &&
    typeof lastName === 'string' &&
    typeof email === 'string') {
    try {
      let responseUser = await CustomerPeer.createCustomer({
        googleUID: googleUID,
        patientUID: pId,
        firstName: firstName,
        lastName: lastName,
        email: email
      });
      console.log(responseUser);
      res.status(200).json(responseUser || { googleUID: googleUID, patientUID: pId, firstName: firstName, lastName: lastName, email: email });
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: 'Could not create new customer!' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/bulk-customer-data', async (req, res) => {
  try {
    const payload = req.body;
    let total = 0;
    let error = 0;
    let skip = 0;
    for (let i = 0; i < payload.length; i++) {
      let { googleUID, firstName, lastName, email } = payload[i] || {};
      try {
        if (typeof payload[i] === 'object' &&
          typeof googleUID === 'string' &&
          typeof firstName === 'string' &&
          typeof lastName === 'string' &&
          typeof email === 'string') {
          await CustomerPeer.createCustomer({
            googleUID: googleUID,
            firstName: firstName,
            lastName: lastName,
            email: email
          });
          total += 1;
        } else {
          skip += 1;
        }
      }
      catch (e) {
        error += 1;
      }
    }
    res.status(200).json({ status: [{ "total": total, "skipped": skip, "error": error }] });
  } catch (e) {
    res.status(200).json({ error: 'invalid payload' });
  }
});

router.post('/auth-customer', async (req, res) => {
  let { customer } = req.body;
  let { googleUID, email } = customer || {};
  if (typeof customer === 'object' &&
    typeof googleUID === 'string' &&
    typeof email === 'string') {
    try {
      let responseAuthenticate = await CustomerPeer.authenticateCustomer({
        googleUID: googleUID,
        email: email
      });
      if (responseAuthenticate == null)
        res.status(206).json({ responseAuthenticate: 'User not found' });
      else
        res.json(responseAuthenticate);
    } catch (e) {
      res.status(206).json({ error: 'Error authenticating' });
    }
  } else {
    res.status(206).json({ error: 'Invalid request!' });
  }
});

router.post('/link-customer', async (req, res) => {
  let { customer } = req.body;
  let { googleUID, memberUID } = customer || {};
  if (typeof customer === 'object' &&
    typeof googleUID === 'string' &&
    typeof memberUID === 'string') {
    try {
      let responseLinking = await CustomerPeer.linkCustomer({
        googleUID: googleUID,
        memberUID: memberUID
      });
      console.log(responseLinking);
      if (responseLinking == null)
        res.status(200).json({ responseLinking: true });
      else
        res.status(200).json({ responseLinking: false });
    } catch (e) {
      res.status(200).json({ responseLinking: false });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/customer-detailed-view', async (req, res) => {
  let { customer } = req.body;
  let { memberUID } = customer || {};
  if (typeof customer === 'object' &&
    typeof memberUID === 'string') {
    try {
      let responseLinking = await CustomerPeer.customerPlanDetails({
        memberUID: memberUID
      });
      console.log(responseLinking);
      if (responseLinking == null) {
        res.status(200).json(null);
      } else
        res.status(200).json(responseLinking);
    } catch (e) {
      res.status(200).json(null);
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/find-customer', async (req, res) => {
  let { customer } = req.body;
  let { employeeID, ssn, dob } = customer || {};
  if (typeof customer === 'object' &&
    typeof employeeID === 'string' &&
    typeof ssn === 'string' &&
    typeof dob === 'string') {
    try {
      let responseFinding = await CustomerPeer.findCustomer({
        employeeID: employeeID,
        ssn: ssn,
        dob: dob
      });
      try {
        res.status(200).json({ memberUID: responseFinding[0].memberUid });
      } catch (e) {
        res.status(200).json({ memberUID: null });
      }
    } catch (e) {
      res.status(200).json({ memberUID: null });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/get-customer', async (req, res) => {
  if (!typeof req.body.customer === 'object') {
    res.json({ error: 'Invalid request!' });
    return;
  }
  try {
    const { googleUID } = req.body.customer;
    const customerInfo = await CustomerPeer.getCustomerInfo(googleUID);
    res.json({ customerInfo });
    return;
  } catch (e) {
    console.log(e);
    res.json({ error: 'Error accessing blockchain!' });
    return;
  }
});

router.post('/blocks', async (req, res) => {
  const { noOfLastBlocks } = req.body;
  if (typeof noOfLastBlocks !== 'number') {
    res.json({ error: 'Invalid request' });
  }
  try {
    const blocks = await CustomerPeer.getBlocks(noOfLastBlocks);
    res.json(blocks);
  } catch (e) {
    res.json({ error: 'Error accessing blockchain.' });
  }
});

function generatePassword() {
  let passwordType = Math.floor(Math.random() * 4);
  let password;
  switch (passwordType) {
    case 0:
      password = 'test';
      break;
    case 1:
      password = 'demo';
      break;
    case 2:
      password = 'pass';
      break;
    case 3:
      password = 'secret';
      break;
    case 4:
    default:
      password = 'qwerty';
  }
  password += Math.floor(Math.random() * (99 - 10) + 10);
  return password;
}

function wsConfig(io) {
  CustomerPeer.on('block', block => { io.emit('block', block); });
}

export default router;
export { wsConfig };
