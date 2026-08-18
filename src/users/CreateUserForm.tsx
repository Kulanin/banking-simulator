import React, {  useState } from "react";

import { Button } from "@mui/material";
import { useNotification } from "../NotificationProvider";
import { DialogActions, TextField } from "@mui/material";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import useFetch from "../customHooks/useFetch";
import type { UpdateUsersFn } from "../types";
type CreateUserFormProps = {
  updateUsers: UpdateUsersFn;
};
function CreateUserForm({ updateUsers }: CreateUserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { showNotification } = useNotification();
  const [error, setError] = useState(false);
  const { customFetchData: createUserFetch, loading } =
    useFetch();

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
    } catch (error: any) {
      showNotification(error.message, "error");
    }
  };

  return (
    <>
      <form onSubmit={createUser}>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Full Name"
          variant="outlined"
          required
          fullWidth
          margin="normal"
        />

        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          variant="outlined"
          required
          fullWidth
          margin="normal"
        />

        <DialogActions sx={{ mt: 2 }}>
          <Button>Cancel</Button>
          <Button type="submit" variant="contained">
            Submit
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

export default CreateUserForm;
