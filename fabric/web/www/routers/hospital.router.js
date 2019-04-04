import express from 'express';
import * as HospitalPeer from '../blockchain/hospitalPeer';

const router = express.Router();

router.post('/authenticate-user', async (req, res) => {
  try {
    const { user_id, pwd } = req.body;
    const success = await HospitalPeer.authenticateUser(user_id, pwd);
    res.json({ success });
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
    const blocks = await HospitalPeer.getBlocks(noOfLastBlocks);
    res.json(blocks);
  } catch (e) {
    res.json({ error: 'Error accessing blockchain.' });
  }
});

router.get('*', (req, res) => {
  res.render('repair-shop', { HospitalActive: true });
});

function wsConfig(io) {
  HospitalPeer.on('block', block => { io.emit('block', block); });
}

router.post('/find-enrollment', async (req, res) => {
  let { hospital } = req.body;
  let { ssn } = hospital || {};
  if (typeof hospital === 'object' &&
    typeof ssn === 'string') {
    try {
      let response = await HospitalPeer.findEnrollment(ssn);
      try {
        res.status(200).json(response);
      } catch (e) {
        res.status(200).json({ response: null });
      }
    } catch (e) {
      res.status(200).json({ response: null });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/claims', async (req, res) => {
  try {
    let claims = await HospitalPeer.getClaims();
    res.json(claims);
  } catch (e) {
    res.json({ error: 'Error accessing blockchain.' });
  }
});

router.post('/create-claim', async (req, res) => {
  let { hospital } = req.body;
  let { enrollID, patientUID, memberUID, providerUID, patientTotal, insuranceTotal, benefitID, employeeID, date, physicianName, physicianUID, treatmentDescription, procedures, status, comments, claimTotal } = hospital || {};
  if (typeof hospital === 'object' &&
    typeof enrollID === 'string' &&
    typeof memberUID === 'string' &&
    typeof providerUID === 'string' &&
    typeof patientUID === 'string' &&
    typeof benefitID === 'string' &&
    typeof employeeID === 'string' &&
    typeof date === 'string' &&
    typeof physicianName === 'string' &&
    typeof physicianUID === 'string' &&
    typeof treatmentDescription === 'string' &&
    typeof procedures === 'object' &&
    typeof comments === 'string' &&
    typeof status === 'string' &&
    typeof claimTotal === 'number' &&
    typeof patientTotal === 'number' &&
    typeof insuranceTotal === 'number') {
    try {
      let response = await HospitalPeer.createClaims({
        enrollID: enrollID,
        memberUID: memberUID,
        benefitID: benefitID,
        employeeID: employeeID,
        patientUID: patientUID,
        providerUID: providerUID,
        physicianUID: physicianUID,
        patientTotal: patientTotal,
        insuranceTotal: insuranceTotal,
        date: date,
        status: status,
        physicianName: physicianName,
        treatmentDescription: treatmentDescription,
        procedures: procedures,
        comments: comments,
        claimTotal: claimTotal
      });
      console.log(response);
      res.status(200).json(response || {
        enrollID: enrollID,
        memberUID: memberUID,
        benefitID: benefitID,
        employeeID: employeeID,
        patientUID: patientUID,
        physicianUID: physicianUID,
        patientTotal: patientTotal,
        providerUID: providerUID,
        insuranceTotal: insuranceTotal,
        date: date,
        status: status,
        physicianName: physicianName,
        treatmentDescription: treatmentDescription,
        procedures: procedures,
        comments: comments,
        claimTotal: claimTotal
      });
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: 'Could not create new claim!' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/find-benefit', async (req, res) => {
  let { hospital } = req.body;
  let { benefitId } = hospital || {};
  if (typeof hospital === 'object' &&
    typeof benefitId === 'string') {
    try {
      let response = await HospitalPeer.findBenefit(benefitId);
      try {
        res.status(200).json(response);
      } catch (e) {
        res.status(200).json({ response: null });
      }
    } catch (e) {
      res.status(200).json({ response: null });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/create-provider', async (req, res) => {
  let { provider } = req.body;
  let { providerName, address, email, password, services } = provider || {};
  if (typeof provider === 'object' &&
    typeof providerName === 'string' &&
    typeof email === 'string' &&
    typeof password === 'string' &&
    typeof address === 'string' &&
    typeof services === 'object') {
    try {
      let response = await HospitalPeer.createProvider({
        providerName: providerName,
        email: email,
        password: password,
        address: address,
        services: services
      });
      console.log(response);
      res.status(200).json(response || {
        providerName: providerName,
        email: email,
        password: password,
        address: address,
        services: services
      });
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: 'Could not create new provider!' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/create-physician', async (req, res) => {
  let { physician } = req.body;
  let { providerUID, lastName, email, password, firstName } = physician || {};
  if (typeof physician === 'object' &&
    typeof providerUID === 'string' &&
    typeof email === 'string' &&
    typeof password === 'string' &&
    typeof lastName === 'string' &&
    typeof firstName === 'string') {
    try {
      let response = await HospitalPeer.addPhysician({
        providerUID: providerUID,
        email: email,
        password: password,
        lastName: lastName,
        firstName: firstName
      });
      console.log(response);
      res.status(200).json(response || {
        providerUID: providerUID,
        email: email,
        password: password,
        lastName: lastName,
        firstName: firstName
      });
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: 'Could not create new physician!' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});


router.post('/auth-provider', async (req, res) => {
  let { provider } = req.body;
  let { email, password } = provider || {};
  if (typeof provider === 'object' &&
    typeof email === 'string' &&
    typeof password === 'string') {
    try {
      let response = await HospitalPeer.authProvider({
        email: email,
        password: password
      });
      if (response.email != "")
        res.status(200).json(response);
      else
        res.status(200).json({ authenticated: false });
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: '!Auth Error' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/auth-physician', async (req, res) => {
  let { physician } = req.body;
  let { email, password } = physician || {};
  if (typeof physician === 'object' &&
    typeof email === 'string' &&
    typeof password === 'string') {
    try {
      let response = await HospitalPeer.authPhysician({
        email: email,
        password: password
      });
      console.log(response);
      if (response.providerUid != null)
        res.status(200).json(response);
      else
        res.status(200).json({ authenticated: false });
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: '!Auth Error' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/add-service', async (req, res) => {
  let { provider } = req.body;
  let { providerUID, service } = provider || {};
  if (typeof provider === 'object' &&
    typeof providerUID === 'string' &&
    typeof service === 'object') {
    try {
      let response = await HospitalPeer.addService({
        providerUID: providerUID,
        service: service
      });
      console.log(response);
      res.status(200).json(response);
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: 'Error' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/get-service', async (req, res) => {
  let { provider } = req.body;
  let { providerUID } = provider || {};
  if (typeof provider === 'object' &&
    typeof providerUID === 'string') {
    try {
      let response = await HospitalPeer.getService({
        providerUID: providerUID
      });
      console.log(response);
      res.status(200).json(response);
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: 'Error' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/get-procedures', async (req, res) => {
  let { provider } = req.body;
  let { providerUID } = provider || {};
  if (typeof provider === 'object' &&
    typeof providerUID === 'string') {
    try {
      let response = await HospitalPeer.getProcedures({
        providerUID: providerUID
      });
      console.log(response);
      res.status(200).json(response);
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: 'Error' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/get-providers', async (req, res) => {
  try {
    let response = await HospitalPeer.getProviders();
    for (let i = 0; i < response.length; i++) {
      delete response[i].password;
    }
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(403).json({ error: 'Error' });
  }
});

router.post('/get-physicians', async (req, res) => {
  try {
    let response = await HospitalPeer.getPhysicians();
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(403).json({ error: 'Error' });
  }
});

router.post('/update-procedure', async (req, res) => {
  let { procedure } = req.body;
  let { claimID, procedureUID, status } = procedure || {};

  if (typeof procedure === 'object' &&
    typeof claimID === 'string' &&
    typeof procedureUID === 'string' &&
    typeof status === 'string') {
    try {
      let responseMember = await HospitalPeer.updateProcedure({
        claimID: claimID,
        status: status,
        procedureUID: procedureUID
      });
      console.log(responseMember);
      res.status(200).json(responseMember || {
        claimID: claimID,
        status: status,
        procedureUID: procedureUID
      });
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: 'Could not update procedure!' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/find-patient', async (req, res) => {
  let { hospital } = req.body;
  let { memberUID } = hospital || {};
  if (typeof hospital === 'object' &&
    typeof memberUID === 'string') {
    try {
      let responseLinking = await HospitalPeer.findPatient({
        memberUID: memberUID
      });
      console.log(responseLinking);
      res.status(200).json(responseLinking);
    } catch (e) {
      res.status(200).json({ error: "error" });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/find-patient-ssn', async (req, res) => {
  let { hospital } = req.body;
  let { ssn } = hospital || {};
  if (typeof hospital === 'object' &&
    typeof ssn === 'string') {
    try {
      let responseLinking = await HospitalPeer.findPatientSSN({
        ssn: ssn
      });
      console.log(responseLinking);
      res.status(200).json(responseLinking);
    } catch (e) {
      res.status(200).json({ error: "error" });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

export default router;
export { wsConfig };
