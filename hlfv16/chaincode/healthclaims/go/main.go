package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

const prefixBenefitType = "benefit_type"
const prefixBenefit = "benefit"
const prefixClaim = "claim"
const prefixUser = "userprofile"
const prefixInsurer = "insurer"
const prefixProvider = "provider"

var logger = shim.NewLogger("main")

type SmartContract struct {
}

var bcFunctions = map[string]func(shim.ChaincodeStubInterface, []string) pb.Response{
	// Insurance Peer
	"benefit_type_ls": listBenefitTypes,
	"insurer_ls":      listInsurers,
	"provider_ls":     listProviders,
}

func (t *SmartContract) Init(stub shim.ChaincodeStubInterface) pb.Response {
	_, args := stub.GetFunctionAndParameters()

	if len(args) == 1 {
		var contractTypes []struct {
			UUID string `json:"uuid"`
			*contractType
		}
		err := json.Unmarshal([]byte(args[0]), &contractTypes)
		if err != nil {
			return shim.Error(err.Error())
		}
		for _, ct := range contractTypes {
			contractTypeKey, err := stub.CreateCompositeKey(prefixContractType, []string{ct.UUID})
			if err != nil {
				return shim.Error(err.Error())
			}
			contractTypeAsBytes, err := json.Marshal(ct.contractType)
			if err != nil {
				return shim.Error(err.Error())
			}
			err = stub.PutState(contractTypeKey, contractTypeAsBytes)
			if err != nil {
				return shim.Error(err.Error())
			}
		}
	}
	return shim.Success(nil)
}

func (t *SmartContract) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()

	if function == "init" {
		return t.Init(stub)
	}
	bcFunc := bcFunctions[function]
	if bcFunc == nil {
		return shim.Error("Invalid invoke function.")
	}
	return bcFunc(stub, args)
}

func main() {
	logger.SetLevel(shim.LogInfo)

	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}
