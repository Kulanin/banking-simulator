import React, { memo, useCallback, useEffect, useState } from "react";
import BankAccountList from "./accounts/BankAccountList";
import Grid from "@mui/material/Grid";
import {
  Backdrop,
  Card,
  CardHeader,
  CircularProgress,
  Typography,
} from "@mui/material";
import useFetch from "./customHooks/useFetch";
import UsersDataGrid from "./users/UsersDataGrid";
import { useNotification } from "./NotificationProvider";
import type { AccountDetailsProps, UserProps } from "./types";



const BankSimulatorManagement = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProps>();
  const [userAccounts, setUserAccounts] = useState<AccountDetailsProps[]>([]);
  const { showNotification } = useNotification();
  const {
    customFetchData: FetchingUsers,
    loading: loadingUsers,
    isError,
  } = useFetch();
  const { customFetchData: FetchingAccounts } =
    useFetch();

  const fetchUsers = useCallback(async () => {
    try {
      const data = await FetchingUsers(
        "/api/v1/users?size=10",
        { method: "GET" },
        true,
      );
      setUsers(data.data.content);
      setSelectedUser(data.data.content[0]);
      showNotification(data.message);
    } catch (error: any) {
      showNotification(error.message, "error");
    }
  }, []);

  const updateUsers = useCallback((user: UserProps, add: boolean = true) => {
    if (add) {
      setUsers((prevUsers) => [...prevUsers, user]);
    } else {
      setUsers((prevUsers) =>
        prevUsers.map((currentUser) =>
          currentUser.id === user.id ? user : currentUser,
        ),
      );
    }
  }, []);

  const fetchUserAccounts = useCallback(async () => {
    if (!selectedUser?.id) return;
    try {
      const data = await FetchingAccounts(
        `/api/v1/users/${selectedUser.id}`,
        { method: "GET" },
        true,
      );

      setUserAccounts(data?.data?.accounts || []);
    } catch (error: any) {
      showNotification(error.message, "error");
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (selectedUser?.id) {
      fetchUserAccounts();
    }
  }, [selectedUser?.id]);
  if (loadingUsers) {
    return (
      <Backdrop
        open={loadingUsers}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <div style={{ textAlign: "center" }}>
          <CircularProgress color="inherit" />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Preparing a bank simulator....
          </Typography>
        </div>
      </Backdrop>
    );
  }

  if (isError && users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-full max-w-[600px] bg-red-600 text-white shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg">Failed to load users</h3>
              <p className="text-sm text-red-100 mt-1">
                Something went wrong. Please try again.
              </p>
            </div>
            <button
              onClick={() => fetchUsers()}
              className="ml-4 px-3 py-1 text-sm font-bold text-white border border-white rounded hover:bg-white hover:text-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ margin: "auto", width: "70%" }}>
      <Grid container spacing={8}>
        <UsersDataGrid
          updateUsers={updateUsers}
          fetchAccounts={fetchUserAccounts}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          users={users}
        />
        <Grid size={{ xs: 12, md: 6 }} style={{ flex: 1 }}>
          <Card>
            <CardHeader
              sx={{
                backgroundColor: "#f5f5f5",
                py: 1,
              }}
              titleTypographyProps={{ variant: "body2" }}
              title={`${selectedUser?.name} accounts`}
            />
          </Card>
          <BankAccountList
            accounts={userAccounts || []}
            fetchUserAccounts={fetchUserAccounts}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(BankSimulatorManagement);
