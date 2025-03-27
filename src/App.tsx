import { Routes, Route } from "react-router-dom"
import { LoginPage } from "./components/auth/login"
import { CRMLandingPage } from "./components/ui/crm-landing"
import { Dashboard } from "./components/dashboard/dashboard"
import { Header } from "./components/ui/header"
import { CalendarPage } from "./components/calendar/calendar-page"
import { TeamsPage } from "./components/teams/teams-page"

function App() {
  return (
    <div className="min-h-screen bg-[#1C1D2E]">
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
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/teams" element={<TeamsPage />} />
      </Routes>
    </div>
  )
}

export default App
