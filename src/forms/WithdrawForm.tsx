import React, { useEffect, useState, memo } from "react";
import { Button } from "@mui/material";
import { DialogActions, TextField } from "@mui/material";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { useNotification } from "../NotificationProvider";
import useFetch from "../customHooks/useFetch";
import type { AccountDetailsProps, FetchUserAccountsFn } from "../types";
type WithdrawFormProps = {
  accounts: AccountDetailsProps[];
  fetchUserAccounts: FetchUserAccountsFn;
  accountId: string;
};
function WithdrawForm({ fetchUserAccounts, accountId }: WithdrawFormProps) {
  const [amount, setAmount] = useState("");
  const { showNotification } = useNotification();
  const [idempotencyKey, setIdepotencyKey] = useState("");
  const [error, setError] = useState(false);

  const { customFetchData: withdrawFetch, loading } = useFetch();

  useEffect(() => {
    const key = crypto.randomUUID();
    setIdepotencyKey(key);
  }, []);

  const withDraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!amount.trim()) {
      setError(true);
      return;
    }
    try {
      const data = await withdrawFetch(
        `api/v1/accounts/${accountId}/withdraw`,
        {
          method: "POST",
          querydata: { amount, actionType: "withdraw" },
          idempotencyKey
        },
        true,
      );
      showNotification(data.message);
      fetchUserAccounts();
    } catch (error: any) {
      showNotification(error.message, "error");
    }
  };

  return (
    <>
      <form onSubmit={withDraw}>
        <TextField
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          label="Amount"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          error={error}
          type="number"
          helperText={error ? "Amount is required" : undefined}
        />

        <DialogActions sx={{ mt: 2 }}>
          <Button>Cancel</Button>
          <Button
            loading={loading}
            disabled={loading || amount.trim() === ""}
            type="submit"
            variant="contained"
            size="small"
            sx={{ fontSize: "0.75rem", padding: "4px 8px" }}
          >
            Withdraw
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

export default memo(WithdrawForm);
