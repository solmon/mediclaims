package main

import (
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

func createCustomer(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	customer := customer{}
	err := json.Unmarshal([]byte(args[0]), &customer)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixCustomer, []string{customer.GoogleUID})
	if err != nil {
		return shim.Error(err.Error())
	}

	// Check if the customer already exists
	customerAsBytes, _ := stub.GetState(key)
	// Customer does not exist, attempting creation
	if len(customerAsBytes) == 0 {
		customerAsBytes, err = json.Marshal(customer)
		if err != nil {
			return shim.Error(err.Error())
		}

		err = stub.PutState(key, customerAsBytes)
		if err != nil {
			return shim.Error(err.Error())
		}

		// Return nil, if customer is newly created
		return shim.Success(nil)
	}

	err = json.Unmarshal(customerAsBytes, &customer)
	if err != nil {
		return shim.Error(err.Error())
	}

	customerResponse := struct {
		GoogleUID  string `json:"google_uid"`
		PatientUID string `json:"patient_uid"`
		FirstName  string `json:"first_name"`
		LastName   string `json:"last_name "`
		Email      string `json:"email"`
		MemberUID  string `json:"member_uid,omitempty"`
	}{
		GoogleUID:  customer.GoogleUID,
		PatientUID: customer.PatientUID,
		FirstName:  customer.FirstName,
		LastName:   customer.LastName,
		Email:      customer.Email,
		MemberUID:  customer.MemberUID,
	}

	customerResponseAsBytes, err := json.Marshal(customerResponse)
	if err != nil {
		return shim.Error(err.Error())
	}
	// Return the object of the already existing customer
	return shim.Success(customerResponseAsBytes)
}

func authCustomer(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	input := struct {
		GoogleUID string `json:"google_uid"`
		Email     string `json:"email"`
	}{}

	err := json.Unmarshal([]byte(args[0]), &input)
	if err != nil {
		return shim.Error(err.Error())
	}

	customerResponse := struct {
		GoogleUID     string `json:"google_uid,omitempty"`
		PatientUID    string `json:"patient_uid,omitempty"`
		FirstName     string `json:"first_name,omitempty"`
		LastName      string `json:"last_name,omitempty"`
		Email         string `json:"email,omitempty"`
		MemberUID     string `json:"member_uid,omitempty"`
		Authenticated bool   `json:"authenticated,omitempty"`
	}{}

	customerKey, err := stub.CreateCompositeKey(prefixCustomer, []string{input.GoogleUID})
	if err != nil {
		return shim.Error(err.Error())
	}
	customerBytes, _ := stub.GetState(customerKey)

	if len(customerBytes) != 0 {
		customer := customer{}
		err := json.Unmarshal(customerBytes, &customer)
		if err != nil {
			return shim.Error(err.Error())
		}
		if (customer.Email == input.Email) && (customer.GoogleUID == input.GoogleUID) {
			customerResponse.Authenticated = true
			customerResponse.Email = customer.Email
			customerResponse.GoogleUID = customer.GoogleUID
			customerResponse.PatientUID = customer.PatientUID
			customerResponse.FirstName = customer.FirstName
			customerResponse.LastName = customer.LastName
			customerResponse.MemberUID = customer.MemberUID
		} else {
			customerResponse.Authenticated = false
			customerResponse.Email = ""
			customerResponse.GoogleUID = ""
			customerResponse.PatientUID = ""
			customerResponse.FirstName = ""
			customerResponse.LastName = ""
			customerResponse.MemberUID = ""
		}
	} else {
		return shim.Success(nil)
	}

	authBytes, _ := json.Marshal(customerResponse)
	return shim.Success(authBytes)
}

func getCustomer(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	input := struct {
		GoogleUID string `json:"google_uid"`
	}{}
	if len(args) == 1 {
		err := json.Unmarshal([]byte(args[0]), &input)
		if err != nil {
			return shim.Error(err.Error())
		}
	}
	customerKey, err := stub.CreateCompositeKey(prefixCustomer, []string{input.GoogleUID})
	if err != nil {
		return shim.Error(err.Error())
	}
	customerBytes, _ := stub.GetState(customerKey)
	customer := customer{}
	err = json.Unmarshal(customerBytes, &customer)
	if err != nil {
		return shim.Error(err.Error())
	}
	response := struct {
		GoogleUID  string `json:"google_uid"`
		PatientUID string `json:"patient_uid"`
		FirstName  string `json:"first_name"`
		LastName   string `json:"last_name "`
		Email      string `json:"email"`
		MemberUID  string `json:"member_uid,omitempty"`
	}{
		GoogleUID:  customer.GoogleUID,
		PatientUID: customer.PatientUID,
		FirstName:  customer.FirstName,
		LastName:   customer.LastName,
		Email:      customer.Email,
		MemberUID:  customer.MemberUID,
	}
	responseBytes, err := json.Marshal(response)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(responseBytes)
}

func getCustomerPlanDetails(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	input := struct {
		MemberUID string `json:"member_uid,omitempty"`
	}{}
	if len(args) == 1 {
		err := json.Unmarshal([]byte(args[0]), &input)
		if err != nil {
			return shim.Error(err.Error())
		}
	}
	response := struct {
		MemberDetails     memberType     `json:"member_details,omitempty"`
		HCE               []hce          `json:"hce,omitempty"`
		PlanDetails       benefitType    `json:"plan_details,omitempty"`
		EnrollmentDetails enrollmentType `json:"enrollment_details,omitempty"`
	}{}
	memberKey, err := stub.CreateCompositeKey(prefixMember, []string{input.MemberUID})
	if err == nil {
		memberBytes, _ := stub.GetState(memberKey)
		member := memberType{}
		err = json.Unmarshal(memberBytes, &member)
		if err == nil {
			response.MemberDetails = member
			resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixEnrollment, []string{})
			if err == nil {
				defer resultsIterator.Close()
				for resultsIterator.HasNext() {
					kvResult, err := resultsIterator.Next()
					if err == nil {
						ct := enrollmentType{}
						err = json.Unmarshal(kvResult.Value, &ct)
						if err == nil {
							if input.MemberUID == ct.MemberUID {
								response.EnrollmentDetails = ct
								benefitKey, err := stub.CreateCompositeKey(prefixBenefit, []string{ct.BenefitID})
								if err == nil {
									benefitBytes, _ := stub.GetState(benefitKey)
									benefit := benefitType{}
									err = json.Unmarshal(benefitBytes, &benefit)
									if err == nil {
										response.PlanDetails = benefit
										response.HCE = []hce{}
										resultsIterator2, err := stub.GetStateByPartialCompositeKey(prefixClaims, []string{})
										if err != nil {
											return shim.Error(err.Error())
										}
										defer resultsIterator2.Close()
										for resultsIterator2.HasNext() {
											kvResult, err := resultsIterator2.Next()
											if err == nil {
												ct := hce{}
												err = json.Unmarshal(kvResult.Value, &ct)
												if err == nil {
													if input.MemberUID == ct.MemberUID {
														response.HCE = append(response.HCE, ct)
													}
												}
											}
										}
									}
								}
								break
							}
						}
					}
				}
			}
		}
	}
	responseAsBytes, err := json.Marshal(response)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(responseAsBytes)
}

func linkCustomer(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	req := struct {
		GoogleUID string `json:"google_uid"`
		MemberUID string `json:"member_uid"`
	}{}
	customer := customer{}

	err := json.Unmarshal([]byte(args[0]), &req)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixCustomer, []string{req.GoogleUID})
	if err != nil {
		return shim.Error(err.Error())
	}

	valAsBytes, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}
	if len(valAsBytes) == 0 {
		return shim.Error("Customer could not be found")
	}
	err = json.Unmarshal(valAsBytes, &customer)
	if err != nil {
		return shim.Error(err.Error())
	}

	customer.MemberUID = req.MemberUID

	valAsBytes, err = json.Marshal(customer)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(key, valAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	memberKey, err := stub.CreateCompositeKey(prefixMember, []string{req.MemberUID})
	if err != nil {
		return shim.Error(err.Error())
	}
	memberBytes, _ := stub.GetState(memberKey)
	member := memberType{}
	err = json.Unmarshal(memberBytes, &member)
	if err != nil {
		return shim.Error(err.Error())
	}

	member.PatientUID = customer.PatientUID
	memberBytes, err = json.Marshal(member)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(memberKey, memberBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}

func findMemberUID(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	callingAsCustomer := len(args) == 1
	input := struct {
		EmployeeID string `json:"employee_id"`
		Ssn        string `json:"ssn"`
		Dob        string `json:"dob"`
	}{}
	if callingAsCustomer {
		err := json.Unmarshal([]byte(args[0]), &input)
		if err != nil {
			return shim.Error(err.Error())
		}
	}

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixMember, []string{})
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
			*memberType
		}{}
		err = json.Unmarshal(kvResult.Value, &ct)
		if err != nil {
			return shim.Error(err.Error())
		}

		if !callingAsCustomer ||
			(input.EmployeeID == ct.EmployeeID && input.Ssn == ct.Ssn && input.Dob == ct.Dob) {
			results = append(results, ct)
		}
	}

	returnBytes, err := json.Marshal(results)
	return shim.Success(returnBytes)
}
