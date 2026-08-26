import type { GridColDef,GridValidRowModel,GridRowParams} from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";

type AppDataGridProps = {
  columns: GridColDef[];
  rows: GridValidRowModel[];
  onRowClick?: (params: GridRowParams) => void;
  loading?:boolean
};

const AppDataGrid = ({ columns, rows, onRowClick,loading = false}: AppDataGridProps) => {
  
  return (
    <DataGrid
      loading={loading}
      rows={rows}
      columns={columns}
      onRowClick={onRowClick}
      autoHeight
      sx={{
        fontSize: "0.8rem",
        "& .MuiDataGrid-cell": { py: 0.5 },
        "& .MuiDataGrid-columnHeaders": { fontSize: "0.8rem" },
      }}
    />
  );
};

export default AppDataGrid;
