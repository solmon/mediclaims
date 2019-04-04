#!/bin/sh
set -e

echo
echo "#################################################################"
echo "#######        Generating cryptographic material       ##########"
echo "#################################################################"
PROJPATH=$(pwd)
CLIPATH=$PROJPATH/cli/peers
ORDERERS=$CLIPATH/ordererOrganizations
PEERS=$CLIPATH/peerOrganizations

rm -rf $CLIPATH
$PROJPATH/cryptogen generate --config=$PROJPATH/crypto-config.yaml --output=$CLIPATH

sh generate-cfgtx.sh

# rm -rf $PROJPATH/{orderer,insurancePeer,hospitalPeer,customerPeer}/crypto
rm -rf $PROJPATH/orderer/crypto
rm -rf $PROJPATH/insurancePeer/crypto
rm -rf $PROJPATH/hospitalPeer/crypto
rm -rf $PROJPATH/customerPeer/crypto
# mkdir $PROJPATH/{orderer,insurancePeer,hospitalPeer,customerPeer}/crypto
mkdir $PROJPATH/orderer/crypto
mkdir $PROJPATH/insurancePeer/crypto
mkdir $PROJPATH/hospitalPeer/crypto
mkdir $PROJPATH/customerPeer/crypto
# cp -r $ORDERERS/orderer-org/orderers/orderer0/{msp,tls} $PROJPATH/orderer/crypto
cp -r $ORDERERS/orderer-org/orderers/orderer0/msp $PROJPATH/orderer/crypto
cp -r $ORDERERS/orderer-org/orderers/orderer0/tls $PROJPATH/orderer/crypto
# cp -r $PEERS/insurance-org/peers/insurance-peer/{msp,tls} $PROJPATH/insurancePeer/crypto
cp -r $PEERS/insurance-org/peers/insurance-peer/msp $PROJPATH/insurancePeer/crypto
cp -r $PEERS/insurance-org/peers/insurance-peer/tls $PROJPATH/insurancePeer/crypto
# cp -r $PEERS/hospital-org/peers/hospital-peer/{msp,tls} $PROJPATH/hospitalPeer/crypto
cp -r $PEERS/hospital-org/peers/hospital-peer/msp $PROJPATH/hospitalPeer/crypto
cp -r $PEERS/hospital-org/peers/hospital-peer/tls $PROJPATH/hospitalPeer/crypto
# cp -r $PEERS/customer-org/peers/customer-peer/{msp,tls} $PROJPATH/customerPeer/crypto
cp -r $PEERS/customer-org/peers/customer-peer/msp $PROJPATH/customerPeer/crypto
cp -r $PEERS/customer-org/peers/customer-peer/tls $PROJPATH/customerPeer/crypto
cp $CLIPATH/genesis.block $PROJPATH/orderer/crypto/

INSURANCECAPATH=$PROJPATH/insuranceCA
HOSPITALCAPATH=$PROJPATH/hospitalCA
CUSTOMERCAPATH=$PROJPATH/customerCA

# rm -rf {$INSURANCECAPATH,$HOSPITALCAPATH,$CUSTOMERCAPATH}/{ca,tls}
rm -rf $INSURANCECAPATH/ca
rm -rf $HOSPITALCAPATH/ca
rm -rf $CUSTOMERCAPATH/ca
rm -rf $INSURANCECAPATH/tls
rm -rf $HOSPITALCAPATH/tls
rm -rf $CUSTOMERCAPATH/tls
# mkdir -p {$INSURANCECAPATH,$HOSPITALCAPATH,$CUSTOMERCAPATH}/{ca,tls}
mkdir -p $INSURANCECAPATH/ca
mkdir -p $HOSPITALCAPATH/ca
mkdir -p $CUSTOMERCAPATH/ca
mkdir -p $INSURANCECAPATH/tls
mkdir -p $HOSPITALCAPATH/tls
mkdir -p $CUSTOMERCAPATH/tls
cp $PEERS/insurance-org/ca/* $INSURANCECAPATH/ca
cp $PEERS/insurance-org/tlsca/* $INSURANCECAPATH/tls
mv $INSURANCECAPATH/ca/*_sk $INSURANCECAPATH/ca/key.pem
mv $INSURANCECAPATH/ca/*-cert.pem $INSURANCECAPATH/ca/cert.pem
mv $INSURANCECAPATH/tls/*_sk $INSURANCECAPATH/tls/key.pem
mv $INSURANCECAPATH/tls/*-cert.pem $INSURANCECAPATH/tls/cert.pem

cp $PEERS/hospital-org/ca/* $HOSPITALCAPATH/ca
cp $PEERS/hospital-org/tlsca/* $HOSPITALCAPATH/tls
mv $HOSPITALCAPATH/ca/*_sk $HOSPITALCAPATH/ca/key.pem
mv $HOSPITALCAPATH/ca/*-cert.pem $HOSPITALCAPATH/ca/cert.pem
mv $HOSPITALCAPATH/tls/*_sk $HOSPITALCAPATH/tls/key.pem
mv $HOSPITALCAPATH/tls/*-cert.pem $HOSPITALCAPATH/tls/cert.pem

cp $PEERS/customer-org/ca/* $CUSTOMERCAPATH/ca
cp $PEERS/customer-org/tlsca/* $CUSTOMERCAPATH/tls
mv $CUSTOMERCAPATH/ca/*_sk $CUSTOMERCAPATH/ca/key.pem
mv $CUSTOMERCAPATH/ca/*-cert.pem $CUSTOMERCAPATH/ca/cert.pem
mv $CUSTOMERCAPATH/tls/*_sk $CUSTOMERCAPATH/tls/key.pem
mv $CUSTOMERCAPATH/tls/*-cert.pem $CUSTOMERCAPATH/tls/cert.pem

WEBCERTS=$PROJPATH/web/certs
rm -rf $WEBCERTS
mkdir -p $WEBCERTS
cp $PROJPATH/orderer/crypto/tls/ca.crt $WEBCERTS/ordererOrg.pem
cp $PROJPATH/insurancePeer/crypto/tls/ca.crt $WEBCERTS/insuranceOrg.pem
cp $PROJPATH/hospitalPeer/crypto/tls/ca.crt $WEBCERTS/hospitalOrg.pem
cp $PROJPATH/customerPeer/crypto/tls/ca.crt $WEBCERTS/customerOrg.pem
cp $PEERS/insurance-org/users/Admin@insurance-org/msp/keystore/* $WEBCERTS/Admin@insurance-org-key.pem
cp $PEERS/insurance-org/users/Admin@insurance-org/msp/signcerts/* $WEBCERTS/
cp $PEERS/customer-org/users/Admin@customer-org/msp/keystore/* $WEBCERTS/Admin@customer-org-key.pem
cp $PEERS/customer-org/users/Admin@customer-org/msp/signcerts/* $WEBCERTS/
cp $PEERS/hospital-org/users/Admin@hospital-org/msp/keystore/* $WEBCERTS/Admin@hospital-org-key.pem
cp $PEERS/hospital-org/users/Admin@hospital-org/msp/signcerts/* $WEBCERTS/