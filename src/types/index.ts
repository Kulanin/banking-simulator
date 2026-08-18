export interface UserProps {
  id: string;
  name: string;
  email: string;
}

export interface AccountDetailsProps {
  id: number;
  accountNumber: string;
  accountName: string;
  balance: number;
  accountType: string;
  status: number;
  maturityDate?: Date;
}

export type FetchUserAccountsFn = () => Promise<void> | void;
export type UpdateUsersFn = (user: UserProps, add?: boolean)=> void; 