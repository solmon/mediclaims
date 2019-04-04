#!/bin/sh

CHANNEL_NAME="default"
PROJPATH=$(pwd)
CLIPATH=$PROJPATH/cli/peers

echo
echo "##########################################################"
echo "#########  Generating Orderer Genesis block ##############"
echo "##########################################################"
$PROJPATH/configtxgen -profile ThreeOrgsGenesis -outputBlock $CLIPATH/genesis.block

echo
echo "#################################################################"
echo "### Generating channel configuration transaction 'channel.tx' ###"
echo "#################################################################"
$PROJPATH/configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx $CLIPATH/channel.tx -channelID $CHANNEL_NAME
cp $CLIPATH/channel.tx $PROJPATH/web
echo
echo "#################################################################"
echo "####### Generating anchor peer update for InsuranceOrg ##########"
echo "#################################################################"
$PROJPATH/configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate $CLIPATH/InsuranceOrgMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg InsuranceOrgMSP

echo
echo "#################################################################"
echo "#######    Generating anchor peer update for CustomerOrg   ##########"
echo "#################################################################"
$PROJPATH/configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate $CLIPATH/CustomerOrgMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg CustomerOrgMSP

echo
echo "##################################################################"
echo "####### Generating anchor peer update for HospitalOrg ##########"
echo "##################################################################"
$PROJPATH/configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate $CLIPATH/HospitalOrgMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg HospitalOrgMSP
