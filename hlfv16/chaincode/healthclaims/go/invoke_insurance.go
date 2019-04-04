package main

import (
	"encoding/json"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func listBenefitTypes(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	callingAsMerchant := len(args) == 1
	input := struct {
		ShopType string `json:"shop_type"`
	}{}
	if callingAsMerchant {
		err := json.Unmarshal([]byte(args[0]), &input)
		if err != nil {
			return shim.Error(err.Error())
		}
	}

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixContractType, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	results := []interface{}{}
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		ct := struct {
			UUID string `json:"uuid"`
			*contractType
		}{}
		err = json.Unmarshal(kvResult.Value, &ct)
		if err != nil {
			return shim.Error(err.Error())
		}
		prefix, keyParts, err := stub.SplitCompositeKey(kvResult.Key)
		if err != nil {
			return shim.Error(err.Error())
		}
		if len(keyParts) > 0 {
			ct.UUID = keyParts[0]
		} else {
			ct.UUID = prefix
		}

		// Apply proper filtering, merchants should only see active contracts
		if !callingAsMerchant ||
			(strings.Contains(strings.ToTitle(ct.ShopType), strings.ToTitle(input.ShopType)) && ct.Active) {
			results = append(results, ct)
		}
	}

	returnBytes, err := json.Marshal(results)
	return shim.Success(returnBytes)
}

func listInsurers(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	callingAsMerchant := len(args) == 1
	input := struct {
		ShopType string `json:"shop_type"`
	}{}
	if callingAsMerchant {
		err := json.Unmarshal([]byte(args[0]), &input)
		if err != nil {
			return shim.Error(err.Error())
		}
	}

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixContractType, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	results := []interface{}{}
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		ct := struct {
			UUID string `json:"uuid"`
			*contractType
		}{}
		err = json.Unmarshal(kvResult.Value, &ct)
		if err != nil {
			return shim.Error(err.Error())
		}
		prefix, keyParts, err := stub.SplitCompositeKey(kvResult.Key)
		if err != nil {
			return shim.Error(err.Error())
		}
		if len(keyParts) > 0 {
			ct.UUID = keyParts[0]
		} else {
			ct.UUID = prefix
		}

		// Apply proper filtering, merchants should only see active contracts
		if !callingAsMerchant ||
			(strings.Contains(strings.ToTitle(ct.ShopType), strings.ToTitle(input.ShopType)) && ct.Active) {
			results = append(results, ct)
		}
	}

	returnBytes, err := json.Marshal(results)
	return shim.Success(returnBytes)
}

func listProviders(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	callingAsMerchant := len(args) == 1
	input := struct {
		ShopType string `json:"shop_type"`
	}{}
	if callingAsMerchant {
		err := json.Unmarshal([]byte(args[0]), &input)
		if err != nil {
			return shim.Error(err.Error())
		}
	}

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixContractType, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	results := []interface{}{}
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		ct := struct {
			UUID string `json:"uuid"`
			*contractType
		}{}
		err = json.Unmarshal(kvResult.Value, &ct)
		if err != nil {
			return shim.Error(err.Error())
		}
		prefix, keyParts, err := stub.SplitCompositeKey(kvResult.Key)
		if err != nil {
			return shim.Error(err.Error())
		}
		if len(keyParts) > 0 {
			ct.UUID = keyParts[0]
		} else {
			ct.UUID = prefix
		}

		// Apply proper filtering, merchants should only see active contracts
		if !callingAsMerchant ||
			(strings.Contains(strings.ToTitle(ct.ShopType), strings.ToTitle(input.ShopType)) && ct.Active) {
			results = append(results, ct)
		}
	}

	returnBytes, err := json.Marshal(results)
	return shim.Success(returnBytes)
}
