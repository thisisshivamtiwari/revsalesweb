import { Routes, Route } from "react-router-dom"
import { LoginPage } from "./components/auth/login"
import { CRMLandingPage } from "./components/ui/crm-landing"
import { Dashboard } from "./components/dashboard/dashboard"
import { Header } from "./components/ui/header"

function App() {
  return (
    <div className="min-h-screen bg-[#0A0F20]">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <CRMLandingPage />
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
