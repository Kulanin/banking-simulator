import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { DialogActions, TextField } from "@mui/material";
import { useNotification } from "../../context/NotificationProvider";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import useFetch from "../../customHooks/useFetch";
import type { FetchUserAccountsFn } from "../../types";
import AppButton from "../ui/AppButton";

type DepositFormProps = {
  accountId: number;
  fetchUserAccounts: FetchUserAccountsFn;
};

function DepositForm({ accountId, fetchUserAccounts }: DepositFormProps) {
  const [amount, setAmount] = useState("");
  const { showNotification } = useNotification();
  const [idempotencyKey, setIdepotencyKey] = useState("");
  const [error, setError] = useState(false);
  const { customFetchData, loading } = useFetch();
  const [open, setOpen] = useState(false); 

  const handleClose = () => {
 
    if (loading) return; 
    setOpen(false);
    setAmount("");
    setError(false);
  };

  useEffect(() => {
    const key = crypto.randomUUID();
    setIdepotencyKey(key);
  }, [open]);

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
      setOpen(false);
      setAmount("");
    } catch (error: any) {
      showNotification(error.message, "error");
    }
  };

  return (
    <>
      <AppButton onClick={() => setOpen(true)}>Deposit</AppButton>
      
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm" 
        sx={{
          "& .MuiDialog-container": { alignItems: "flex-start" },
          "& .MuiDialog-paper": { marginTop: "20px" },
        }}
      >
        <DialogTitle>Deposit Funds</DialogTitle>
        
        <form onSubmit={deposit}>
          <DialogContent>
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
              disabled={loading} 
            />
          </DialogContent>

          <DialogActions sx={{ padding: "16px 24px" }}>
           
            <AppButton 
              type="button" 
              onClick={handleClose} 
              variant="secondary"
              disabled={loading}
            >
              Cancel
            </AppButton>
            
            <AppButton
              disabled={loading || amount.trim() === ""}
              loading={loading}
              type="submit"
            >
              Deposit
            </AppButton>
          </DialogActions>
        </form>
      </Dialog>

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
