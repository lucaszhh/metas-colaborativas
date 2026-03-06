import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { Toaster } from "sileo";
import { LoginPage } from "./views/LoginPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { DashboardLayout } from "./views/DashboardLayout";
import { Dashboard } from "@/modules/goals/pages/Dashboard";
import { auth } from "@/lib/firebase";
import { debugFirebase } from "@/modules/auth/services/debugFirebase";

export default function App() {
  useEffect(() => {
    if (!import.meta.env.PROD) return;

    const unsub = onAuthStateChanged(auth, () => {
      void debugFirebase();
    });

    return () => unsub();
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
