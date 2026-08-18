import { memo } from "react";
import AccountCard from "./AccountCard";
import type { AccountDetailsProps, FetchUserAccountsFn } from "../types";


type BankAccountListProps = {
  accounts: AccountDetailsProps[];
  fetchUserAccounts: FetchUserAccountsFn
};

const BankAccountList = ({
  accounts = [],
  fetchUserAccounts,
}: BankAccountListProps) => {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      {accounts.map((account) => {
        return (
          <AccountCard
            key={account.id}
            account={account}
            accounts={accounts}
            fetchUserAccounts={fetchUserAccounts}
          />
        );
      })}
    </div>
  );
};

export default memo(BankAccountList);
