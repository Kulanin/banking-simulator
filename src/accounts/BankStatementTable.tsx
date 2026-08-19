import { useCallback, useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import {} from "@mui/material";
import AppDataGrid from "../AppDataGrid";
import useFetch from "../customHooks/useFetch";
import { useNotification } from "../NotificationProvider";
import { Dialog, DialogContent } from "@mui/material";

import AppButton from "../AppButton";


type MoneyTranferFormProps = {
  accountId: number;
};

function BankStatementTable({ accountId }: MoneyTranferFormProps) {
  const [statement, setStatement] = useState<any>([]);
  const { showNotification } = useNotification();

  const { customFetchData,loading} = useFetch();

  const fetchStatement = useCallback(async () => {
    try {
      const data = await customFetchData(
        `/api/v1/accounts/statement/${accountId}`,
        { method: "GET" },
        true,
      );

      setStatement(
        data.data.map((item: any, index: number) => ({
          ...item,
          createdAt: new Date(item.createdAt).toLocaleString(),
          id: index, 
        })),
      );
      showNotification(data.message);
    } catch (error: any) {
      showNotification(error.message, "error");
    }
  }, []);




 
  const [open, setOpen] = useState(false); 

    const statementColumns: GridColDef[] = [
    {
      field: "accountName",
      headerName: "Account Name",
      width: 150,
      type: "string",
    },
    { field: "amount", headerName: "Amount", width: 100, type: "string" },
    {
      field: "balanceAfter",
      headerName: "Balance After",
      width: 100,
      type: "string",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 250,
      type: "string",
    },
    {
      field: "type",
      headerName: "Transaction Type",
      width: 250,
      type: "string",
    },
  ];

  const handleClose = () => {
 
    if (loading) return; 
    setOpen(false);
  };

  return (
    <>
      <AppButton variant="secondary" onClick={() => {setOpen(true);fetchStatement()}}>View Statement</AppButton>
      
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
  
     
          <DialogContent>
      <AppDataGrid
        columns={statementColumns}
        rows={statement.map((item: any) => ({
          ...item,
        }))}
      />
          </DialogContent>

        
      </Dialog>

    </>
  );
}

export default BankStatementTable;
