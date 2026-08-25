import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import AppButton from "../ui/AppButton";
import {
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { useNotification } from "../../context/NotificationProvider";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import useFetch from "../../customHooks/useFetch";
import type { FetchUserAccountsFn, UserProps } from "../../types";
type OpenAccountFormProps = {
  fetchAccounts: FetchUserAccountsFn;
  selectedUser: UserProps | undefined;
};

function OpenAccountForm({
  fetchAccounts,
  selectedUser,
}: OpenAccountFormProps) {
  if (!selectedUser) {
    return;
  }
  const [open, setOpen] = React.useState(false);
  const [accountType, setAccountType] = React.useState("");
  const [maturityDate, setMaturityDate] = React.useState<Dayjs | null>(null);
  const [accountName, setAccountName] = useState("");
  const { showNotification } = useNotification();
  const handleClose = () => setOpen(false);
  const [error, setError] = useState(false);

  const { customFetchData, loading } = useFetch();
  const handleAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(e.target.value);
  };

  const resetState = () => {
    setAccountType("");
    setMaturityDate(null);
    setAccountName("");
    setOpen(false);
  };

  const createAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !accountName.trim() ||
      !accountType.trim() ||
      (accountType === "FIXED" && !maturityDate)
    ) {
      setError(true);
      return;
    }

    try {
      const data = await customFetchData(
        `api/v1/accounts/user/${selectedUser.id}`,
        {
          method: "POST",
          querydata: {
            maturityDate: maturityDate?.format("YYYY-MM-DD"),
            accountType,
            accountName,
          },
        },
        true,
      );
      fetchAccounts();
      showNotification(data.message);
      resetState();
    } catch (error: any) {
      showNotification(error.message, "error");
    }
  };

  const invalidValue = accountName.trim() === "" || accountType.trim() === "";
  return (
    <>
      <AppButton variant="success" size="sm" onClick={() => setOpen(true)}>
        Create Account
      </AppButton>

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
        <DialogTitle>Create Account</DialogTitle>

        <form onSubmit={createAccount}>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Account Type</InputLabel>
              <Select
                value={accountType}
                onChange={(e) => {
                  setAccountType(e.target.value);
                }}
                label="Account Type"
              >
                <MenuItem value="SAVINGS">Savings</MenuItem>
                <MenuItem value="FIXED">Fixed</MenuItem>
                <MenuItem value="CHECKING">Checking</MenuItem>
              </Select>

              <FormHelperText>Select account type</FormHelperText>
            </FormControl>

            <TextField
              value={accountName}
              onChange={handleAccountNameChange}
              fullWidth
              label="Full Name"
              variant="outlined"
              required
              error={error && !accountName.trim()}
              helperText={
                error && !accountName.trim()
                  ? "Account name is required"
                  : undefined
              }
            />

            {accountType === "FIXED" && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Maturity Date"
                  value={maturityDate}
                  onChange={(newValue) => setMaturityDate(newValue)}
                  slotProps={{
                    textField: { fullWidth: true, margin: "normal" },
                  }}
                />
              </LocalizationProvider>
            )}
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
              disabled={loading || invalidValue}
              type="submit"
            >
              Submit
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
export default OpenAccountForm;
