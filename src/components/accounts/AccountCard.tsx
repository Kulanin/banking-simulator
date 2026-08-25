import { memo } from "react";
import MoneyTranferForm from "../forms/MoneyTranferForm";
import BankStatementTable from "./BankStatementTable";
import WithdrawForm from "../forms/WithdrawForm";
import DepositForm from "../forms/DepositForm";
import type { AccountDetailsProps, FetchUserAccountsFn } from "../../types";

type AccountCardProps = {
  account: AccountDetailsProps;
  accounts: AccountDetailsProps[];
  fetchUserAccounts: FetchUserAccountsFn;
};

const AccountCard = ({
  account,
  accounts,
  fetchUserAccounts,
}: AccountCardProps) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4 w-full ">
      <p className="text-sm font-bold text-gray-900">
        {account.accountType} - {account.accountNumber}{" "}
        {account.accountName && `(${account.accountName})`}
      </p>
      <p className="text-sm text-gray-700">Balance: R {account.balance}</p>

      {account.maturityDate && (
        <p className="text-sm text-gray-600">
          Maturity Date: {account.maturityDate}
        </p>
      )}

      <div className="flex flex-wrap gap-3 mt-4">
        <DepositForm
          fetchUserAccounts={fetchUserAccounts}
          accountId={account.id}
        />

        {account?.accountType === "CHECKING" && account?.balance > 0 && (
          <WithdrawForm
            accounts={accounts}
            fetchUserAccounts={fetchUserAccounts}
            accountId={account.id}
          />
        )}

        {account?.balance > 0 && (
          <MoneyTranferForm
            accounts={accounts}
            fetchUserAccounts={fetchUserAccounts}
          />
        )}

      <BankStatementTable accountId={account.id} />
      </div>
    </div>
  );
};

export default memo(AccountCard);
