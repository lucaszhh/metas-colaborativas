import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";

const Toaster = lazy(() => import("sileo").then((module) => ({ default: module.Toaster })));
const LoginPage = lazy(() =>
  import("./views/LoginPage").then((module) => ({ default: module.LoginPage }))
);
const DashboardLayout = lazy(() =>
  import("./views/DashboardLayout").then((module) => ({ default: module.DashboardLayout }))
);
const Dashboard = lazy(() =>
  import("@/modules/goals/pages/Dashboard").then((module) => ({ default: module.Dashboard }))
);

function RouteFallback() {
  return <div className="min-h-screen bg-background" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Toaster position="top-right" />
      </Suspense>
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<RouteFallback />}>
              <LoginPage />
            </Suspense>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteFallback />}>
                <DashboardLayout />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<RouteFallback />}>
                <Dashboard />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
