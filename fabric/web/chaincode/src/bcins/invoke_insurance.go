package main

import (
	"fmt"

	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

func createInsurance(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	insurance := insurance{}
	err := json.Unmarshal([]byte(args[0]), &insurance)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixInsurance, []string{insurance.InsuranceUID})
	if err != nil {
		return shim.Error(err.Error())
	}

	// Check if the insurance already exists
	insuranceAsBytes, _ := stub.GetState(key)
	// insurance does not exist, attempting creation
	if len(insuranceAsBytes) == 0 {
		insuranceAsBytes, err = json.Marshal(insurance)
		if err != nil {
			return shim.Error(err.Error())
		}

		err = stub.PutState(key, insuranceAsBytes)
		if err != nil {
			return shim.Error(err.Error())
		}

		// Return nil, if insurance is newly created
		return shim.Success(nil)
	}

	err = json.Unmarshal(insuranceAsBytes, &insurance)
	if err != nil {
		return shim.Error(err.Error())
	}

	insuranceResponse := struct {
		InsuranceUID  string   `json:"insurance_uid"`
		InsuranceName string   `json:"insurance_name"`
		Address       string   `json:"address"`
		Providers     []string `json:"providers,omitempty"`
		Email         string   `json:"email"`
		Password      string   `json:"password"`
	}{
		InsuranceUID:  insurance.InsuranceUID,
		InsuranceName: insurance.InsuranceName,
		Address:       insurance.Address,
		Providers:     insurance.Providers,
		Email:         insurance.Email,
		Password:      insurance.Password,
	}

	insuranceResponseAsBytes, err := json.Marshal(insuranceResponse)
	if err != nil {
		return shim.Error(err.Error())
	}
	// Return the object of the already existing insurance
	return shim.Success(insuranceResponseAsBytes)
}

func authInsurance(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	input := struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}{}
	insuranceResponse := struct {
		InsuranceUID  string   `json:"insurance_uid,omitempty"`
		InsuranceName string   `json:"insurance_name,omitempty"`
		Address       string   `json:"address,omitempty"`
		Providers     []string `json:"providers,omitempty"`
		Email         string   `json:"email,omitempty"`
		Authenticated bool     `json:"authenticated,omitempty"`
	}{}
	err := json.Unmarshal([]byte(args[0]), &input)
	if err != nil {
		return shim.Error(err.Error())
	}

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixInsurance, []string{})
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
			*insurance
		}{}
		err = json.Unmarshal(kvResult.Value, &ct)
		if err != nil {
			return shim.Error(err.Error())
		}

		if (input.Email == ct.Email) && (input.Password == ct.Password) {
			insuranceResponse.Address = ct.Address
			insuranceResponse.Email = ct.Email
			insuranceResponse.InsuranceUID = ct.InsuranceUID
			insuranceResponse.InsuranceName = ct.InsuranceName
			insuranceResponse.Providers = ct.Providers
			insuranceResponse.Authenticated = true
			break
		} else {
			insuranceResponse.Authenticated = false
		}
	}

	authBytes, _ := json.Marshal(insuranceResponse)
	return shim.Success(authBytes)
}

func addTrustedProvider(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	input := struct {
		InsuranceUID string `json:"insurance_uid"`
		ProviderUID  string `json:"provider_uid"`
	}{}
	err := json.Unmarshal([]byte(args[0]), &input)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixInsurance, []string{input.InsuranceUID})
	if err != nil {
		return shim.Error(err.Error())
	}

	insurance := insurance{}
	insuranceAsBytes, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}
	if len(insuranceAsBytes) == 0 {
		return shim.Error("Insurance could not be found")
	}
	err = json.Unmarshal(insuranceAsBytes, &insurance)
	if err != nil {
		return shim.Error(err.Error())
	}

	if insurance.Providers == nil {
		insurance.Providers = []string{}
		insurance.Providers = append(insurance.Providers, input.ProviderUID)
	} else {
		if contains(insurance.Providers, input.ProviderUID) {
			return shim.Success(nil)
		}
		insurance.Providers = append(insurance.Providers, input.ProviderUID)
	}

	insuranceAsBytes, err = json.Marshal(insurance)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(key, insuranceAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}

func checkTrustedProvider(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	input := struct {
		InsuranceUID string `json:"insurance_uid"`
		ProviderUID  string `json:"provider_uid"`
	}{}
	err := json.Unmarshal([]byte(args[0]), &input)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixInsurance, []string{input.InsuranceUID})
	if err != nil {
		return shim.Error(err.Error())
	}

	isPresent := false
	insurance := insurance{}
	insuranceAsBytes, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}
	if len(insuranceAsBytes) == 0 {
		return shim.Error("Insurance could not be found")
	}
	err = json.Unmarshal(insuranceAsBytes, &insurance)
	if err != nil {
		return shim.Error(err.Error())
	}

	if insurance.Providers == nil {
		isPresent = false
	} else {
		if contains(insurance.Providers, input.ProviderUID) {
			isPresent = true
		}
	}

	presentBytes, _ := json.Marshal(isPresent)
	return shim.Success(presentBytes)
}

func getMember(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	input := struct {
		MemberUID string `json:"member_uid"`
	}{}
	if len(args) == 1 {
		err := json.Unmarshal([]byte(args[0]), &input)
		if err != nil {
			return shim.Error(err.Error())
		}
	}
	memberKey, err := stub.CreateCompositeKey(prefixMember, []string{input.MemberUID})
	if err != nil {
		return shim.Error(err.Error())
	}
	memberBytes, _ := stub.GetState(memberKey)
	member := memberType{}
	err = json.Unmarshal(memberBytes, &member)
	if err != nil {
		return shim.Error(err.Error())
	}
	response := struct {
		MemberUID   string `json:"member_uid"`
		PatientUID  string `json:"patient_uid"`
		EmployeeID  string `json:"employee_id"`
		Ssn         string `json:"ssn"`
		Dob         string `json:"dob"`
		CompanyID   string `json:"company_id"`
		CompanyName string `json:"company_name"`
	}{
		MemberUID:   member.MemberUID,
		PatientUID:  member.PatientUID,
		EmployeeID:  member.EmployeeID,
		Ssn:         member.Ssn,
		Dob:         member.Dob,
		CompanyID:   member.CompanyID,
		CompanyName: member.CompanyName,
	}
	responseBytes, err := json.Marshal(response)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(responseBytes)
}

func getBenefit(stub shim.ChaincodeStubInterface, args []string) pb.Response {
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

func getEnrollment(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	input := struct {
		EnrollID string `json:"enroll_id"`
	}{}
	if len(args) == 1 {
		err := json.Unmarshal([]byte(args[0]), &input)
		if err != nil {
			return shim.Error(err.Error())
		}
	}
	enrollmentKey, err := stub.CreateCompositeKey(prefixEnrollment, []string{input.EnrollID})
	if err != nil {
		return shim.Error(err.Error())
	}
	enrollmentBytes, _ := stub.GetState(enrollmentKey)
	enrollment := enrollmentType{}
	err = json.Unmarshal(enrollmentBytes, &enrollment)
	if err != nil {
		return shim.Error(err.Error())
	}
	response := struct {
		EnrollID                string   `json:"enroll_id"`
		MemberUID               string   `json:"member_uid"`
		PatientUID              string   `json:"patient_uid"`
		BenefitID               string   `json:"benefit_id"`
		EmployeeID              string   `json:"employee_id"`
		Ssn                     string   `json:"ssn"`
		StartDate               string   `json:"start_date"`
		EndDate                 string   `json:"end_date"`
		CoverageAmount          int32    `json:"coverage_amount"`
		ClaimedAmount           int32    `json:"claimed_amount"`
		RemainingCoverageAmount int32    `json:"remaining_coverage_amount"`
		InHospitalSpent         int32    `json:"in_hospital_spent"`
		OutHospitalSpent        int32    `json:"out_hospital_spent"`
		ClaimIndex              []string `json:"claim_index,omitempty"`
	}{
		EnrollID:                enrollment.EnrollID,
		MemberUID:               enrollment.MemberUID,
		PatientUID:              enrollment.PatientUID,
		BenefitID:               enrollment.BenefitID,
		EmployeeID:              enrollment.EmployeeID,
		Ssn:                     enrollment.Ssn,
		StartDate:               enrollment.StartDate,
		EndDate:                 enrollment.EndDate,
		CoverageAmount:          enrollment.CoverageAmount,
		RemainingCoverageAmount: enrollment.RemainingCoverageAmount,
		InHospitalSpent:         enrollment.InHospitalSpent,
		OutHospitalSpent:        enrollment.OutHospitalSpent,
		ClaimIndex:              enrollment.ClaimIndex,
	}
	responseBytes, err := json.Marshal(response)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(responseBytes)
}

func createMember(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	member := memberType{}
	err := json.Unmarshal([]byte(args[0]), &member)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixMember, []string{member.MemberUID})
	if err != nil {
		return shim.Error(err.Error())
	}

	// Check if the member already exists
	memberAsBytes, _ := stub.GetState(key)
	// Member does not exist, attempting creation
	if len(memberAsBytes) == 0 {
		memberAsBytes, err = json.Marshal(member)
		if err != nil {
			return shim.Error(err.Error())
		}

		err = stub.PutState(key, memberAsBytes)
		if err != nil {
			return shim.Error(err.Error())
		}

		// Return nil, if member is newly created
		return shim.Success(nil)
	}

	err = json.Unmarshal(memberAsBytes, &member)
	if err != nil {
		return shim.Error(err.Error())
	}
	memberResponse := struct {
		MemberUID   string `json:"member_uid"`
		PatientUID  string `json:"patient_uid"`
		EmployeeID  string `json:"employee_id"`
		Ssn         string `json:"ssn"`
		Dob         string `json:"dob"`
		CompanyID   string `json:"company_id"`
		CompanyName string `json:"company_name"`
	}{
		MemberUID:   member.MemberUID,
		PatientUID:  member.PatientUID,
		EmployeeID:  member.EmployeeID,
		Ssn:         member.Ssn,
		Dob:         member.Dob,
		CompanyID:   member.CompanyID,
		CompanyName: member.CompanyName,
	}

	memberResponseAsBytes, err := json.Marshal(memberResponse)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(memberResponseAsBytes)

}

func createBenefit(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	benefit := benefitType{}
	err := json.Unmarshal([]byte(args[0]), &benefit)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixBenefit, []string{benefit.BenefitID})
	if err != nil {
		return shim.Error(err.Error())
	}

	// Check if the benefit already exists
	benefitAsBytes, _ := stub.GetState(key)
	// Benefit does not exist, attempting creation
	if len(benefitAsBytes) == 0 {
		benefitAsBytes, err = json.Marshal(benefit)
		if err != nil {
			return shim.Error(err.Error())
		}

		err = stub.PutState(key, benefitAsBytes)
		if err != nil {
			return shim.Error(err.Error())
		}

		// Return nil, if benefit is newly created
		return shim.Success(nil)
	}

	err = json.Unmarshal(benefitAsBytes, &benefit)
	if err != nil {
		return shim.Error(err.Error())
	}

	benefitResponse := struct {
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

	benefitResponseAsBytes, err := json.Marshal(benefitResponse)
	if err != nil {
		return shim.Error(err.Error())
	}
	// Return the object of the already existing benefit
	return shim.Success(benefitResponseAsBytes)
}

func createEnrollment(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	enrollment := enrollmentType{}
	err := json.Unmarshal([]byte(args[0]), &enrollment)
	if err != nil {
		return shim.Error(err.Error())
	}

	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixMember, []string{})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	check := false
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

		if enrollment.EmployeeID == ct.EmployeeID && enrollment.Ssn == ct.Ssn {
			enrollment.MemberUID = ct.MemberUID
			check = true
		}
	}
	if check == false {
		return shim.Error("Member not found!")
	}
	key, err := stub.CreateCompositeKey(prefixEnrollment, []string{enrollment.EnrollID})
	if err != nil {
		return shim.Error(err.Error())
	}

	// Check if the enrollment already exists
	enrollmentAsBytes, _ := stub.GetState(key)
	// Enrollment does not exist, attempting creation
	if len(enrollmentAsBytes) == 0 {
		enrollmentAsBytes, err = json.Marshal(enrollment)
		if err != nil {
			return shim.Error(err.Error())
		}

		err = stub.PutState(key, enrollmentAsBytes)
		if err != nil {
			return shim.Error(err.Error())
		}

		// Return nil, if enrollment is newly created
		return shim.Success(nil)
	}

	err = json.Unmarshal(enrollmentAsBytes, &enrollment)
	if err != nil {
		return shim.Error(err.Error())
	}

	enrollmentResponse := struct {
		EnrollID                string   `json:"enroll_id"`
		MemberUID               string   `json:"member_uid"`
		PatientUID              string   `json:"patient_uid"`
		BenefitID               string   `json:"benefit_id"`
		EmployeeID              string   `json:"employee_id"`
		Ssn                     string   `json:"ssn"`
		StartDate               string   `json:"start_date"`
		EndDate                 string   `json:"end_date"`
		CoverageAmount          int32    `json:"coverage_amount"`
		ClaimedAmount           int32    `json:"claimed_amount"`
		RemainingCoverageAmount int32    `json:"remaining_coverage_amount"`
		InHospitalSpent         int32    `json:"in_hospital_spent"`
		OutHospitalSpent        int32    `json:"out_hospital_spent"`
		ClaimIndex              []string `json:"claim_index,omitempty"`
	}{
		EnrollID:                enrollment.EnrollID,
		MemberUID:               enrollment.MemberUID,
		PatientUID:              enrollment.PatientUID,
		BenefitID:               enrollment.BenefitID,
		EmployeeID:              enrollment.EmployeeID,
		Ssn:                     enrollment.Ssn,
		StartDate:               enrollment.StartDate,
		EndDate:                 enrollment.EndDate,
		CoverageAmount:          enrollment.CoverageAmount,
		RemainingCoverageAmount: enrollment.RemainingCoverageAmount,
		InHospitalSpent:         enrollment.InHospitalSpent,
		OutHospitalSpent:        enrollment.OutHospitalSpent,
		ClaimIndex:              enrollment.ClaimIndex,
	}

	enrollmentResponseAsBytes, err := json.Marshal(enrollmentResponse)
	if err != nil {
		return shim.Error(err.Error())
	}
	// Return the object of the already existing enrollment
	return shim.Success(enrollmentResponseAsBytes)
}

func updateClaimStatus(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	req := struct {
		ClaimID string      `json:"claim_id"`
		Status  ClaimStatus `json:"status"`
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

	claim.Status = req.Status // Assigning requested status

	valAsBytes, err = json.Marshal(claim)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(key, valAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

func getBenefits(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	resultsIterator, err := stub.GetStateByPartialCompositeKey(prefixBenefit, []string{})
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
			*benefitType
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

func getMemebers(stub shim.ChaincodeStubInterface, args []string) pb.Response {
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

		results = append(results, ct)
	}

	returnBytes, err := json.Marshal(results)
	return shim.Success(returnBytes)
}

func findMember(stub shim.ChaincodeStubInterface, args []string) pb.Response {
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

func addRule(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	input := struct {
		BenefitID string   `json:"benefit_id"`
		Rule      ruleType `json:"rule"`
	}{}
	if len(args) == 1 {
		err := json.Unmarshal([]byte(args[0]), &input)
		if err != nil {
			return shim.Error(err.Error())
		}
	}

	err := json.Unmarshal([]byte(args[0]), &input)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixBenefit, []string{input.BenefitID})
	if err != nil {
		return shim.Error(err.Error())
	}

	benefitVal := benefitType{}
	benefitAsBytes, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}
	if len(benefitAsBytes) == 0 {
		return shim.Error("Benefit could not be found")
	}
	err = json.Unmarshal(benefitAsBytes, &benefitVal)
	if err != nil {
		return shim.Error(err.Error())
	}

	if benefitVal.Rules == nil {
		benefitVal.Rules = []ruleType{}
		benefitVal.Rules = append(benefitVal.Rules, input.Rule)
	} else {
		if containsRule(benefitVal.Rules, input.Rule.RuleCode) {
			return shim.Success(nil)
		}
		benefitVal.Rules = append(benefitVal.Rules, input.Rule)
	}

	fmt.Printf("%+v\n", benefitVal)

	benefitAsBytes, err = json.Marshal(benefitVal)
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(key, benefitAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}

func getRules(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	input := struct {
		BenefitID string `json:"benefit_id"`
	}{}
	err := json.Unmarshal([]byte(args[0]), &input)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixBenefit, []string{input.BenefitID})
	if err != nil {
		return shim.Error(err.Error())
	}

	benefit := benefitType{}
	benefitAsBytes, err := stub.GetState(key)
	if err != nil {
		return shim.Error(err.Error())
	}
	if len(benefitAsBytes) == 0 {
		return shim.Error("Benefit could not be found")
	}
	err = json.Unmarshal(benefitAsBytes, &benefit)
	if err != nil {
		return shim.Error(err.Error())
	}

	if benefit.Rules == nil {
		return shim.Success(nil)
	}

	serviceBytes, _ := json.Marshal(benefit.Rules)
	return shim.Success(serviceBytes)
}
