import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { DialogActions, TextField } from "@mui/material";
import { useNotification } from "../NotificationProvider";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import useFetch from "../customHooks/useFetch";
import type { FetchUserAccountsFn } from "../types";


type WithdrawFormProps = {
  accountId: string;
  fetchUserAccounts: FetchUserAccountsFn;
};
function DepositForm({ accountId, fetchUserAccounts }: WithdrawFormProps) {
  const [amount, setAmount] = useState("");
  const { showNotification } = useNotification();
  const [idempotencyKey, setIdepotencyKey] = useState("");
  const [error, setError] = useState(false);
  const { customFetchData, loading } = useFetch();
  useEffect(() => {
    const key = crypto.randomUUID();
    setIdepotencyKey(key);
  }, []);

  const deposit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount.trim()) {
      setError(true);
      return;
    }
    try {
      const data = await customFetchData(
        `/api/v1/accounts/${accountId}/deposit`,
        {
          method: "POST",
          idempotencyKey,
          querydata: { amount, actionType: "deposit", idempotencyKey },
        },
        true,
      );
      fetchUserAccounts();
      showNotification(data.message);
    } catch (error: any) {
      showNotification(error.message, "error");
    }
  };

  return (
    <>
      <form onSubmit={deposit}>
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
          >
            Deposit
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

export default DepositForm;
