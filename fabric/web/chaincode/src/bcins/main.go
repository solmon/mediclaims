package main

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

const prefixCustomer = "customer"
const prefixInsurance = "insurance"
const prefixPhysician = "physician"
const prefixProvider = "provider"
const prefixMember = "corporate_member"
const prefixBenefit = "insurance_benfit"
const prefixClaims = "claims"
const prefixEnrollment = "insurance_enrollment"

var logger = shim.NewLogger("main")

// SmartContract contract
type SmartContract struct {
}

var bcFunctions = map[string]func(shim.ChaincodeStubInterface, []string) pb.Response{
	// Insurance Peer
	"member_get_info":   getMember,
	"create_insurance":  createInsurance,
	"auth_insurance":    authInsurance,
	"get_enrollment":    getEnrollment,
	"member_create":     createMember,
	"create_benefit":    createBenefit,
	"create_enrollment": createEnrollment,
	"get_benefit":       getBenefit,
	"add_provider":      addTrustedProvider,
	"check_provider":    checkTrustedProvider,
	"update_claim":      updateClaimStatus,
	"get_memebers":      getMemebers,
	"get_benefits":      getBenefits,
	"get_member_info":   getMember,
	"add_rule":          addRule,
	"get_rules":         getRules,

	// Customer Peer
	"customer_authenticate":     authCustomer,
	"customer_get_info":         getCustomer,
	"create_customer":           createCustomer,
	"link_customer":             linkCustomer,
	"find_member":               findMemberUID,
	"get_customer_plan_details": getCustomerPlanDetails,
	// Hospital Peer
	"find_enrollment":     findEnrollment,
	"create_physician":    createPhysician,
	"create_provider":     createProvider,
	"auth_physician":      authPhysician,
	"auth_provider":       authProvider,
	"find_benefit":        getBenefitHospital,
	"create_claims":       createClaimHospital,
	"get_claims_hospital": findClaimsHospital,
	"add_service":         addService,
	"get_services":        getServices,
	"get_providers":       findProviders,
	"get_physicians":      findPhysicians,
	"get_customer_member": getCustomerAsMember,
	"get_procedures":      getProcedures,
	"update_procedure":    updateProcedureStatus,
	"get_patient":         getPatient,
}

// Init callback representing the invocation of a chaincode
func (t *SmartContract) Init(stub shim.ChaincodeStubInterface) pb.Response {
	insurance := insurance{}
	insurance.InsuranceName = "Zigma Insurance Pvt. Ltd."
	insurance.InsuranceUID = GenerateUUID()
	insurance.Email = "admin@zigma.com"
	insurance.Password = "pwd123"
	insurance.Address = "RMZ Ecoworld, 8C, Bangalore - 560103"
	insurance.Providers = []string{}
	insuranceKey, _ := stub.CreateCompositeKey(prefixInsurance, []string{insurance.InsuranceUID})
	insuranceAsBytes, _ := stub.GetState(insuranceKey)
	insuranceAsBytes, _ = json.Marshal(insurance)
	stub.PutState(insuranceKey, insuranceAsBytes)
	provider := provider{}
	provider.ProviderUID = GenerateUUID()
	provider.Email = "admin@medicity.com"
	provider.Address = "Medicity Hospital, Bellandur, Bangalore - 560103"
	provider.Password = "pwd123"
	provider.Services = []serviceType{}
	provider.ProviderName = "Medicity Hospital"
	key, _ := stub.CreateCompositeKey(prefixProvider, []string{provider.ProviderUID})
	providerAsBytes, _ := stub.GetState(key)
	providerAsBytes, _ = json.Marshal(provider)
	stub.PutState(key, providerAsBytes)
	provider.ProviderUID = GenerateUUID()
	provider.Email = "admin@curecity.com"
	provider.Address = "Curecity Hospital, WhiteField, Bangalore - 560066"
	provider.Password = "pwd123"
	provider.Services = []serviceType{}
	provider.ProviderName = "Curecity Hospital"
	key, _ = stub.CreateCompositeKey(prefixProvider, []string{provider.ProviderUID})
	providerAsBytes, _ = stub.GetState(key)
	providerAsBytes, _ = json.Marshal(provider)
	stub.PutState(key, providerAsBytes)
	return shim.Success(nil)
}

// Invoke Function accept blockchain code invocations.
func (t *SmartContract) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
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

func contains(a []string, x string) bool {
	for _, n := range a {
		if x == n {
			return true
		}
	}
	return false
}

func containsService(a []serviceType, x string) bool {
	for _, n := range a {
		if x == n.ServiceCode {
			return true
		}
	}
	return false
}

func containsRule(a []ruleType, x string) bool {
	for _, n := range a {
		if x == n.RuleCode {
			return true
		}
	}
	return false
}

func containsNewProcedure(a []procedureType, x ProcedureStatus) bool {
	for _, n := range a {
		if x == n.Status {
			return true
		}
	}
	return false
}

func getRule(a []ruleType, x string) ruleType {
	for _, n := range a {
		if x == n.RuleCode {
			return n
		}
	}
	return ruleType{}
}

func uuidBytesToStr(uuid []byte) string {
	return fmt.Sprintf("%x-%x-%x-%x-%x", uuid[0:4], uuid[4:6], uuid[6:8], uuid[8:10], uuid[10:])
}

// GenerateBytesUUID returns a UUID based on RFC 4122 returning the generated bytes
func GenerateBytesUUID() []byte {
	uuid := make([]byte, 16)
	_, err := io.ReadFull(rand.Reader, uuid)
	if err != nil {
		panic(fmt.Sprintf("Error generating UUID: %s", err))
	}

	// variant bits; see section 4.1.1
	uuid[8] = uuid[8]&^0xc0 | 0x80

	// version 4 (pseudo-random); see section 4.1.3
	uuid[6] = uuid[6]&^0xf0 | 0x40

	return uuid
}

// GenerateUUID returns a UUID based on RFC 4122
func GenerateUUID() string {
	uuid := GenerateBytesUUID()
	return uuidBytesToStr(uuid)
}
