package main

import "github.com/hyperledger/fabric/core/chaincode/shim"
import (
	"encoding/json"

	pb "github.com/hyperledger/fabric/protos/peer"
)

func createPhysician(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	physician := physician{}
	err := json.Unmarshal([]byte(args[0]), &physician)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixPhysician, []string{physician.PhysicianUID})
	if err != nil {
		return shim.Error(err.Error())
	}

	physicianAsBytes, _ := stub.GetState(key)
	if len(physicianAsBytes) == 0 {
		physicianAsBytes, err = json.Marshal(physician)
		if err != nil {
			return shim.Error(err.Error())
		}

		err = stub.PutState(key, physicianAsBytes)
		if err != nil {
			return shim.Error(err.Error())
		}

		// Return nil, if physician is newly created
		return shim.Success(nil)
	}

	err = json.Unmarshal(physicianAsBytes, &physician)
	if err != nil {
		return shim.Error(err.Error())
	}

	physicianResponse := struct {
		PhysicianUID string `json:"physician_uid"`
		ProviderUID  string `json:"provider_uid"`
		FirstName    string `json:"first_name"`
		LastName     string `json:"last_name"`
		Email        string `json:"email"`
		Password     string `json:"password"`
	}{
		PhysicianUID: physician.PhysicianUID,
		ProviderUID:  physician.ProviderUID,
		FirstName:    physician.FirstName,
		LastName:     physician.LastName,
		Email:        physician.Email,
		Password:     physician.Password,
	}

	physicianResponseAsBytes, err := json.Marshal(physicianResponse)
	if err != nil {
		return shim.Error(err.Error())
	}
	// Return the object of the already existing physician
	return shim.Success(physicianResponseAsBytes)
}

func createProvider(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	provider := provider{}
	err := json.Unmarshal([]byte(args[0]), &provider)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixProvider, []string{provider.ProviderUID})
	if err != nil {
		return shim.Error(err.Error())
	}

	providerAsBytes, _ := stub.GetState(key)
	if len(providerAsBytes) == 0 {
		providerAsBytes, err = json.Marshal(provider)
		if err != nil {
			return shim.Error(err.Error())
		}

		err = stub.PutState(key, providerAsBytes)
		if err != nil {
			return shim.Error(err.Error())
		}

		// Return nil, if provider is newly created
		return shim.Success(nil)
	}

	err = json.Unmarshal(providerAsBytes, &provider)
	if err != nil {
		return shim.Error(err.Error())
	}

	providerResponse := struct {
		ProviderUID  string        `json:"provider_uid"`
		ProviderName string        `json:"provider_name"`
		Address      string        `json:"address"`
		Email        string        `json:"email"`
		Password     string        `json:"password"`
		Services     []serviceType `json:"services,omitempty"`
	}{
		ProviderUID:  provider.ProviderUID,
		ProviderName: provider.ProviderName,
		Address:      provider.Address,
		Email:        provider.Email,
		Password:     provider.Password,
		Services:     provider.Services,
	}

	providerResponseAsBytes, err := json.Marshal(providerResponse)
	if err != nil {
		return shim.Error(err.Error())
	}
	// Return the object of the already existing provider
	return shim.Success(providerResponseAsBytes)
}

func addService(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	input := struct {
		ProviderUID string      `json:"provider_uid"`
		Service     serviceType `json:"service"`
	}{}
	err := json.Unmarshal([]byte(args[0]), &input)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixProvider, []string{input.ProviderUID})
	if err != nil {
		return shim.Error(err.Error())
	}

	provider := provider{}
	providerAsBytes, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}
	if len(providerAsBytes) == 0 {
		return shim.Error("Provider could not be found")
	}
	err = json.Unmarshal(providerAsBytes, &provider)
	if err != nil {
		return shim.Error(err.Error())
	}

	if provider.Services == nil {
		provider.Services = []serviceType{}
		provider.Services = append(provider.Services, input.Service)
	} else {
		if containsService(provider.Services, input.Service.ServiceCode) {
			return shim.Success(nil)
		}
		provider.Services = append(provider.Services, input.Service)
	}

	providerAsBytes, err = json.Marshal(provider)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(key, providerAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}

func getServices(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	input := struct {
		ProviderUID string `json:"provider_uid"`
	}{}
	err := json.Unmarshal([]byte(args[0]), &input)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixProvider, []string{input.ProviderUID})
	if err != nil {
		return shim.Error(err.Error())
	}

	provider := provider{}
	service := []serviceType{}
	providerAsBytes, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}
	if len(providerAsBytes) == 0 {
		return shim.Error("Provider could not be found")
	}
	err = json.Unmarshal(providerAsBytes, &provider)
	if err != nil {
		return shim.Error(err.Error())
	}

	if provider.Services == nil {
		return shim.Success(nil)
	}

	service = provider.Services
	serviceBytes, _ := json.Marshal(service)
	return shim.Success(serviceBytes)
}

func authProvider(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	input := struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}{}

	providerResponse := struct {
		ProviderUID   string        `json:"provider_uid"`
		ProviderName  string        `json:"provider_name"`
		Address       string        `json:"address"`
		Email         string        `json:"email"`
		Services      []serviceType `json:"services"`
		Authenticated bool          `json:"authenticated,omitempty"`
	}{}
	err := json.Unmarshal([]byte(args[0]), &input)
	if err != nil {
		return shim.Error(err.Error())
	}

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixProvider, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		ct := struct {
			*provider
		}{}
		err = json.Unmarshal(kvResult.Value, &ct)
		if err != nil {
			return shim.Error(err.Error())
		}

		if (input.Email == ct.Email) && (input.Password == ct.Password) {
			providerResponse.Address = ct.Address
			providerResponse.Email = ct.Email
			providerResponse.ProviderUID = ct.ProviderUID
			providerResponse.ProviderName = ct.ProviderName
			providerResponse.Services = ct.Services
			providerResponse.Authenticated = true
			break
		} else {
			providerResponse.Authenticated = false
		}
	}

	providerBytes, _ := json.Marshal(providerResponse)
	return shim.Success(providerBytes)
}

func authPhysician(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	input := struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}{}

	physicianResponse := struct {
		PhysicianUID  string `json:"physician_uid,omitempty"`
		ProviderUID   string `json:"provider_uid,omitempty"`
		FirstName     string `json:"first_name,omitempty"`
		LastName      string `json:"last_name,omitempty"`
		Email         string `json:"email,omitempty"`
		Authenticated bool   `json:"authenticated,omitempty"`
	}{}
	physicianResponse.Authenticated = false
	err := json.Unmarshal([]byte(args[0]), &input)
	if err != nil {
		return shim.Error(err.Error())
	}

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixPhysician, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		ct := struct {
			*physician
		}{}
		err = json.Unmarshal(kvResult.Value, &ct)
		if err != nil {
			return shim.Error(err.Error())
		}

		if (input.Email == ct.Email) && (input.Password == ct.Password) {
			physicianResponse.Authenticated = true
			physicianResponse.Email = ct.Email
			physicianResponse.PhysicianUID = ct.PhysicianUID
			physicianResponse.ProviderUID = ct.ProviderUID
			physicianResponse.FirstName = ct.FirstName
			physicianResponse.LastName = ct.LastName
			break
		} else {
			physicianResponse.Authenticated = false
		}
	}

	authBytes, _ := json.Marshal(physicianResponse)
	return shim.Success(authBytes)
}

func findEnrollment(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	input := struct {
		Ssn string `json:"ssn"`
	}{}
	if len(args) == 1 {
		err := json.Unmarshal([]byte(args[0]), &input)
		if err != nil {
			return shim.Error(err.Error())
		}
	}

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixEnrollment, []string{})
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
			*enrollmentType
		}{}
		err = json.Unmarshal(kvResult.Value, &ct)
		if err != nil {
			return shim.Error(err.Error())
		}

		if input.Ssn == ct.Ssn {
			results = append(results, ct)
		}
	}

	returnBytes, err := json.Marshal(results)
	return shim.Success(returnBytes)
}

func getBenefitHospital(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	input := struct {
		BenefitID string `json:"benefit_id"`
	}{}
	if len(args) == 1 {
		err := json.Unmarshal([]byte(args[0]), &input)
		if err != nil {
			return shim.Error(err.Error())
		}
	}
	benefitKey, err := stub.CreateCompositeKey(prefixBenefit, []string{input.BenefitID})
	if err != nil {
		return shim.Error(err.Error())
	}
	benefitBytes, _ := stub.GetState(benefitKey)
	benefit := benefitType{}
	err = json.Unmarshal(benefitBytes, &benefit)
	if err != nil {
		return shim.Error(err.Error())
	}
	response := struct {
		BenefitID      string     `json:"benefit_id"`
		BenefitTitle   string     `json:"benefit_title"`
		PayerID        string     `json:"payer_id"`
		PayerTitle     string     `json:"payer_title"`
		TypeOfBenefit  string     `json:"type_of_benefit"`
		CoverageAmount int32      `json:"coverage_amount"`
		MonthlyPremium int32      `json:"monthly_premium"`
		Rules          []ruleType `json:"rules,omitempty"`
	}{
		BenefitID:      benefit.BenefitID,
		BenefitTitle:   benefit.BenefitTitle,
		PayerID:        benefit.PayerID,
		PayerTitle:     benefit.PayerTitle,
		TypeOfBenefit:  benefit.TypeOfBenefit,
		CoverageAmount: benefit.CoverageAmount,
		MonthlyPremium: benefit.MonthlyPremium,
		Rules:          benefit.Rules,
	}
	responseBytes, err := json.Marshal(response)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(responseBytes)
}

func createClaimHospital(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	claim := hce{}
	err := json.Unmarshal([]byte(args[0]), &claim)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixClaims, []string{claim.ClaimID})
	if err != nil {
		return shim.Error(err.Error())
	}

	if claim.Procedures != nil && len(claim.Procedures) != 0 {
		benefitKey, err := stub.CreateCompositeKey(prefixBenefit, []string{claim.BenefitID})
		if err != nil {
			return shim.Error(err.Error())
		}
		benefit := benefitType{}
		benefitBytes, _ := stub.GetState(benefitKey)
		err = json.Unmarshal(benefitBytes, &benefit)
		if err == nil {
			insuranceKey, err := stub.CreateCompositeKey(prefixInsurance, []string{benefit.PayerID})
			if err == nil {
				insurance := insurance{}
				insuranceAsBytes, _ := stub.GetState(insuranceKey)
				err = json.Unmarshal(insuranceAsBytes, &insurance)
				if err == nil {
					total := struct {
						PatientTotal   int32
						InsuranceTotal int32
						ClaimTotal     int32
					}{}
					total.PatientTotal = 0
					total.InsuranceTotal = 0
					total.ClaimTotal = 0
					for index, element := range claim.Procedures {
						if insurance.Providers != nil {
							if contains(insurance.Providers, element.ProviderUID) {
								claim.Procedures[index].ComputeType = "IN"
								if containsRule(benefit.Rules, element.ProcedureCode) {
									ruleCheck := getRule(benefit.Rules, element.ProcedureCode)
									if ruleCheck.CoverageAmount > element.FeeTotal {
										claim.Procedures[index].InsuranceCoverage = (element.FeeTotal * ruleCheck.InCoverage) / 100
										total.InsuranceTotal = total.InsuranceTotal + claim.Procedures[index].InsuranceCoverage
										total.PatientTotal = total.PatientTotal + (element.FeeTotal - claim.Procedures[index].InsuranceCoverage)
									} else {
										claim.Procedures[index].InsuranceCoverage = (ruleCheck.CoverageAmount * ruleCheck.InCoverage) / 100
										total.PatientTotal = total.PatientTotal + (element.FeeTotal - ruleCheck.CoverageAmount)
										total.InsuranceTotal = total.InsuranceTotal + claim.Procedures[index].InsuranceCoverage
									}
									claim.Procedures[index].InsurancePercantage = ruleCheck.InCoverage
									claim.Procedures[index].PayerPercantage = 100 - ruleCheck.InCoverage
								} else {
									claim.Procedures[index].InsuranceCoverage = 0
									claim.Procedures[index].InsurancePercantage = 0
									claim.Procedures[index].PayerPercantage = 100
									total.PatientTotal = total.PatientTotal + element.FeeTotal
								}
							} else {
								claim.Procedures[index].ComputeType = "OUT"
								if containsRule(benefit.Rules, element.ProcedureCode) {
									ruleCheck := getRule(benefit.Rules, element.ProcedureCode)
									if ruleCheck.CoverageAmount > element.FeeTotal {
										claim.Procedures[index].InsuranceCoverage = (element.FeeTotal * ruleCheck.OutCoverage) / 100
										total.InsuranceTotal = total.InsuranceTotal + claim.Procedures[index].InsuranceCoverage
										total.PatientTotal = total.PatientTotal + (element.FeeTotal - claim.Procedures[index].InsuranceCoverage)
									} else {
										claim.Procedures[index].InsuranceCoverage = (ruleCheck.CoverageAmount * ruleCheck.OutCoverage) / 100
										total.PatientTotal = total.PatientTotal + (element.FeeTotal - ruleCheck.CoverageAmount)
										total.InsuranceTotal = total.InsuranceTotal + claim.Procedures[index].InsuranceCoverage
									}
									claim.Procedures[index].InsurancePercantage = ruleCheck.OutCoverage
									claim.Procedures[index].PayerPercantage = 100 - ruleCheck.OutCoverage
								} else {
									claim.Procedures[index].InsuranceCoverage = 0
									claim.Procedures[index].InsurancePercantage = 0
									claim.Procedures[index].PayerPercantage = 100
									total.PatientTotal = total.PatientTotal + element.FeeTotal
								}
							}
							total.ClaimTotal = total.ClaimTotal + claim.Procedures[index].FeeTotal
						} else {
							if containsRule(benefit.Rules, element.ProcedureCode) {
								ruleCheck := getRule(benefit.Rules, element.ProcedureCode)
								if ruleCheck.CoverageAmount > element.FeeTotal {
									claim.Procedures[index].InsuranceCoverage = (element.FeeTotal * ruleCheck.OutCoverage) / 100
									total.InsuranceTotal = total.InsuranceTotal + claim.Procedures[index].InsuranceCoverage
									total.PatientTotal = total.PatientTotal + (element.FeeTotal - claim.Procedures[index].InsuranceCoverage)
								} else {
									claim.Procedures[index].InsuranceCoverage = (ruleCheck.CoverageAmount * ruleCheck.OutCoverage) / 100
									total.PatientTotal = total.PatientTotal + (element.FeeTotal - ruleCheck.CoverageAmount)
									total.InsuranceTotal = total.InsuranceTotal + claim.Procedures[index].InsuranceCoverage
								}
								claim.Procedures[index].InsurancePercantage = ruleCheck.OutCoverage
								claim.Procedures[index].PayerPercantage = 100 - ruleCheck.OutCoverage
							} else {
								claim.Procedures[index].InsuranceCoverage = 0
								claim.Procedures[index].InsurancePercantage = 0
								claim.Procedures[index].PayerPercantage = 100
								total.PatientTotal = total.PatientTotal + element.FeeTotal
							}
							total.ClaimTotal = total.ClaimTotal + claim.Procedures[index].FeeTotal
						}
					}
					claim.ClaimTotal = total.ClaimTotal
					claim.InsuranceTotal = total.InsuranceTotal
					claim.PatientTotal = total.PatientTotal
				}
			}
		}
	}

	// Check if the claim already exists
	claimAsBytes, _ := stub.GetState(key)
	// claim does not exist, attempting creation
	if len(claimAsBytes) == 0 {
		claimAsBytes, err = json.Marshal(claim)
		if err != nil {
			return shim.Error(err.Error())
		}

		err = stub.PutState(key, claimAsBytes)
		if err != nil {
			return shim.Error(err.Error())
		}

		// Return nil, if claim is newly created
		return shim.Success(nil)
	}

	err = json.Unmarshal(claimAsBytes, &claim)
	if err != nil {
		return shim.Error(err.Error())
	}

	claimResponse := struct {
		ClaimID              string          `json:"claim_id"`
		PatientUID           string          `json:"patient_uid"`
		EnrollID             string          `json:"enroll_id"`
		MemberUID            string          `json:"member_uid"`
		BenefitID            string          `json:"benefit_id"`
		EmployeeID           string          `json:"employee_id"`
		Date                 string          `json:"date"`
		ProviderUID          string          `json:"provider_uid"`
		PhysicianName        string          `json:"physician_name"`
		PhysicianUID         string          `json:"physician_uid"`
		TreatmentDescription string          `json:"treatment_description"`
		Procedures           []procedureType `json:"procedures"`
		Status               ClaimStatus     `json:"status"`
		Comments             string          `json:"comments"`
		ClaimTotal           int32           `json:"claim_total"`
		InsuranceTotal       int32           `json:"insurance_total"`
		PatientTotal         int32           `json:"patient_total"`
	}{
		ClaimID:              claim.ClaimID,
		PatientUID:           claim.PatientUID,
		EnrollID:             claim.EnrollID,
		MemberUID:            claim.MemberUID,
		BenefitID:            claim.BenefitID,
		EmployeeID:           claim.EmployeeID,
		ProviderUID:          claim.ProviderUID,
		Date:                 claim.Date,
		PhysicianName:        claim.PhysicianName,
		PhysicianUID:         claim.PhysicianUID,
		TreatmentDescription: claim.TreatmentDescription,
		Procedures:           claim.Procedures,
		Status:               claim.Status,
		Comments:             claim.Comments,
		ClaimTotal:           claim.ClaimTotal,
		InsuranceTotal:       claim.InsuranceTotal,
		PatientTotal:         claim.PatientTotal,
	}

	claimResponseAsBytes, err := json.Marshal(claimResponse)
	if err != nil {
		return shim.Error(err.Error())
	}
	// Return the object of the already existing claim
	return shim.Success(claimResponseAsBytes)
}

func findClaimsHospital(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixClaims, []string{})
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
			*hce
		}{}
		err = json.Unmarshal(kvResult.Value, &ct)
		if err != nil {
			return shim.Error(err.Error())
		}

		results = append(results, ct)

	}
	returnBytes, err := json.Marshal(results)
	return shim.Success(returnBytes)
}

func findProviders(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixProvider, []string{})
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
			*provider
		}{}
		err = json.Unmarshal(kvResult.Value, &ct)
		if err != nil {
			return shim.Error(err.Error())
		}

		results = append(results, ct)

	}
	returnBytes, err := json.Marshal(results)
	return shim.Success(returnBytes)
}

func findPhysicians(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixPhysician, []string{})
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
			*physician
		}{}
		err = json.Unmarshal(kvResult.Value, &ct)
		if err != nil {
			return shim.Error(err.Error())
		}

		results = append(results, ct)

	}
	returnBytes, err := json.Marshal(results)
	return shim.Success(returnBytes)
}

func getCustomerAsMember(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	callingAsCustomer := len(args) == 1
	input := struct {
		MemberUID string `json:"member_uid"`
	}{}
	if callingAsCustomer {
		err := json.Unmarshal([]byte(args[0]), &input)
		if err != nil {
			return shim.Error(err.Error())
		}
	}

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixCustomer, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		kvResult, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		ct := struct {
			*customer
		}{}
		err = json.Unmarshal(kvResult.Value, &ct)
		if err != nil {
			return shim.Error(err.Error())
		}

		if !callingAsCustomer ||
			(input.MemberUID == ct.MemberUID) {
			responseBytes, err := json.Marshal(ct)
			if err != nil {
				return shim.Error(err.Error())
			}
			return shim.Success(responseBytes)
		}
	}
	return shim.Success(nil)
}

func getProcedures(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	callingAsCustomer := len(args) == 1
	input := struct {
		ProviderUID string `json:"provider_uid"`
	}{}
	if callingAsCustomer {
		err := json.Unmarshal([]byte(args[0]), &input)
		if err != nil {
			return shim.Error(err.Error())
		}
	}

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixClaims, []string{})
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
			*hce
		}{}
		err = json.Unmarshal(kvResult.Value, &ct)
		if err != nil {
			return shim.Error(err.Error())
		}
		if ct.Procedures != nil {
			for _, element := range ct.Procedures {
				if element.ProviderUID == input.ProviderUID {
					element.ClaimID = ct.ClaimID
					results = append(results, element)
				}
			}
		}

	}
	responseBytes, err := json.Marshal(results)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(responseBytes)
}

func updateProcedureStatus(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	req := struct {
		ClaimID      string          `json:"claim_id"`
		ProcedureUID string          `json:"procedure_uid"`
		Status       ProcedureStatus `json:"status"`
	}{}
	claim := hce{}

	err := json.Unmarshal([]byte(args[0]), &req)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixClaims, []string{req.ClaimID})
	if err != nil {
		return shim.Error(err.Error())
	}

	valAsBytes, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}
	if len(valAsBytes) == 0 {
		return shim.Error("Claim could not be found")
	}
	err = json.Unmarshal(valAsBytes, &claim)
	if err != nil {
		return shim.Error(err.Error())
	}
	if claim.Procedures != nil {
		for index, element := range claim.Procedures {
			if element.ProcedureUID == req.ProcedureUID {
				claim.Procedures[index].Status = req.Status
				valAsBytes, err = json.Marshal(claim)
				if err != nil {
					return shim.Error(err.Error())
				}
				err = stub.PutState(key, valAsBytes)
				if err != nil {
					return shim.Error(err.Error())
				}
				if req.Status == ProcedureStatusCompleted {
					enrollmentKey, err := stub.CreateCompositeKey(prefixEnrollment, []string{claim.EnrollID})
					if err != nil {
						return shim.Error(err.Error())
					}
					enrollmentBytes, _ := stub.GetState(enrollmentKey)
					enrollment := enrollmentType{}
					err = json.Unmarshal(enrollmentBytes, &enrollment)
					if err != nil {
						return shim.Error(err.Error())
					}
					enrollment.ClaimedAmount = enrollment.ClaimedAmount + element.InsuranceCoverage
					enrollment.RemainingCoverageAmount = enrollment.CoverageAmount - enrollment.ClaimedAmount
					if element.ComputeType == "IN" {
						enrollment.InHospitalSpent = enrollment.InHospitalSpent + element.InsuranceCoverage
					} else {
						enrollment.OutHospitalSpent = enrollment.OutHospitalSpent + element.InsuranceCoverage
					}
					enAsBytes, err := json.Marshal(enrollment)
					if err != nil {
						return shim.Error(err.Error())
					}
					err = stub.PutState(enrollmentKey, enAsBytes)
					if err != nil {
						return shim.Error(err.Error())
					}
					if !containsNewProcedure(claim.Procedures, ProcedureStatusNew) {
						claim.Status = ClaimStatusApproved
						valAsBytes, err = json.Marshal(claim)
						if err != nil {
							return shim.Error(err.Error())
						}
						err = stub.PutState(key, valAsBytes)
						if err != nil {
							return shim.Error(err.Error())
						}
					}
				} else if req.Status == ProcedureStatusDenied {
					claim.InsuranceTotal = claim.InsuranceTotal - element.InsuranceCoverage
					claim.ClaimTotal = claim.ClaimTotal - element.FeeTotal
					claim.PatientTotal = claim.PatientTotal - (element.FeeTotal - element.InsuranceCoverage)
					valAsBytes, err = json.Marshal(claim)
					if err != nil {
						return shim.Error(err.Error())
					}
					err = stub.PutState(key, valAsBytes)
					if err != nil {
						return shim.Error(err.Error())
					}
				}
				return shim.Success(nil)
			}
		}
	}

	return shim.Error("Error updating procedure")
}

func getPatient(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	input := struct {
		Ssn string `json:"ssn"`
	}{}
	err := json.Unmarshal([]byte(args[0]), &input)
	if err != nil {
		return shim.Error(err.Error())
	}
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixMember, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
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

		if input.Ssn == ct.Ssn {
			resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixCustomer, []string{})
			if err != nil {
				return shim.Error(err.Error())
			}
			defer resultsIterator.Close()
			for resultsIterator.HasNext() {
				kvResult, err := resultsIterator.Next()
				if err != nil {
					return shim.Error(err.Error())
				}
				cts := struct {
					*customer
				}{}
				err = json.Unmarshal(kvResult.Value, &cts)
				if err != nil {
					return shim.Error(err.Error())
				}
				if cts.MemberUID == "" {
					return shim.Error("Not Found")
				}
				if ct.MemberUID == cts.MemberUID {
					patientResponse := struct {
						PatientName  string `json:"patient_name"`
						PatientEmail string `json:"patient_email"`
						PatientUID   string `json:"patient_uid"`
						EmployeeID   string `json:"employee_id"`
						Ssn          string `json:"ssn"`
						Dob          string `json:"dob"`
						CompanyID    string `json:"company_id"`
						CompanyName  string `json:"company_name"`
						MemberUID    string `json:"member_uid"`
					}{}
					patientResponse.PatientName = cts.FirstName + " " + cts.LastName
					patientResponse.PatientEmail = cts.Email
					patientResponse.PatientUID = ct.PatientUID
					patientResponse.EmployeeID = ct.EmployeeID
					patientResponse.Ssn = ct.Ssn
					patientResponse.Dob = ct.Dob
					patientResponse.CompanyID = ct.CompanyID
					patientResponse.CompanyName = ct.CompanyName
					patientResponse.MemberUID = ct.MemberUID
					responseBytes, err := json.Marshal(patientResponse)
					if err != nil {
						return shim.Error(err.Error())
					}
					return shim.Success(responseBytes)
				}
			}
		}
	}
	return shim.Error("Not Found")
}
