import { memo, useCallback, useEffect, useState } from "react";
import BankAccountList from "./accounts/BankAccountList";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import useFetch from "./customHooks/useFetch";
import UsersDataGrid from "./users/UsersDataGrid";
import { useNotification } from "./NotificationProvider";
import type { AccountDetailsProps, UserProps } from "./types";
import AppButton from "./AppButton";

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
  const { customFetchData: FetchingAccounts, loading: loadingAccounts } =
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

  if (isError) {
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
            <AppButton
              onClick={() => fetchUsers()}
              className="ml-4 px-3 py-1 text-sm font-bold text-white border border-white rounded hover:bg-white hover:text-red-600 transition-colors"
            >
              Retry
            </AppButton>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[80%] max-w-[1400px] mx-auto px-1 sm:px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UsersDataGrid
          updateUsers={updateUsers}
          fetchAccounts={fetchUserAccounts}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          users={users}
        />

        <div className="flex flex-col flex-1">
          <div className="bg-gray-100 py-2 px-4 rounded-md shadow-sm">
            <h3 className="text-sm font-semibold text-gray-800">
              {selectedUser?.name} accounts
            </h3>
          </div>

          {loadingAccounts ? (
            <div className="flex justify-center items-center py-6">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-sm text-gray-600">
                Loading accounts...
              </span>
            </div>
          ) : userAccounts.length === 0 ? (
            <p className="text-center">There are no accounts for the user</p>
          ) : (
            <BankAccountList
              accounts={userAccounts || []}
              fetchUserAccounts={fetchUserAccounts}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(BankSimulatorManagement);
