import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddLead from "./pages/AddLead";
import LeadDetails from "./pages/LeadDetails";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/add-lead"
          element={<AddLead />}
        />

        <Route
          path="/leads/:id"
          element={<LeadDetails />}
        />

      </Routes>

    </BrowserRouter>
  );
}