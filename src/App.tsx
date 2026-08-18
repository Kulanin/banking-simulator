


import { NotificationProvider } from './NotificationProvider'
import { TopNav } from './TopNav'
import BankSimulatorManagement from './BankSimulatorManagement'
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
