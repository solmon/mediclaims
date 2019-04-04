'use strict';

import config from './config';
import { wrapError } from './utils';
import { customerClient as client, isReady } from './setup';
import uuidV4 from 'uuid/v4';

export async function getContractTypes(shopType) {
  if (!isReady()) {
    return;
  }
  try {
    return await query('plans_ls', { shopType });
  } catch (e) {
    throw wrapError(
      `Error getting contract types for shop type ${shopType} : ${e.message}`
      , e);
  }
}

export async function createContract(contract) {
  if (!isReady()) {
    return;
  }
  try {
    let c = Object.assign({}, contract, { uuid: uuidV4() });
    const loginInfo = await invoke('contract_create', c);
    if (!loginInfo
      ^ !!(loginInfo && loginInfo.username && loginInfo.password)) {
      return Object.assign(loginInfo || {}, { uuid: c.uuid });
    } else {
      throw new Error(loginInfo);
    }
  } catch (e) {
    throw wrapError(`Error creating contract: ${e.message}`, e);
  }
}


export async function registerUser(email, ssn) {
  if (!isReady()) {
    return;
  }
  try {
    var kfs = require("key-file-storage")('./');
    delete kfs.user;
    var ssnum = "520-78-3211";
    console.log("SSN : " + ssnum);
    if (ssnum === ssn) {
      kfs.user = {
        uuid: '3ef076a-33a1-41d2-a9bc-2777505b014f',
        employeeID: 'tek2086',
        planTitle: "ZA2",
        sumAssured: 4500,
        ssn: "520-78-3211",
        email: email
      };
      console.log("user registered successfully " + kfs.user.email);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    throw wrapError(`Error registering user: ${e.message}`, e);
  }
}

export async function authenticateUser(email) {
  if (!isReady()) {
    return;
  }
  try {
    var kfs = require("key-file-storage")('./');
    if (email === kfs.user.email) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    throw wrapError(`Error authenticating user: ${e.message}`, e);
  }
}


export async function createUser(user) {
  if (!isReady()) {
    return;
  }
  try {
    const loginInfo = await invoke('user_create', user);
    if (!loginInfo ^
      !!(loginInfo && loginInfo.userUid && loginInfo.email)) {
      return loginInfo;
    } else {
      throw new Error(loginInfo);
    }
  } catch (e) {
    throw wrapError(`Error creating user: ${e.message}`, e);
  }
}

export async function authenticateCustomer(credentials) {
  if (!isReady()) {
    return;
  }
  try {
    const authenticate = await query('customer_authenticate', credentials);
    return authenticate;
  } catch (e) {
    throw wrapError(`Error authenticating ${e.message}`, e);
  }
}

export async function findCustomer(member) {
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

export async function createCustomer(customer) {
  if (!isReady()) {
    return;
  }
  try {
    return await invoke('create_customer', customer);
  } catch (e) {
    throw wrapError(`Error creating customer: ${e.message}`, e);
  }
}

export async function linkCustomer(customer) {
  if (!isReady()) {
    return;
  }
  try {
    const linkCustomer = await invoke('link_customer', customer);
    console.log(linkCustomer);
    if (linkCustomer == null) {
      return linkCustomer;
    } else {
      throw new Error(linkCustomer);
    }
  } catch (e) {
    throw wrapError(`Error linking customer: ${e.message}`, e);
  }
}

export async function customerPlanDetails(customer) {
  if (!isReady()) {
    return;
  }
  try {
   return await invoke('get_customer_plan_details', customer);
  } catch (e) {
    throw wrapError(`Error linking customer: ${e.message}`, e);
  }
}

export async function getUserInfo(userUid) {
  if (!isReady()) {
    return;
  }
  try {
    const customer = await query('customer_get_info', { userUid });
    return customer;
  } catch (e) {
    throw wrapError(`Error getting user info: ${e.message}`, e);
  }
}

export async function getCustomerInfo(googleUID) {
  if (!isReady()) {
    return;
  }
  try {
    const customer = await query('customer_get_info', { googleUID });
    return customer;
  } catch (e) {
    throw wrapError(`Error getting user info: ${e.message}`, e);
  }
}

export async function searchPlan(employeeId) {
  if (!isReady()) {
    return;
  }
  try {
    const plan = await query('search_plan', { employeeId });
    return plan;
  } catch (e) {
    throw wrapError(`Error searching plan: ${e.message}`, e);
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
