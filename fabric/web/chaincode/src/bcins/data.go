package main

import (
	"encoding/json"
	"strings"
)

//Customer

// Key consists of email + googleUID
type customer struct {
	GoogleUID  string `json:"google_uid"`
	PatientUID string `json:"patient_uid"`
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	Email      string `json:"email"`
	MemberUID  string `json:"member_uid"`
}

type provider struct {
	ProviderUID  string        `json:"provider_uid"`
	ProviderName string        `json:"provider_name"`
	Address      string        `json:"address"`
	Email        string        `json:"email"`
	Password     string        `json:"password"`
	Services     []serviceType `json:"services"`
}

type insurance struct {
	InsuranceUID  string   `json:"insurance_uid"`
	InsuranceName string   `json:"insurance_name"`
	Address       string   `json:"address"`
	Providers     []string `json:"providers"`
	Email         string   `json:"email"`
	Password      string   `json:"password"`
}

type physician struct {
	PhysicianUID string `json:"physician_uid"`
	ProviderUID  string `json:"provider_uid"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	Email        string `json:"email"`
	Password     string `json:"password"`
}

// Key consists of prefix + BenefitID
type benefitType struct {
	BenefitID      string     `json:"benefit_id"`
	BenefitTitle   string     `json:"benefit_title"`
	PayerID        string     `json:"payer_id"`
	PayerTitle     string     `json:"payer_title"`
	TypeOfBenefit  string     `json:"type_of_benefit"`
	CoverageAmount int32      `json:"coverage_amount"`
	MonthlyPremium int32      `json:"monthly_premium"`
	Rules          []ruleType `json:"rules"`
}

type ruleType struct {
	RuleUID        string `json:"rule_uid"`
	RuleCode       string `json:"rule_code"`
	CoverageAmount int32  `json:"coverage_amount"`
	InCoverage     int32  `json:"in_coverage"`
	OutCoverage    int32  `json:"out_coverage"`
}

type memberType struct {
	MemberUID   string `json:"member_uid"`
	PatientUID  string `json:"patient_uid"`
	EmployeeID  string `json:"employee_id"`
	Ssn         string `json:"ssn"`
	Dob         string `json:"dob"`
	CompanyID   string `json:"company_id"`
	CompanyName string `json:"company_name"`
}

type enrollmentType struct {
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
}

type hce struct {
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
}

type procedureType struct {
	ClaimID             string          `json:"claim_id,omitempty"`
	ProcedureUID        string          `json:"procedure_uid"`
	ProcedureCode       string          `json:"procedure_code"`
	DateFrom            string          `json:"date_from"`
	DateTo              string          `json:"date_to"`
	ProviderUID         string          `json:"provider_uid"`
	ProcedureTitle      string          `json:"procedure_title"`
	InsuranceCoverage   int32           `json:"insurance_coverage"`
	InsurancePercantage int32           `json:"insurance_percentage"`
	PayerPercantage     int32           `json:"payer_percentage"`
	FeeTotal            int32           `json:"fee_total"`
	Status              ProcedureStatus `json:"status"`
	ComputeType         string          `json:"compute_type"`
}

type serviceType struct {
	ServiceUID   string `json:"service_uid"`
	ServiceCode  string `json:"service_code"`
	ServiceTitle string `json:"service_title"`
	FeeTotal     int32  `json:"fee_total"`
}

// ClaimStatus indicates how the claim should be treated
type ClaimStatus int8

const (
	// ClaimStatusUnknown is unknown
	ClaimStatusUnknown ClaimStatus = iota
	// ClaimStatusNew new
	ClaimStatusNew
	// ClaimStatusRejected rejected by the insurer
	ClaimStatusRejected
	// ClaimStatusApproved approved by the insurer
	ClaimStatusApproved
)

// UnmarshalJSON json
func (s *ClaimStatus) UnmarshalJSON(b []byte) error {
	var value string
	if err := json.Unmarshal(b, &value); err != nil {
		return err
	}

	switch strings.ToUpper(value) {
	default:
		*s = ClaimStatusUnknown
	case "N":
		*s = ClaimStatusNew
	case "R":
		*s = ClaimStatusRejected
	case "A":
		*s = ClaimStatusApproved
	}

	return nil
}

// MarshalJSON json
func (s ClaimStatus) MarshalJSON() ([]byte, error) {
	var value string

	switch s {
	default:
		fallthrough
	case ClaimStatusUnknown:
		value = ""
	case ClaimStatusNew:
		value = "N"
	case ClaimStatusRejected:
		value = "R"
	case ClaimStatusApproved:
		value = "A"
	}

	return json.Marshal(value)
}

// ProcedureStatus indicates how the claim should be treated
type ProcedureStatus int8

const (
	// ProcedureStatusUnknown is unknown
	ProcedureStatusUnknown ProcedureStatus = iota
	// ProcedureStatusNew new
	ProcedureStatusNew
	// ProcedureStatusCompleted completed by the user
	ProcedureStatusCompleted
	// ProcedureStatusDenied denied by the user
	ProcedureStatusDenied
)

// UnmarshalJSON json
func (s *ProcedureStatus) UnmarshalJSON(b []byte) error {
	var value string
	if err := json.Unmarshal(b, &value); err != nil {
		return err
	}

	switch strings.ToUpper(value) {
	default:
		*s = ProcedureStatusUnknown
	case "N":
		*s = ProcedureStatusNew
	case "C":
		*s = ProcedureStatusCompleted
	case "D":
		*s = ProcedureStatusDenied
	}

	return nil
}

// MarshalJSON json
func (s ProcedureStatus) MarshalJSON() ([]byte, error) {
	var value string

	switch s {
	default:
		fallthrough
	case ProcedureStatusUnknown:
		value = ""
	case ProcedureStatusNew:
		value = "N"
	case ProcedureStatusCompleted:
		value = "C"
	case ProcedureStatusDenied:
		value = "D"
	}

	return json.Marshal(value)
}
