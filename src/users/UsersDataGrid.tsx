import React, { memo } from "react";
import OpenAccountForm from "../forms/OpenAccountForm";
import CreateUserForm from "./CreateUserForm";
import AppDataGrid from "../AppDataGrid";
import type { GridColDef } from "@mui/x-data-grid";
import type { FetchUserAccountsFn, UpdateUsersFn, UserProps } from "../types";

type UsersDataGridProps = {
  users: UserProps[];
  setSelectedUser: React.Dispatch<React.SetStateAction<UserProps | undefined>>;
  selectedUser: UserProps | undefined;
  fetchAccounts: FetchUserAccountsFn;
  updateUsers: UpdateUsersFn;
};

const UsersDataGrid = ({
  users = [],
  setSelectedUser,
  selectedUser,
  fetchAccounts,
  updateUsers,
}: UsersDataGridProps) => {


  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "name", headerName: "Name", width: 100 },
    { field: "email", headerName: "Email", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: () => (
        <OpenAccountForm
          selectedUser={selectedUser}
          fetchAccounts={fetchAccounts}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="flex h-12 justify-between items-center bg-gray-200 p-4 text-white">
        <h2 className="text-xl font-bold text-gray-900">Users</h2>
        <CreateUserForm updateUsers={updateUsers} />
      </div>

      <div className="sm:w-full">
        <AppDataGrid
          columns={columns}
          rows={users.map((user: any) => ({
            createAccount: "createAccount",
            ...user,
          }))}
          onRowClick={(user: any) => setSelectedUser(user.row)}
        />
      </div>
    </div>
  );
};

export default memo(UsersDataGrid);
