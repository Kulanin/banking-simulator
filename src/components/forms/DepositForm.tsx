import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { DialogActions, TextField } from "@mui/material";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import useFetch from "../../customHooks/useFetch";
import type { FetchUserAccountsFn } from "../../types";
import AppButton from "../ui/AppButton";
import { Modal } from "../Modal";
import { StatusCard, type StatusVariant } from "../StatusCard";

type DepositFormProps = {
  accountId: number;
  fetchUserAccounts: FetchUserAccountsFn;
};

type DepositResponseStatus = {
  accountId: string;
  balanceAfter: number;
  transactionId: string;
  amount: number;
};

type DepositStatus = {
  message: string;
  title: string;
  variant: StatusVariant;
};

function DepositForm({ accountId, fetchUserAccounts }: DepositFormProps) {
  const [amount, setAmount] = useState(0);
  const [idempotencyKey, setIdepotencyKey] = useState("");
  const [error, setError] = useState(false);
  const { customFetchData, loading } = useFetch();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [depositResponse, setDepositResponse] =
    useState<DepositResponseStatus | null>(null);
  const [depositStatus, setDepositStatus] = useState<DepositStatus | null>();

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setAmount(0);
    setError(false);
    fetchUserAccounts();
  };

  function handleSuccessDeposit() {
    const formatted = new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
    setDepositStatus({
      message: `${formatted} has been deposited successfully.`,
      title: "Deposit Successful!",
      variant: "success",
    });
  }

  function handleFailedDeposit(error: any) {
    setDepositStatus({
      message: error?.message,
      title: "Withdrawal Failed!",
      variant: "error",
    });
  }

  useEffect(() => {
    const key = crypto.randomUUID();
    setIdepotencyKey(key);
  }, [open]);

  const deposit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount) {
      setError(true);
      return;
    }
    try {
      const response = await customFetchData(
        `/api/v1/accounts/${accountId}/deposit`,
        {
          method: "POST",
          idempotencyKey,
          querydata: { amount, actionType: "deposit", idempotencyKey },
        },
        true,
      );
      setDepositResponse(response.data);
      setOpen(false);
      setAmount(0);
      handleSuccessDeposit();
    } catch (error: any) {
      handleFailedDeposit(error);
    } finally {
      setOpenDialog(true);
    }
  };

  return (
    <>
      <AppButton onClick={() => setOpen(true)}>Deposit</AppButton>
      <Modal open={openDialog} onClose={() => {}} maxWidth="sm">
        {depositStatus && depositResponse && (
          <StatusCard
            variant={depositStatus.variant}
            title={depositStatus.title}
            message={depositStatus.message}
            details={[
              {
                label: "Account Number",
                value: "0000" + depositResponse?.accountId || "N/A",
              },
              {
                label: "New Balance",
                value: `${Intl.NumberFormat("en-za", { style: "currency", currency: "ZAR" }).format(depositResponse.balanceAfter)}`,
              },
              //  { label: "Reference", value: "TX-2026-09-03-001" },
              // { label: "Date", value: "2026-09-03 14:30" },
            ]}
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
        <DialogTitle>Deposit Funds</DialogTitle>

        <form onSubmit={deposit}>
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
              disabled={loading || amount === 0}
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
