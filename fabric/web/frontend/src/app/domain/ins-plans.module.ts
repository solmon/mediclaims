export class InsurancePlan {
    constructor(
        public treatmentDescription: string,
        public claimId: string,
        public enrollId: string,
        public memberUid: string,
        public benefitId: string,
        public employeeId: string,
        public date: string,
        public physicianName: string,
        public procedures: any[],
        public comments: string,
        public claimTotal: number,
        public in_network: boolean,
        public status: string
    ) { }

    static CreateDefault(): InsurancePlan {
        return new InsurancePlan('', '', '', '', '', '', '', '', [], '', 0, true, 'new');
    }
}

export class Provpatdetails {
    providerid: string;
    providername: string;
    address: string;
    patientid: string;
    patientname: string;
    from: string;
    to: string;
}

export class Treatmentdetail {
    id: string;
    desc: string;
}

export class Diagtreatment {
    physician: string;
    diagnosis: string;
    treatmentdetails: Treatmentdetail[];
}

export class Billinsurance {
    ln: string;
    datefrom: string;
    dateto: string;
    provider: string;
    icdcode: string;
    diagnosis: string;
    fee: string;
    approve: boolean;
}

export class Claim {
    date: string;
    type: string;
    status: string;
    age: string;
    provpatdetails: Provpatdetails;
    diagtreatment: Diagtreatment;
    billinsurance: Billinsurance[];
}

export class ClaimDetails {
    planid: string;
    insuranceid: string;
    planname: string;
    patientname: string;
    dob: string;
    ssn: string;
    copay: string;
    groupplan: string;
    groupnumber: string;
    empid: string;
    address: string;
    claim: Claim;
    totalcoverage: string;
    claimed: string;
    remaining: string;
}


