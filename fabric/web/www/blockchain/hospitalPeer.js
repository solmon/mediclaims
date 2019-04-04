'use strict';

import config from './config';
import { wrapError } from './utils';
import { hospitalClient as client, isReady } from './setup';
import uuidV4 from 'uuid/v4';


export async function authenticateUser(user_id, pwd) {
  if (!isReady()) {
    return;
  }
  try {
    if (user_id == 'provider' && pwd == 'pwd@123') {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    throw wrapError(`Error authenticating user: ${e.message}`, e);
  }
}

export async function findEnrollment(ssn) {
  if (!isReady()) {
    return;
  }
  try {
    console.log(ssn);
    const find = await query('find_enrollment', { ssn });
    return find;
  } catch (e) {
    throw wrapError(`Error finding enrollment ${e.message}`, e);
  }
}

export async function findBenefit(benefitId) {
  if (!isReady()) {
    return;
  }
  try {
    console.log({ benefitId });
    const find = await query('find_benefit', { benefitId });
    return find;
  } catch (e) {
    throw wrapError(`Error finding benefit ${e.message}`, e);
  }
}



export async function createClaims(claim) {
  if (!isReady()) {
    return;
  }
  if (claim.procedures != null) {
    for (let i = 0; i < claim.procedures.length; i++) {
      claim.procedures[i].procedureUid = uuidV4();
    }
  }
  try {
    const cu = Object.assign({ claimID: uuidV4() }, claim);
    return await invoke('create_claims', cu);
  } catch (e) {
    throw wrapError(`Error creating claim: ${e.message}`, e);
  }
}

export async function updateProcedure(data) {
  if (!isReady()) {
    return;
  }
  try {
    const successResult = await invoke('update_procedure', data);
    console.log(successResult);
    if (successResult) {
      throw new Error(successResult);
    }
    return successResult;
  } catch (e) {
    throw wrapError(`Error processing procedure: ${e.message}`, e);
  }
}

export async function createProvider(claim) {
  if (!isReady()) {
    return;
  }
  try {
    const cu = Object.assign({ providerUID: uuidV4() }, claim);
    console.log(cu);
    return await invoke('create_provider', cu);
  } catch (e) {
    throw wrapError(`Error creating claim: ${e.message}`, e);
  }
}

export async function authProvider(claim) {
  if (!isReady()) {
    return;
  }
  try {
    return await invoke('auth_provider', claim);
  } catch (e) {
    throw wrapError(`Error creating claim: ${e.message}`, e);
  }
}

export async function authPhysician(claim) {
  if (!isReady()) {
    return;
  }
  try {
    return await invoke('auth_physician', claim);
  } catch (e) {
    throw wrapError(`Error creating claim: ${e.message}`, e);
  }
}

export async function addService(claim) {
  if (!isReady()) {
    return;
  }
  try {
    claim.service.serviceUID = uuidV4();
    console.log(claim);
    return await invoke('add_service', claim);
  } catch (e) {
    throw wrapError(`Error creating claim: ${e.message}`, e);
  }
}

export async function addPhysician(claim) {
  if (!isReady()) {
    return;
  }
  try {
    claim.physicianUID = uuidV4();
    console.log(claim);
    return await invoke('create_physician', claim);
  } catch (e) {
    throw wrapError(`Error creating claim: ${e.message}`, e);
  }
}


export async function getService(claim) {
  if (!isReady()) {
    return;
  }
  try {
    console.log(claim);
    return await invoke('get_services', claim);
  } catch (e) {
    throw wrapError(`Error creating claim: ${e.message}`, e);
  }
}

export async function getProcedures(claim) {
  if (!isReady()) {
    return;
  }
  try {
    console.log(claim);
    return await invoke('get_procedures', claim);
  } catch (e) {
    throw wrapError(`Error creating claim: ${e.message}`, e);
  }
}

export async function getProviders() {
  if (!isReady()) {
    return;
  }
  try {
    return await invoke('get_providers', {});
  } catch (e) {
    throw wrapError(`Error creating claim: ${e.message}`, e);
  }
}

export async function getPhysicians() {
  if (!isReady()) {
    return;
  }
  try {
    return await invoke('get_physicians', {});
  } catch (e) {
    throw wrapError(`Error creating claim: ${e.message}`, e);
  }
}

export async function findPatient(patient) {
  if (!isReady()) {
    return;
  }
  try {
    return await invoke('get_customer_member', patient);
  } catch (e) {
    throw wrapError(`Error linking customer: ${e.message}`, e);
  }
}

export async function findPatientSSN(patient) {
  if (!isReady()) {
    return;
  }
  try {
    return await invoke('get_patient', patient);
  } catch (e) {
    throw wrapError(`Error linking customer: ${e.message}`, e);
  }
}

export async function getClaims() {
  if (!isReady()) {
    return;
  }
  try {
    const claims = await query('get_claims_hospital', {});
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
