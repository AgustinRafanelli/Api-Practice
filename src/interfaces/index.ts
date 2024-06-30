interface Currency {
  name: string;
  identifier: string;
}

interface Account {
  currency: Currency;
  amount?: number;
}

interface Transaction {
  alias?: string;
  amount: number;
  cbu?: string;
  currency: Currency;
  date?: Date;
}

interface User {
  name: string;
  surname: string;
  dni: string;
  clientId?: number;
  pin: number;
  cbu?: string;
  password: string;
  alias: string;
  accounts: Account[];
  transactions: Transaction[];
}

export { User, Account, Transaction, Currency };
