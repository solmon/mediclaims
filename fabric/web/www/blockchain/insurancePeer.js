'use strict';

import config from './config';
import { wrapError } from './utils';
import { insuranceClient as client, isReady } from './setup';
import uuidV4 from 'uuid/v4';
import '../constants';
import { generateID } from '../constants';

export async function authenticateUser(user_id, pwd) {
  if (!isReady()) {
    return;
  }
  try {
    if (user_id == 'payer' && pwd == 'pwd@123') {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    throw wrapError(`Error authenticating user: ${e.message}`, e);
  }
}

export async function getContractTypes() {
  if (!isReady()) {
    return;
  }
  try {
    const contractTypes = await query('plan_ls');
    return contractTypes;
  } catch (e) {
    throw wrapError(`Error getting contract types: ${e.message}`, e);
  }
}

export async function createContractType(contractType) {
  if (!isReady()) {
    return;
  }
  try {
    let ct = contractType.uuid ? contractType :
      Object.assign({ uuid: uuidV4() }, contractType);
    const successResult = await invoke('contract_type_create', ct);
    if (successResult) {
      throw new Error(successResult);
    }
    return ct.uuid;
  } catch (e) {
    throw wrapError(`Error creating contract type: ${e.message}`, e);
  }
}

export async function createInsurance(insurance) {
  if (!isReady()) {
    return;
  }
  try {
    const cu = Object.assign({}, insurance, { insuranceUid: uuidV4() });
    const successResult = await invoke('create_insurance', cu);
    return successResult;
  } catch (e) {
    throw wrapError(`Error creating contract type: ${e.message}`, e);
  }
}

export async function authInsurance(insurance) {
  if (!isReady()) {
    return;
  }
  try {
    const successResult = await invoke('auth_insurance', insurance);
    if (!successResult) {
      throw new Error(successResult);
    }
    return successResult;
  } catch (e) {
    throw wrapError(`Error occurred: ${e.message}`, e);
  }
}

export async function addProvider(insurance) {
  if (!isReady()) {
    return;
  }
  try {
    return await invoke('add_provider', insurance);
  } catch (e) {
    throw wrapError(`Error occurred: ${e.message}`, e);
  }
}

export async function checkProvider(insurance) {
  if (!isReady()) {
    return;
  }
  try {
    return await invoke('check_provider', insurance);
  } catch (e) {
    throw wrapError(`Error occurred: ${e.message}`, e);
  }
}

export async function setActiveContractType(uuid, active) {
  if (!isReady()) {
    return;
  }
  try {
    const successResult = await invoke('contract_type_set_active',
      { uuid, active });
    if (successResult) {
      throw new Error(successResult);
    }
    return successResult;
  } catch (e) {
    throw wrapError(`Error setting active contract type: ${e.message}`, e);
  }
}

export async function getContracts(employeeId) {
  if (!isReady()) {
    return;
  }
  try {
    // if (typeof username !== 'string') {
    //   username = undefined;
    // }
    const contracts = await query('contract_ls', { employeeId });
    return contracts;
  } catch (e) {
    let errMessage;
    // if (username) {
    //   errMessage = `Error getting contracts for user ${username}: ${e.message}`;
    // } else {
    //   errMessage = `Error getting all contracts: ${e.message}`;
    // }
    throw wrapError(errMessage, e);
  }
}

export async function createCUser(cuser) {
  if (!isReady()) {
    return;
  }
  try {
    const cu = Object.assign({}, cuser, { uuid: uuidV4() });

    const loginInfo = await invoke('cuser_create', cu);
    if (!loginInfo ^
      !!(loginInfo && loginInfo.employeeId)) {
      return loginInfo;
    } else {
      throw new Error(loginInfo);
    }
  } catch (e) {
    throw wrapError(`Error creating user: ${e.message}`, e);
  }
}

export async function createMember(member) {
  if (!isReady()) {
    return;
  }
  try {
    const cu = Object.assign({ memberUID: uuidV4() }, member);
    console.log(cu);
    const loginInfo = await invoke('member_create', cu);
    if (!loginInfo ^
      !!(loginInfo && loginInfo.employeeId)) {
      return loginInfo;
    } else {
      throw new Error(loginInfo);
    }
  } catch (e) {
    throw wrapError(`Error creating member: ${e.message}`, e);
  }
}

export async function createBenefit(benefit) {
  if (!isReady()) {
    return;
  }
  try {
    const cu = Object.assign({ benefitID: uuidV4() }, benefit);
    console.log(cu);
    const benefitResponse = await invoke('create_benefit', cu);
    return benefitResponse;
  } catch (e) {
    throw wrapError(`Error creating benefit: ${e.message}`, e);
  }
}

export async function createEnrollment(enrollment) {
  if (!isReady()) {
    return;
  }
  try {
    const cu = Object.assign({ enrollID: uuidV4() }, enrollment);
    return await invoke('create_enrollment', cu);
  } catch (e) {
    throw wrapError(`Error creating enrollment: ${e.message}`, e);
  }
}


export async function getClaims(status) {
  if (!isReady()) {
    return;
  }
  try {
    if (typeof status !== 'string') {
      status = undefined;
    }
    const claims = await query('claim_ls', { status });
    return claims;
  } catch (e) {
    let errMessage;
    if (status) {
      errMessage = `Error getting claims with status ${status}: ${e.message}`;
    } else {
      errMessage = `Error getting all claims: ${e.message}`;
    }
    throw wrapError(errMessage, e);
  }
}

export async function getCUsers() {
  if (!isReady()) {
    return;
  }
  try {
    const cUsers = await query('cuser_ls');
    return cUsers;
  } catch (e) {
    throw wrapError(`Error getting C Users: ${e.message}`, e);
  }
}

export async function fileClaim(claim) {
  if (!isReady()) {
    return;
  }
  try {
    const c = Object.assign({}, claim, { uuid: uuidV4() });
    const successResult = await invoke('claim_file', c);
    if (successResult) {
      throw new Error(successResult);
    }
    return c.uuid;
  } catch (e) {
    throw wrapError(`Error filing a new claim: ${e.message}`, e);
  }
}

export async function processClaim(contractUuid, uuid, status) {
  if (!isReady()) {
    return;
  }
  try {
    const successResult = await invoke('claim_process', { contractUuid, uuid, status });
    if (successResult) {
      throw new Error(successResult);
    }
    return successResult;
  } catch (e) {
    throw wrapError(`Error processing claim: ${e.message}`, e);
  }
}

export async function updateClaim(data) {
  if (!isReady()) {
    return;
  }
  try {
    const successResult = await invoke('update_claim', data);
    if (successResult) {
      throw new Error(successResult);
    }
    return successResult;
  } catch (e) {
    throw wrapError(`Error processing claim: ${e.message}`, e);
  }
}
// export async function authenticateUser(uid, email) {
//   if (!isReady()) {
//     return;
//   }
//   try {
//     let authenticated = await query('user_authenticate', { uid, email });
//     if (authenticated === undefined || authenticated === null) {
//       throw new Error('Unknown error, invalid response!');
//     }
//     return authenticated;
//   } catch (e) {
//     throw wrapError(`Error authenticating user: ${e.message}`, e);
//   }
// }

export async function getUserInfo(uid) {
  if (!isReady()) {
    return;
  }
  try {
    const user = await query('user_get_info', { uid });
    console.log(user);
    return user;
  } catch (e) {
    throw wrapError(`Error getting user info: ${e.message}`, e);
  }
}

export async function getBenefits() {
  if (!isReady()) {
    return;
  }
  try {
    return await invoke('get_benefits', {});
  } catch (e) {
    throw wrapError(`Error creating claim: ${e.message}`, e);
  }
}

export async function getMembers() {
  if (!isReady()) {
    return;
  }
  try {
    return await invoke('get_memebers', {});
  } catch (e) {
    throw wrapError(`Error creating claim: ${e.message}`, e);
  }
}

export async function findMember(member) {
  if (!isReady()) {
    return;
  }
  try {
    const find = await query('find_member', member);
    return find;
  } catch (e) {
    throw wrapError(`Error finding member ${e.message}`, e);
  }
}

export async function getRules(rule) {
  if (!isReady()) {
    return;
  }
  try {
    return await query('get_rules', rule);
  } catch (e) {
    throw wrapError(`Error finding rules ${e.message}`, e);
  }
}

export async function addRule(data) {
  if (!isReady()) {
    return;
  }
  try {
    data.rule.ruleUID = uuidV4();
   console.log(data);
    const find = await invoke('add_rule', data);
    return find;
  } catch (e) {
    throw wrapError(`Error finding member ${e.message}`, e);
  }
}

export async function getMemberInfo(memberUID) {
  console.log({ memberUID });
  if (!isReady()) {
    return;
  }
  try {
    const member = await query('member_get_info', { memberUID });
    console.log(member);
    return member;
  } catch (e) {
    console.log(e);
    throw wrapError(`Error getting user info: ${e.message}`, e);
  }
}

export function getBlocks(noOfLastBlocks) {
  return client.getBlocks(noOfLastBlocks);
}

export const on = client.on.bind(client);
export const once = client.once.bind(client);
export const addListener = client.addListener.bind(client);
export const prependListener = client.prependListener.bind(client);
export const removeListener = client.removeListener.bind(client);

function invoke(fcn, ...args) {
  return client.invoke(
    config.chaincodeId, config.chaincodeVersion, fcn, ...args);
}

function query(fcn, ...args) {
  return client.query(
    config.chaincodeId, config.chaincodeVersion, fcn, ...args);
}
