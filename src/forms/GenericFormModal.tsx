import React, { } from "react";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";

type GenericFormModalProps<T extends object = {}> = {
  openFormText: string;
  dialogTitle: string;
  onModalOpen?: (open: boolean) => void;
  onModalClose?: () => void;
  dialogContent: React.ComponentType<any>;
  dialogProps: T;
  modalMaxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "inherit"  | "error" | "info" | "success" | "warning";
  
};

function GenericFormModal<T extends object>({
  dialogTitle,
  onModalOpen,
  onModalClose,
  openFormText,
  dialogContent: DialogContents,
  dialogProps,
  modalMaxWidth = "sm",
  color = "primary",
}: GenericFormModalProps<T>) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
    onModalOpen?.(true);
  };

  const handleClose = () => {
    setOpen(false);
    onModalClose?.();
  };

  return (
    <>
      <Button sx={{ fontSize: "0.75rem", padding: "4px 8px" }}   variant="contained" color={color} onClick={handleOpen}>
        {openFormText}
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth   sx={{
    "& .MuiDialog-container": {
      alignItems: "flex-start", 
    },
    "& .MuiDialog-paper": {
      marginTop: "20px",
    },
  }} maxWidth={modalMaxWidth}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContents {...(dialogProps as T)} onClose= {handleClose} />
        </DialogContent>
        
      </Dialog>
      
    </>
  );
}

export default React.memo(GenericFormModal);

