import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export const TopNav: React.FC = () => {
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <div
  className="w-full sm:w-[90%] md:w-[85%] lg:w-[80%] max-w-[1400px] mx-auto px-1 sm:px-2"
        >
    
          <Typography variant="h6">Bank Simulator</Typography>

   
          <Box>
            {/* <Button color="inherit">Register</Button>
            <Button color="inherit">Login</Button> */}
          </Box>
        </div>
      </Toolbar>
    </AppBar>
  );
};
