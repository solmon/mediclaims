'use strict';

import config, { DEFAULT_PLAN_TYPES, DEFAULT_CORPORATE_USERS } from './config';
import { OrganizationClient } from './utils';
import http from 'http';
import url from 'url';

let status = 'down';
let statusChangedCallbacks = [];

// Setup clients per organization
const insuranceClient = new OrganizationClient(
  config.channelName,
  config.orderer0,
  config.insuranceOrg.peer,
  config.insuranceOrg.ca,
  config.insuranceOrg.admin
);
const customerClient = new OrganizationClient(
  config.channelName,
  config.orderer0,
  config.customerOrg.peer,
  config.customerOrg.ca,
  config.customerOrg.admin
);
const hospitalClient = new OrganizationClient(
  config.channelName,
  config.orderer0,
  config.hospitalOrg.peer,
  config.hospitalOrg.ca,
  config.hospitalOrg.admin
);


function setStatus(s) {
  status = s;

  setTimeout(() => {
    statusChangedCallbacks
      .filter(f => typeof f === 'function')
      .forEach(f => f(s));
  }, 1000);
}

export function subscribeStatus(cb) {
  if (typeof cb === 'function') {
    statusChangedCallbacks.push(cb);
  }
}

export function getStatus() {
  return status;
}

export function isReady() {
  return status === 'ready';
}

function getAdminOrgs() {
  return Promise.all([
    insuranceClient.getOrgAdmin(),
    customerClient.getOrgAdmin(),
    hospitalClient.getOrgAdmin()
  ]);
}

(async () => {
  // Login
  try {
    await Promise.all([
      insuranceClient.login(),
      customerClient.login(),
      hospitalClient.login()
    ]);
  } catch (e) {
    console.log('Fatal error logging into blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  }
  // Setup event hubs
  insuranceClient.initEventHubs();
  customerClient.initEventHubs();
  hospitalClient.initEventHubs();

  // Bootstrap blockchain network
  try {
    await getAdminOrgs();
    if (!(await insuranceClient.checkChannelMembership())) {
      console.log('Default channel not found, attempting creation...');
      const createChannelResponse =
        await insuranceClient.createChannel(config.channelConfig);
      if (createChannelResponse.status === 'SUCCESS') {
        console.log('Successfully created a new default channel.');
        console.log('Joining peers to the default channel.');
        await Promise.all([
          insuranceClient.joinChannel(),
          customerClient.joinChannel(),
          hospitalClient.joinChannel()
        ]);
        // Wait for 10s for the peers to join the newly created channel
        await new Promise(resolve => {
          setTimeout(resolve, 10000);
        });
      }
    }
  } catch (e) {
    console.log('Fatal error bootstrapping the blockchain network!');
    console.log(e);
    process.exit(-1);
  }

  // Initialize network
  try {
    await Promise.all([
      insuranceClient.initialize(),
      customerClient.initialize(),
      hospitalClient.initialize()
    ]);
  } catch (e) {
    console.log('Fatal error initializing blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  }

  // Install chaincode on all peers
  let installedOnInsuranceOrg, installedOnCustumerOrg, installedOnHospitalOrg;
  try {
    await getAdminOrgs();
    installedOnInsuranceOrg = await insuranceClient.checkInstalled(
      config.chaincodeId, config.chaincodeVersion, config.chaincodePath);
    installedOnCustumerOrg = await customerClient.checkInstalled(
      config.chaincodeId, config.chaincodeVersion, config.chaincodePath);
    installedOnHospitalOrg = await hospitalClient.checkInstalled(
      config.chaincodeId, config.chaincodeVersion, config.chaincodePath);
  } catch (e) {
    console.log('Fatal error getting installation status of the chaincode!');
    console.log(e);
    process.exit(-1);
  }

  if (!(installedOnInsuranceOrg && installedOnCustumerOrg &&
    installedOnHospitalOrg)) {
    console.log('Chaincode is not installed, attempting installation...');

    // Pull chaincode environment base image
    try {
      await getAdminOrgs();
      const socketPath = process.env.DOCKER_SOCKET_PATH ||
      (process.platform === 'win32' ? '//./pipe/docker_engine' : '/var/run/docker.sock');
      const ccenvImage = process.env.DOCKER_CCENV_IMAGE ||
        'hyperledger/fabric-ccenv:x86_64-1.1.0';
      const listOpts = { socketPath, method: 'GET', path: '/images/json' };
      const pullOpts = {
        socketPath, method: 'POST',
        path: url.format({ pathname: '/images/create', query: { fromImage: ccenvImage } })
      };

      const images = await new Promise((resolve, reject) => {
        const req = http.request(listOpts, (response) => {
          let data = '';
          response.setEncoding('utf-8');
          response.on('data', chunk => { data += chunk; });
          response.on('end', () => { resolve(JSON.parse(data)); });
        });
        req.on('error', reject); req.end();
      });

      const imageExists = images.some(
        i => i.RepoTags && i.RepoTags.some(tag => tag === ccenvImage));
      if (!imageExists) {
        console.log(
          'Base container image not present, pulling from Docker Hub...');
        await new Promise((resolve, reject) => {
          const req = http.request(pullOpts, (response) => {
            response.on('data', () => { });
            response.on('end', () => { resolve(); });
          });
          req.on('error', reject); req.end();
        });
        console.log('Base container image downloaded.');
      } else {
        console.log('Base container image present.');
      }
    } catch (e) {
      console.log('Fatal error pulling docker images.');
      console.log(e);
      process.exit(-1);
    }

    // Install chaincode
    const installationPromises = [
      insuranceClient.install(
        config.chaincodeId, config.chaincodeVersion, config.chaincodePath),
      customerClient.install(
        config.chaincodeId, config.chaincodeVersion, config.chaincodePath),
      hospitalClient.install(
        config.chaincodeId, config.chaincodeVersion, config.chaincodePath)
    ];
    try {
      await Promise.all(installationPromises);
      await new Promise(resolve => {   setTimeout(resolve, 10000); });
      console.log('Successfully installed chaincode on the default channel.');
    } catch (e) {
      console.log('Fatal error installing chaincode on the default channel!');
      console.log(e);
      process.exit(-1);
    }

    // Instantiate chaincode on all peers
    // Instantiating the chaincode on a single peer should be enough (for now)
    try {
      // Initial contract types
      await insuranceClient.instantiate(config.chaincodeId,
        config.chaincodeVersion, DEFAULT_CORPORATE_USERS);
      console.log('Successfully instantiated chaincode on all peers.');
      setStatus('ready');
    } catch (e) {
      console.log('Fatal error instantiating chaincode on some(all) peers!');
      console.log(e);
      process.exit(-1);
    }
  } else {
    console.log('Chaincode already installed on the blockchain network.');
    setStatus('ready');
  }
})();

// Export organization clients
export {
  insuranceClient,
  customerClient,
  hospitalClient
};
