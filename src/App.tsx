import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sileo";
import { LoginPage } from "./views/LoginPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AppLayout } from "./views/AppLayout";
import { Dashboard } from "@/features/goals/pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
