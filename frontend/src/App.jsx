import React from 'react'
import AppRoutes from './routes'
import NavBar from './components/NavBar'
import SideBar from './components/SideBar'

function App() {
  return (
    <div className='App'>
      <NavBar />
      <div className='main-layout'>
        <SideBar />
        <main className='content'>
          <AppRoutes />
        </main>
      </div>
    </div>
  )
}

export default App;