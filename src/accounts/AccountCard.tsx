import { memo } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import GenericFormModal from "../forms/GenericFormModal";
import MoneyTranferForm from "../forms/MoneyTranferForm";
import BankStatementTable from "./BankStatementTable";
import WithdrawForm from "../forms/WithdrawForm";
import DepositForm from "../forms/DepositForm";
import type { AccountDetailsProps, FetchUserAccountsFn } from "../types";

type AccountCardProps = {
  account: AccountDetailsProps;
  accounts: AccountDetailsProps[];
  fetchUserAccounts: FetchUserAccountsFn
};
const AccountCard = ({
  account,
  accounts,
  fetchUserAccounts,
}: AccountCardProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {account.accountType} - {account.accountNumber}{" "}
          {account.accountName && `(${account.accountName})`}
        </Typography>
        <Typography variant="body2">Balance: R {account.balance}</Typography>

        {account.maturityDate && <>Maturity Date: </>}

        <div className="flex gap-4">
          <GenericFormModal
            openFormText="Deposit"
            dialogTitle="Deposit Funds"
            dialogContent={DepositForm}
            color="primary"
            dialogProps={{
              accounts: accounts,
              accountId: account.id,
              fetchUserAccounts: fetchUserAccounts,
            }}
          />
          {account?.accountType === "CHECKING" && account?.balance > 0 && (
            <GenericFormModal
              openFormText="Withdraw"
              dialogTitle="Withdraw Funds"
              dialogContent={WithdrawForm}
              color="success"
              dialogProps={{
                accounts: accounts,
                fetchUserAccounts: fetchUserAccounts,
                accountId: account.id,
              }}
            />
          )}
          {account?.balance > 0 && (
            <GenericFormModal
              color="secondary"
              openFormText="TRANSFER"
              dialogTitle="TRANSFER Funds"
              dialogContent={MoneyTranferForm}
              dialogProps={{
                accounts: accounts,
                fetchUserAccounts: fetchUserAccounts,
              }}
            />
          )}
          {account?.balance > 0 && (
            <GenericFormModal
              color="inherit"
              openFormText="View Statement"
              dialogTitle={`Account Statement - ${account.accountType} - ${account.accountNumber}`}
              dialogContent={BankStatementTable}
              modalMaxWidth="md"
              dialogProps={{
                accounts: accounts,
                fetchUserAccounts: fetchUserAccounts,
                accountId: account.id,
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(AccountCard);
