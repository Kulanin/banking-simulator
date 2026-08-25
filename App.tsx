


import { NotificationProvider } from './src/context/NotificationProvider'
import { TopNav } from './src/components/layout/TopNav'
import BankSimulatorManagement from './src/pages/BankSimulatorManagement'
import {Toolbar } from '@mui/material'

function App() {


  return (
  <>
    <TopNav />
    <Toolbar />
        <Toolbar />
 <NotificationProvider>
 <BankSimulatorManagement />
 </NotificationProvider>

    
  </>
  )
}

export default App
