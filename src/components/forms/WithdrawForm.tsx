import React, { useEffect, useState, memo } from "react";
import { DialogActions, TextField } from "@mui/material";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import useFetch from "../../customHooks/useFetch";
import type { AccountDetailsProps, FetchUserAccountsFn } from "../../types";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import AppButton from "../ui/AppButton";
import { StatusCard, type StatusVariant } from "../StatusCard";
import { Modal } from "../Modal";

type WithdrawFormProps = {
  accounts: AccountDetailsProps[];
  fetchUserAccounts: FetchUserAccountsFn;
  accountId: number;
};

type WithdrawalStatus = {
  message: string;
  title: string;
  variant: StatusVariant;
};

function WithdrawForm({ fetchUserAccounts, accountId }: WithdrawFormProps) {
  const [amount, setAmount] = useState(0);
  const [idempotencyKey, setIdepotencyKey] = useState("");
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { customFetchData: withdrawFetch, loading } = useFetch();

  const [withdrawalStatus, setWithdrawalStatus] =
    useState<WithdrawalStatus | null>();

  useEffect(() => {
    const key = crypto.randomUUID();
    setIdepotencyKey(key);
  }, [open]);

  function handleSuccessWithdrawal() {
    const formatted = new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
    setWithdrawalStatus({
      message: `${formatted} has been withdrawn successfully.`,
      title: "Withdrawal Successful!",
      variant: "success",
    });
  }

  function handleFailedWithdrawal(error: any) {
    setWithdrawalStatus({
      message: error?.message,
      title: "Withdrawal Failed!",
      variant: "error",
    });
  }

  const withDraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!amount) {
      setError(true);
      return;
    }
    try {
      await withdrawFetch(
        `api/v1/accounts/${accountId}/withdraw`,
        {
          method: "POST",
          querydata: { amount, actionType: "withdraw" },
          idempotencyKey,
        },
        true,
      );

      handleSuccessWithdrawal();
    } catch (error: any) {
      handleFailedWithdrawal(error);
    } finally {
      setOpenDialog(true);
      setOpen(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setAmount(0);
    setError(false);
    fetchUserAccounts();
  };

  useEffect(() => {
    const key = crypto.randomUUID();
    setIdepotencyKey(key);
  }, []);

  return (
    <>
      <AppButton variant="success" onClick={() => setOpen(true)}>
        Withdraw
      </AppButton>
      <Modal open={openDialog} onClose={() => {}} maxWidth="sm">
        {withdrawalStatus && (
          <StatusCard
            variant={withdrawalStatus.variant}
            title={withdrawalStatus.title}
            message={withdrawalStatus.message}
            onClose={handleClose}
          />
        )}
      </Modal>
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
              onChange={(e) => setAmount(Number(e.target.value))}
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
              disabled={loading || amount === 0}
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
