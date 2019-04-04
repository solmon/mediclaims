import { readFileSync } from 'fs';
import { resolve } from 'path';

const basePath = resolve(__dirname, '../../certs');
const readCryptoFile =
  filename => readFileSync(resolve(basePath, filename)).toString();
const config = {
  channelName: 'default',
  channelConfig: readFileSync(resolve(__dirname, '../../channel.tx')),
  chaincodeId: 'bcins',
  chaincodeVersion: 'v2',
  chaincodePath: 'bcins',
  orderer0: {
    hostname: 'orderer0',
    url: 'grpcs://orderer0:7050',
    pem: readCryptoFile('ordererOrg.pem')
  },
  insuranceOrg: {
    peer: {
      hostname: 'insurance-peer',
      url: 'grpcs://insurance-peer:7051',
      eventHubUrl: 'grpcs://insurance-peer:7053',
      pem: readCryptoFile('insuranceOrg.pem')
    },
    ca: {
      hostname: 'insurance-ca',
      url: 'https://insurance-ca:7054',
      mspId: 'InsuranceOrgMSP'
    },
    admin: {
      key: readCryptoFile('Admin@insurance-org-key.pem'),
      cert: readCryptoFile('Admin@insurance-org-cert.pem')
    }
  },
  customerOrg: {
    peer: {
      hostname: 'customer-peer',
      url: 'grpcs://customer-peer:7051',
      eventHubUrl: 'grpcs://customer-peer:7053',
      pem: readCryptoFile('customerOrg.pem')
    },
    ca: {
      hostname: 'customer-ca',
      url: 'https://customer-ca:7054',
      mspId: 'CustomerOrgMSP'
    },
    admin: {
      key: readCryptoFile('Admin@customer-org-key.pem'),
      cert: readCryptoFile('Admin@customer-org-cert.pem')
    }
  },
  hospitalOrg: {
    peer: {
      hostname: 'hospital-peer',
      url: 'grpcs://hospital-peer:7051',
      pem: readCryptoFile('hospitalOrg.pem'),
      eventHubUrl: 'grpcs://hospital-peer:7053',
    },
    ca: {
      hostname: 'hospital-ca',
      url: 'https://hospital-ca:7054',
      mspId: 'HospitalOrgMSP'
    },
    admin: {
      key: readCryptoFile('Admin@hospital-org-key.pem'),
      cert: readCryptoFile('Admin@hospital-org-cert.pem')
    }
  }
};

if (!process.env.LOCALCONFIG) {
  config.orderer0.url = 'grpcs://localhost:7050';

  config.insuranceOrg.peer.url = 'grpcs://localhost:7051';
  config.customerOrg.peer.url = 'grpcs://localhost:8051';
  config.hospitalOrg.peer.url = 'grpcs://localhost:9051';

  config.insuranceOrg.peer.eventHubUrl = 'grpcs://localhost:7053';
  config.customerOrg.peer.eventHubUrl = 'grpcs://localhost:8053';
  config.hospitalOrg.peer.eventHubUrl = 'grpcs://localhost:9053';

  config.insuranceOrg.ca.url = 'https://localhost:7054';
  config.customerOrg.ca.url = 'https://localhost:8054';
  config.hospitalOrg.ca.url = 'https://localhost:9054';
}

export default config;

export const DEFAULT_PLAN_TYPES = [
  {
    planID: 'ZA1',
    sumAssured: 3500
  },
  {
    planID: 'ZA2',
    sumAssured: 4500
  }
];

export const DEFAULT_CORPORATE_USERS = [{
    uuid: '3ef076a-33a1-41d2-a9bc-2777505b014f',
    employeeID: 'tek2086',
    planTitle: "ZA2",
    sumAssured: 4500
  }
];
