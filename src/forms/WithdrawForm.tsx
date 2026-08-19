import React, { useEffect, useState, memo } from "react";
import { DialogActions, TextField } from "@mui/material";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { useNotification } from "../NotificationProvider";
import useFetch from "../customHooks/useFetch";
import type { AccountDetailsProps, FetchUserAccountsFn } from "../types";;
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import AppButton from "../AppButton";

type WithdrawFormProps = {
  accounts: AccountDetailsProps[];
  fetchUserAccounts: FetchUserAccountsFn;
  accountId: number;
};

function WithdrawForm({ fetchUserAccounts, accountId }: WithdrawFormProps) {
  const [amount, setAmount] = useState("");
  const { showNotification } = useNotification();
  const [idempotencyKey, setIdepotencyKey] = useState("");
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false); 

  const { customFetchData: withdrawFetch, loading } = useFetch();

  useEffect(() => {
    const key = crypto.randomUUID();
    setIdepotencyKey(key);
  }, [open]);

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
      setAmount("");
      setOpen(false);
      fetchUserAccounts();
    } catch (error: any) {
      showNotification(error.message, "error");
    }
  };

  const handleClose = () => {
 
    if (loading) return; 
    setOpen(false);
    setAmount("");
    setError(false);
  };

  useEffect(() => {
    const key = crypto.randomUUID();
    setIdepotencyKey(key);
  }, []);



  return (
    <>
      <AppButton variant="success"  onClick={() => setOpen(true)}>Withdraw</AppButton>
      
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
        <DialogTitle>Withdraw Funds</DialogTitle>
        
        <form onSubmit={withDraw}>
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
             loading={loading}
            disabled={loading || amount.trim() === ""}
            type="submit"
     
            >
              Withdraw
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
export default memo(WithdrawForm);