import React, { memo, useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DialogActions, TextField } from "@mui/material";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import useFetch from "../../customHooks/useFetch";
import type { AccountDetailsProps, FetchUserAccountsFn } from "../../types";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import AppButton from "../ui/AppButton";
import { StatusCard, type StatusVariant } from "../StatusCard";
import { Modal } from "../Modal";

type MoneyTranferFormProps = {
  accounts: AccountDetailsProps[];
  fetchUserAccounts: FetchUserAccountsFn;
};

type TransferStatus = {
  message: string;
  title: string;
  variant: StatusVariant;
};

function MoneyTranferForm({
  accounts,
  fetchUserAccounts,
}: MoneyTranferFormProps) {
  const [fromAccount, setFromAccount] = useState("");
  const [targetAccountId, setToAccount] = useState("");
  const [amount, setAmount] = useState(0);
  const [idempotencyKey, setIdepotencyKey] = useState("");
  const { customFetchData: transferFundsFetch, loading } = useFetch();
  const [open, setOpen] = useState(false);
  const [tranferStatus, setTranferStatus] = useState<TransferStatus | null>();
  const [openDialog, setOpenDialog] = useState(false);
  useEffect(() => {
    const key = crypto.randomUUID();
    setIdepotencyKey(key);
  }, [open]);

  const resetState = () => {
    setFromAccount("");
    setToAccount("");
    setAmount(0);
    setOpen(false);
  };

  function handleSuccessDeposit() {
    const formatted = new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
    setTranferStatus({
      message: `${formatted} has been transfered successfully.`,
      title: "Transfer Successful!",
      variant: "success",
    });
  }

  function handleFailedDeposit(error: any) {
    setTranferStatus({
      message: error?.message,
      title: "Transfer Failed!",
      variant: "error",
    });
  }

  const tranferFunds = async (value: any) => {
    try {
      await transferFundsFetch(
        `/api/v1/accounts/${fromAccount}/transfer`,
        { method: "POST", idempotencyKey, querydata: value },
        true,
      );

      handleSuccessDeposit();
    } catch (error: any) {
      handleFailedDeposit(error);
    } finally {
      setOpenDialog(true);
      resetState();
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
  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    fetchUserAccounts();
  };

  return (
    <>
      <AppButton variant="outline" onClick={() => setOpen(true)}>
        TRANSFER
      </AppButton>
      <Modal open={openDialog} onClose={() => {}} maxWidth="sm">
        {tranferStatus && (
          <StatusCard
            variant={tranferStatus.variant}
            title={tranferStatus.title}
            message={tranferStatus.message}
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
        <DialogTitle>TRANSFER Funds</DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
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
              onChange={(e) => setAmount(Number(e.target.value))}
              label="Amount"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              type="number"
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
              disabled={
                loading ||
                amount === 0 ||
                fromAccount === "" ||
                targetAccountId === ""
              }
              type="submit"
            >
              TRANSFER
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
export default memo(MoneyTranferForm);
