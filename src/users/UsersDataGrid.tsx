import React, { memo,  } from "react";
import GenericFormModal from "../forms/GenericFormModal";
import OpenAccountForm from "../forms/OpenAccountForm";
import CreateUserForm from "./CreateUserForm";
import AppDataGrid from "../AppDataGrid";
import type { GridColDef } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import { Card, CardHeader } from "@mui/material";
import type { FetchUserAccountsFn, UpdateUsersFn, UserProps } from "../types";

type UsersDataGridProps = {
  users: UserProps[];
  setSelectedUser: React.Dispatch<React.SetStateAction<UserProps | undefined>>;
  selectedUser: UserProps | undefined;
  fetchAccounts: FetchUserAccountsFn;
  updateUsers:UpdateUsersFn
};

const UsersDataGrid = ({
  users = [],
  setSelectedUser,
  selectedUser,
  fetchAccounts,
  updateUsers
}: UsersDataGridProps) => {
  
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "name", headerName: "Name", width: 100 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <GenericFormModal
          openFormText="Create Account"
          dialogTitle="Select account type"
          dialogContent={OpenAccountForm}
          dialogProps={{
            selectedUser,
            fetchAccounts,
          }}
        />
      ),
    },
  ];

  return (
    <Grid  xs={12} md={4}  >
      <Card>
        <CardHeader
          sx={{
            backgroundColor: "#f5f5f5",
            py: 1,
          }}
          title="Users"
          titleTypographyProps={{ variant: "body2" }}
          action={
            <GenericFormModal
              dialogContent={CreateUserForm}
              dialogProps={{
                updateUsers,
              }}
              openFormText="Create User"
              dialogTitle="Create User"
            />
          }
        />
      </Card>

      <AppDataGrid
        columns={columns}
        rows={users.map((user: any) => ({
          createAccount: "createAccount",
          ...user,
        }))}
        onRowClick={(user: any) => setSelectedUser(user.row)}
      />
    </Grid>
  );
};

export default memo(UsersDataGrid);
