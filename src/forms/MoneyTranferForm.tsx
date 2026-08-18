import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DialogActions, TextField } from "@mui/material";
import { useNotification } from "../NotificationProvider";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import useFetch from "../customHooks/useFetch";
import type { AccountDetailsProps, FetchUserAccountsFn } from "../types";

type MoneyTranferFormProps = {
  accounts: AccountDetailsProps[];
  fetchUserAccounts: FetchUserAccountsFn;
};
function MoneyTranferForm({
  accounts,
  fetchUserAccounts,
}: MoneyTranferFormProps) {
  const [fromAccount, setFromAccount] = useState("");
  const [targetAccountId, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const { showNotification } = useNotification();
  const [idempotencyKey, setIdepotencyKey] = useState("");
  const { customFetchData: transferFundsFetch, loading } = useFetch();
  useEffect(() => {
    const key = crypto.randomUUID();
    setIdepotencyKey(key);
  }, []);

  const tranferFunds = async (value: any) => {
    try {

      const data = await transferFundsFetch(
        `/api/v1/accounts/${fromAccount}/transfer`,
        { method: "POST", idempotencyKey, querydata: value },
        true,
      );
      fetchUserAccounts();
      showNotification(data.message);
    } catch (error: any) {
      showNotification(error.message, "error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    tranferFunds?.({
      fromAccount,
      targetAccountId,
      amount,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>From Account</InputLabel>
          <Select
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
          >
            {accounts?.map((account: any) => {
              return (
                <MenuItem
                  value={account.id}
                >{`${account.accountType} - ${account.accountName}`}</MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>To Account</InputLabel>
          <Select
            value={targetAccountId}
            onChange={(e) => setToAccount(e.target.value)}
          >
            {accounts?.map((account: any) => {
              return (
                <MenuItem
                  value={account.id}
                >{`${account.accountType} - ${account.accountName}`}</MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <TextField
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          label="Amount"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          type="number"
        />

        <DialogActions sx={{ mt: 2 }}>
          <Button>Cancel</Button>
          <Button
            loading={loading}
            disabled={
              loading ||
              amount.trim() === "" ||
              fromAccount === "" ||
              targetAccountId === ""
            }
            type="submit"
            variant="contained"
            size="small"
          >
            TRANSFER
          </Button>
        </DialogActions>
      </form>

      <Backdrop
        open={loading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <div style={{ textAlign: "center" }}>
          <CircularProgress color="inherit" />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Transaction in progress… Please do not close this form.
          </Typography>
        </div>
      </Backdrop>
    </>
  );
}

export default MoneyTranferForm;
