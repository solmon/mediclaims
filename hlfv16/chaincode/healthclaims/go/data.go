package main

import "time"

type BenefitType struct {
	BenefitTypeCode string `json:"benefittype_code"`
	Description     string `json:"description"`
	Active          bool   `json:"active"`
}

type Insurer struct {
	InsurerCode string `json:"insurer_code"`
	Description string `json:"description"`
	Active      bool   `json:"active"`
}

type Provider struct {
	ProviderCode string `json:"provider_code"`
	Description  string `json:"description"`
	Active       bool   `json:"active"`
	InNetwork    bool   `json:"in_network"`
}

//HLTH OVER 65yrs, HLTH0001

type Benefit struct {
	BenefitUUID     string    `json:"benefit_uuid"`
	InsurerCode     string    `json:"insurer_code"`
	BenefitTypeCode string    `json:"benefittype_code"`
	Description     string    `json:"description"`
	Active          bool      `json:"active"`
	StartDate       time.Time `json:"start_date"`
	EndDate         time.Time `json:"end_date"`
}

type UserProfile struct {
	UserID               string   `json:"user_id"`
	UserInsuranceID      string   `json:"user_insurance_id"`
	BenefitContractUUIds []string `json:"benefit_contract_uuids"`
}

type BenefitContract struct {
	BenefitContractUUID string    `json:"benefit_contract_uuid"`
	BenefitUUID         string    `json:"benefit_uuid"`
	CompanyName         string    `json:"company_name"`
	CustomerName        string    `json:"customer_name"`
	SSN                 string    `json:"ssn"`
	Gender              string    `json:"gender"`
	DOB                 string    `json:"dob"`
	Active              bool      `json:"active"`
	StartDate           time.Time `json:"start_date"`
	EndDate             time.Time `json:"end_date"`
	CoverageAmount      float64   `json:"coverage_amount"`
	ClaimedAmount       float64   `json:"claimed_amount"`
	Claims              []string  `json:"claims"`
}

type Claim struct {
	ClaimUUID           string                 `json:"claim_uuid"`
	BenefitContractUUID string                 `json:"benefit_contract_uuid"`
	ProviderID          string                 `json:"provider_id"`
	LineItems           []ProcedureInvoiceItem `json:"line_items"`
	ClaimStatus         ClaimStatus            `json:"claim_status"`
	SupportDocumentIDs  []string               `json:"support_documentids"`
}

type SupportDocument struct {
	DocumentID   string `json:"document_id"`
	DocType      string `json:"doc_type"`
	DocumentName string `json:"document_name"`
}

type ProcedureInvoiceItem struct {
	LineNumber      int       `json:"line_number"`
	ProcedureCode   string    `json:"procedure_code"`
	ProcedureDate   time.Time `json:"procedure_date"`
	ICDCode         string    `json:"icd_code"`
	Cost            float64   `json:"cost"`
	Description     string    `json:"description"`
	PayableApproved float64   `json:"payable_approved"`
	PayerComment    string    `json:"payer_comment"`
}

type ClaimStatus int8

const (
	ClaimStatusUnknown ClaimStatus = iota
	ClaimStatusNew
	ClaimStatusRejected
	ClaimStatusReimbursement
)
