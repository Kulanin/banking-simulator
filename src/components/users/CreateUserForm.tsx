import { memo, useState } from "react";
import { useNotification } from "../../context/NotificationProvider";
import { DialogActions, TextField } from "@mui/material";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import useFetch from "../../customHooks/useFetch";
import type { UpdateUsersFn } from "../../types";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import AppButton from "../ui/AppButton";
type CreateUserFormProps = {
  updateUsers: UpdateUsersFn;
};

function CreateUserForm({ updateUsers }: CreateUserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { showNotification } = useNotification();
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const { customFetchData: createUserFetch, loading } = useFetch();

  const resetState = () => {
    setName("");
    setEmail("");
    setOpen(false);
    setError(false);
  };

  const createUser = async (e: any) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError(true);
      return;
    }

    try {
      const data = await createUserFetch(
        "/api/v1/users",
        { method: "POST", querydata: { name, email } },
        true,
      );
      showNotification(data.message);
      updateUsers(data.data);
      resetState();
    } catch (error: any) {
      showNotification(error.message, "error");
    }
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setError(false);
  };

  return (
    <>
      <AppButton variant="success" onClick={() => setOpen(true)}>
        CREATE USER
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
        <DialogTitle>Create User</DialogTitle>

        <form onSubmit={createUser}>
          <DialogContent>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Full Name"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              error={error && !name.trim()}
              helperText={
                error && !name.trim() ? "User name is required" : undefined
              }
            />

            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              error={error && !email.trim()}
              helperText={
                error && !email.trim() ? "User email is required" : undefined
              }
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

            <AppButton loading={loading} type="submit">
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
export default memo(CreateUserForm);
