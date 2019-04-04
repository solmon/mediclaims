import express from 'express';

import * as InsurancePeer from '../blockchain/insurancePeer';

const router = express.Router();

//login
router.post('/authenticate-user', async (req, res) => {
  try {
    const { user_id, pwd } = req.body;
    const success = await InsurancePeer.authenticateUser(user_id, pwd);
    res.json({ success });
    return;
  } catch (e) {
    console.log(e);
    res.json({ error: 'Error accessing blockchain!' });
    return;
  }
});

// Render main page
router.get('/', (req, res) => {
  //  try {
  //     let responseBenefit = await InsurancePeer.createInsurance({
  //       insuranceUid: insuranceUid,
  //       benefitTitle: benefitTitle,
  //       payerID: payerID,
  //       payerTitle: payerTitle,
  //       typeOfBenefit: typeOfBenefit,
  //       coverageAmount: coverageAmount,
  //       monthlyPremium: monthlyPremium,
  //       rules: rules
  //     });
  //     console.log(responseBenefit);
  //     res.status(200).json(responseBenefit || { benefitTitle: benefitTitle, payerID: payerID, payerTitle: payerTitle, typeOfBenefit: typeOfBenefit, coverageAmount: coverageAmount, monthlyPremium: monthlyPremium, rules: rules });
  //   } catch (e) {
  //     console.log(e);
  //     res.status(403).json({ error: 'Could not create new benefit!' });
  //   }
});

// Claim Processing

router.post('/claims', async (req, res) => {
  let { status } = req.body;
  if (typeof status === 'string' && status[0]) {
    status = status[0].toUpperCase();
  }
  try {
    let claims = await InsurancePeer.getClaims(status);
    res.json(claims);
  } catch (e) {
    res.json({ error: 'Error accessing blockchain.' });
  }
});

router.post('/process-claim', async (req, res) => {
  let { contractUuid, uuid, status } = req.body;
  // if (typeof contractUuid !== 'string'
  //   || typeof uuid !== 'string'
  //   || !(typeof status === 'string' && status[0])
  //   || typeof reimbursable !== 'number') {
  //   res.json({ error: 'Invalid request.' });
  //   return;
  // }
  status = status[0].toUpperCase();

  try {
    const success = await InsurancePeer.processClaim(
      contractUuid, uuid, status);
    res.json({ success });
  } catch (e) {
    res.json({ error: 'Error accessing blockchain.' });
  }
});

// Contract Management
router.post('/contract-types', async (req, res) => {
  try {
    const contractTypes = await InsurancePeer.getContractTypes();
    res.json(contractTypes || []);
  } catch (e) {
    res.json({ error: 'Error accessing blockchain.' });
  }
});

router.post('/create-contract-type', async (req, res) => {
  let {
    shopType,
    formulaPerDay,
    maxSumInsured,
    theftInsured,
    description,
    conditions,
    minDurationDays,
    maxDurationDays,
    active
  } = req.body;
  if (!(typeof shopType === 'string' && shopType[0])
    || typeof formulaPerDay !== 'string'
    || typeof maxSumInsured !== 'number'
    || typeof theftInsured !== 'boolean'
    || typeof description !== 'string'
    || typeof conditions !== 'string'
    || typeof minDurationDays !== 'number'
    || typeof maxDurationDays !== 'number'
    || typeof active !== 'boolean') {
    res.json({ error: 'Invalid request.' });
    return;
  }
  shopType = shopType.toUpperCase();

  try {
    const uuid = await InsurancePeer.createContractType({
      shopType,
      formulaPerDay,
      maxSumInsured,
      theftInsured,
      description,
      conditions,
      minDurationDays,
      maxDurationDays,
      active
    });
    res.json({ success: true, uuid });
  } catch (e) {
    res.json({ error: 'Error accessing blockchain.' });
  }
});

router.post('/set-contract-type-active', async (req, res) => {
  const { uuid, active } = req.body;
  if (typeof uuid !== 'string'
    || typeof active !== 'boolean') {
    res.json({ error: 'Invalid request.' });
    return;
  }
  try {
    const success = await InsurancePeer.setActiveContractType(
      uuid, active);
    res.json({ success });
  } catch (e) {
    res.json({ error: 'Error accessing blockchain.' });
  }
});

// Self Service

router.post('/contracts', async (req, res) => {
  if (typeof req.body.user !== 'object') {
    res.json({ error: 'Invalid request!' });
    return;
  }

  try {
    const { userUid } = req.body.user;
    console.log({ userUid });
    // if (await InsurancePeer.authenticateUser(username, password)) {
    const contracts = await InsurancePeer.getContracts(userUid);
    res.json({ success: true, contracts });
    return;
    // } else {
    //   res.json({ error: 'Invalid login!' });
    //   return;
    // }
  } catch (e) {
    console.log(e);
    res.json({ error: 'Error accessing blockchain!' });
    return;
  }
});

router.post('/file-claim', async (req, res) => {
  // if (typeof req.body.user !== 'object' ||
  //   typeof req.body.contractUuid !== 'string' ||
  //   typeof req.body.claim != 'object') {
  //   res.json({ error: 'Invalid request!' });
  //   return;
  // }

  try {
    const { userUid, contractUuid, claim } = req.body;
    // const { username, password } = user;
    // if (await InsurancePeer.authenticateUser(username, password)) {
    await InsurancePeer.fileClaim({
      contractUuid,
      date: new Date(),
      description: claim.description,
      // isTheft: claim.isTheft
    });
    res.json({ success: true });
    return;
    // } else {
    //   res.json({ error: 'Invalid login!' });
    //   return;
    // }
  } catch (e) {
    console.log(e);
    res.json({ error: 'Error accessing blockchain!' });
    return;
  }
});

// router.post('/authenticate-user', async (req, res) => {
//   if (!typeof req.body.user === 'object') {
//     res.json({ error: 'Invalid request!' });
//     return;
//   }

//   try {
//     const { uid, email } = req.body.user;
//     const success = await InsurancePeer.authenticateUser(uid, email);
//     res.json({ success });
//     return;
//   } catch (e) {
//     console.log(e);
//     res.json({ error: 'Error accessing blockchain!' });
//     return;
//   }
// });

router.post('/blocks', async (req, res) => {
  const { noOfLastBlocks } = req.body;
  if (typeof noOfLastBlocks !== 'number') {
    res.json({ error: 'Invalid request' });
  }
  try {
    const blocks = await InsurancePeer.getBlocks(noOfLastBlocks);
    res.json(blocks);
  } catch (e) {
    res.json({ error: 'Error accessing blockchain.' });
  }
});


router.post('/create-cuser', async (req, res) => {
  let {
    cuser
  } = req.body;
  let {
    employeeId,
    planTitle,
    sumAssured
  } = cuser || {};

  try {
    let responseUser = await InsurancePeer.createCUser({
      employeeId: employeeId,
      planTitle: planTitle,
      sumAssured: sumAssured
    });
    res.status(200).json(responseUser);
  } catch (e) {
    console.log(e);
    res.status(403).json({
      error: 'Could not create new user!'
    });
  }
});

router.post('/create-member', async (req, res) => {
  let { member } = req.body;
  let { patientUID, employeeID, ssn, dob, companyID, companyName } = member || {};

  if (typeof member === 'object' &&
    typeof patientUID === 'string' &&
    typeof employeeID === 'string' &&
    typeof ssn === 'string' &&
    typeof dob === 'string' &&
    typeof companyID === 'string' &&
    typeof companyName === 'string') {
    try {
      let responseMember = await InsurancePeer.createMember({
        patientUID: patientUID,
        employeeID: employeeID,
        ssn: ssn,
        dob: dob,
        companyID: companyID,
        companyName: companyName
      });
      console.log(responseMember);
      res.status(200).json(responseMember || { patientUID: patientUID, employeeID: employeeID, ssn: ssn, dob: dob, companyID: companyID, companyName: companyName });
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: 'Could not create new member!' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/update-claim', async (req, res) => {
  let { claim } = req.body;
  let { claimID, status } = claim || {};

  if (typeof claim === 'object' &&
    typeof claimID === 'string' &&
    typeof status === 'string') {
    try {
      let responseMember = await InsurancePeer.updateClaim({
        claimID: claimID,
        status: status
      });
      console.log(responseMember);
      res.status(200).json(responseMember || {
        claimID: claimID,
        status: status
      });
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: 'Could not update claim!' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/cusers', async (req, res) => {
  try {
    let cusers = await InsurancePeer.getCUsers();
    res.json(cusers);
  } catch (e) {
    console.log(e);
    res.json({
      error: "Error accessing blockchain."
    });
  }
});

// Block explorer
router.post('/get-user', async (req, res) => {
  const { uid } = req.body;
  if (typeof uid !== 'string') {
    res.json({ error: 'Invalid request' });
  }
  try {
    const userInfo = await InsurancePeer.getUserInfo(uid);
    res.json(userInfo);
  } catch (e) {
    res.json({ error: 'Error accessing blockchain.' });
  }
});

// Block explorer
router.post('/get-member', async (req, res) => {
  if (!typeof req.body.member === 'object') {
    res.json({ error: 'Invalid request!' });
    return;
  }
  try {
    const { memberUID } = req.body.member;
    const memberInfo = await InsurancePeer.getMemberInfo(memberUID);
    res.json({ memberInfo });
    return;
  } catch (e) {
    console.log(e);
    res.json({ error: 'Error accessing blockchain!' });
    return;
  }
});

router.post('/create-benefit', async (req, res) => {
  let { benefit } = req.body;
  let { benefitTitle, payerID, payerTitle, typeOfBenefit, coverageAmount, monthlyPremium, rules } = benefit || {};
  if (typeof benefit === 'object' &&
    typeof benefitTitle === 'string' &&
    typeof payerID === 'string' &&
    typeof payerTitle === 'string' &&
    typeof typeOfBenefit === 'string' &&
    typeof coverageAmount === 'number' &&
    typeof monthlyPremium === 'number') {
    try {
      let responseBenefit = await InsurancePeer.createBenefit({
        benefitTitle: benefitTitle,
        payerID: payerID,
        payerTitle: payerTitle,
        typeOfBenefit: typeOfBenefit,
        coverageAmount: coverageAmount,
        monthlyPremium: monthlyPremium,
        rules: rules
      });
      console.log(responseBenefit);
      res.status(200).json(responseBenefit || { benefitTitle: benefitTitle, payerID: payerID, payerTitle: payerTitle, typeOfBenefit: typeOfBenefit, coverageAmount: coverageAmount, monthlyPremium: monthlyPremium });
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: 'Could not create new benefit!' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/create-insurance', async (req, res) => {
  let { insurance } = req.body;
  let { insuranceName, address, email, password } = insurance || {};
  if (typeof insurance === 'object' &&
    typeof insuranceName === 'string' &&
    typeof address === 'string' &&
    typeof email === 'string' &&
    typeof password === 'string') {
    try {
      let responseInsurance = await InsurancePeer.createInsurance({
        insuranceName: insuranceName,
        address: address,
        email: email,
        providers: [],
        password: password
      });
      console.log(responseInsurance);
      res.status(200).json(responseInsurance || { insuranceName: insuranceName, address: address, email: email, password: password });
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: 'Could not create new insurance!' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/get-members', async (req, res) => {
  try {
    let response = await InsurancePeer.getMembers();
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(403).json({ error: 'Error' });
  }
});

router.post('/get-benefits', async (req, res) => {
  try {
    let response = await InsurancePeer.getBenefits();
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(403).json({ error: 'Error' });
  }
});

router.post('/auth-insurance', async (req, res) => {
  let { insurance } = req.body;
  let { email, password } = insurance || {};
  if (typeof insurance === 'object' &&
    typeof email === 'string' &&
    typeof password === 'string') {
    try {
      let responseInsurance = await InsurancePeer.authInsurance({
        email: email,
        password: password
      });
      if (responseInsurance.email != null){
        responseInsurance['authenticated'] = true;
        res.status(200).json(responseInsurance);
      }else
        res.status(200).json({ authenticated: false });

    } catch (e) {
      console.log(e);
      res.status(403).json({ error: e });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/add-provider', async (req, res) => {
  let { insurance } = req.body;
  let { insuranceUid, providerUid } = insurance || {};
  if (typeof insurance === 'object' &&
    typeof insuranceUid === 'string' &&
    typeof providerUid === 'string') {
    try {
      let responseInsurance = await InsurancePeer.addProvider({
        insuranceUid: insuranceUid,
        providerUid: providerUid
      });
      res.status(200).json({ status: true });
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: e });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/check-provider', async (req, res) => {
  let { insurance } = req.body;
  let { insuranceUid, providerUid } = insurance || {};
  if (typeof insurance === 'object' &&
    typeof insuranceUid === 'string' &&
    typeof providerUid === 'string') {
    try {
      let responseInsurance = await InsurancePeer.checkProvider({
        insuranceUid: insuranceUid,
        providerUid: providerUid
      });
      res.status(200).json({ status: responseInsurance });
    } catch (e) {
      res.status(200).json({ status: false });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/find-member', async (req, res) => {
  let { member } = req.body;
  let { employeeID, ssn, dob } = member || {};
  if (typeof member === 'object' &&
    typeof employeeID === 'string' &&
    typeof ssn === 'string' &&
    typeof dob === 'string') {
    try {
      let responseFinding = await InsurancePeer.findMember({
        employeeID: employeeID,
        ssn: ssn,
        dob: dob
      });
      try {
        res.status(200).json(responseFinding[0]);
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

router.post('/get-rules', async (req, res) => {
  let { benefit } = req.body;
  let { benefitID } = benefit || {};
  if (typeof benefit === 'object' &&
    typeof benefitID === 'string') {
    try {
      let responseFinding = await InsurancePeer.getRules({
        benefitID: benefitID
      });
      try {
        res.status(200).json(responseFinding);
      } catch (e) {
        res.status(200).json(null);
      }
    } catch (e) {
      res.status(200).json(null);
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/add-rule', async (req, res) => {
  let { benefit } = req.body;
  let { benefitID, rule } = benefit || {};
  if (typeof benefit === 'object' &&
    typeof benefitID === 'string' &&
    typeof rule === 'object') {
    try {
      let responseFinding = await InsurancePeer.addRule({
        benefitID: benefitID,
        rule: rule
      });
      try {
        res.status(200).json(responseFinding);
      } catch (e) {
        res.status(200).json(null);
      }
    } catch (e) {
      res.status(200).json(null);
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});


router.post('/create-enrollment', async (req, res) => {
  let { enrollment } = req.body;
  let { patientUID, benefitID, employeeID, ssn, startDate, endDate, coverageAmount, claimedAmount, remainingCoverageAmount, inHospitalSpent, outHospitalSpent, claimIndex } = enrollment || {};
  if (typeof enrollment === 'object' &&
    typeof benefitID === 'string' &&
    typeof patientUID === 'string' &&
    typeof employeeID === 'string' &&
    typeof ssn === 'string' &&
    typeof startDate === 'string' &&
    typeof endDate === 'string' &&
    typeof coverageAmount === 'number' &&
    typeof claimedAmount === 'number' &&
    typeof remainingCoverageAmount === 'number' &&
    typeof inHospitalSpent === 'number' &&
    typeof outHospitalSpent === 'number' &&
    typeof claimIndex === 'object') {
    try {
      let responseEnrollment = await InsurancePeer.createEnrollment({
        patientUID: patientUID,
        benefitID: benefitID,
        employeeID: employeeID,
        ssn: ssn,
        startDate: startDate,
        endDate: endDate,
        coverageAmount: coverageAmount,
        claimedAmount: claimedAmount,
        remainingCoverageAmount: remainingCoverageAmount,
        inHospitalSpent: inHospitalSpent,
        outHospitalSpent: outHospitalSpent,
        claimIndex: claimIndex
      });
      console.log(responseEnrollment);
      res.status(200).json(responseEnrollment || { patientUID: patientUID, benefitID: benefitID, employeeID: employeeID, ssn: ssn, startDate: startDate, endDate: endDate, coverageAmount: coverageAmount, claimedAmount: claimedAmount, remainingCoverageAmount: remainingCoverageAmount, inHospitalSpent: inHospitalSpent, outHospitalSpent: outHospitalSpent, claimIndex: claimIndex });
    } catch (e) {
      console.log(e);
      res.status(403).json({ error: 'Could not create new enrollment!' });
    }
  } else {
    res.status(403).json({ error: 'Invalid request!' });
  }
});

router.post('/bulk-benefit-data', async (req, res) => {
  try {
    var payload = req.body;
  } catch (e) {
    res.status(200).json({ error: 'invalid payload' });
  }
  var total = 0;
  var error = 0;
  var skip = 0;
  for (var i = 0; i < payload.length; i++) {
    let { benefitTitle, payerID, payerTitle, typeOfBenefit, coverageAmount, monthlyPremium, rules } = payload[i] || {};
    try {
      if (typeof payload[i] === 'object' &&
        typeof benefitTitle === 'string' &&
        typeof payerID === 'string' &&
        typeof payerTitle === 'string' &&
        typeof typeOfBenefit === 'string' &&
        typeof coverageAmount === 'number' &&
        typeof monthlyPremium === 'number' &&
        typeof rules === 'object') {
        await InsurancePeer.createBenefit({
          benefitTitle: benefitTitle,
          payerID: payerID,
          payerTitle: payerTitle,
          typeOfBenefit: typeOfBenefit,
          coverageAmount: coverageAmount,
          monthlyPremium: monthlyPremium,
          rules: rules
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
});

// Otherwise redirect to the main page
router.get('*', (req, res) => {
  res.render('insurance', {
    insuranceActive: true,
    selfServiceActive: req.originalUrl.includes('self-service'),
    claimProcessingActive: req.originalUrl.includes('claim-processing'),
    contractManagementActive: req.originalUrl.includes('contract-management')
  });
});

function wsConfig(io) {
  InsurancePeer.on('block', block => {
    io.emit('block', block);
  });
}

export default router;
export { wsConfig };
