    export class Transaction {
        type: string;
        timestamp: string;
    }

    export class Block {
        id: string;
        fingerprint: string;
        transactions: Transaction[];
    }