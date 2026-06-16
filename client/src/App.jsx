import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ReceiptScanner from "./pages/ReceiptScanner";
import FoodScanner from "./pages/FoodScanner";
import ElectricityScanner from "./pages/ElectricityScanner";
import TravelTracker from "./pages/TravelTracker";
import AICoach from "./pages/AICoach";
import DailyTimeline from "./pages/DailyTimeline";
import WeeklyTimeline from "./pages/WeeklyTimeline";
import Insights from "./pages/Insights";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/login" />}
      />

      <Route
        path="/receipt-scanner"
        element={
          <PrivateRoute>
            <ReceiptScanner />
          </PrivateRoute>
        }
      />

      <Route
        path="/food-scanner"
        element={<PrivateRoute><FoodScanner /></PrivateRoute>}
      />

      <Route
        path="/electricity-scanner"
        element={<PrivateRoute><ElectricityScanner /></PrivateRoute>}
      />

      <Route
        path="/travel-tracker"
        element={<PrivateRoute><TravelTracker /></PrivateRoute>}
      />

      <Route
        path="/ai-coach"
        element={<PrivateRoute><AICoach /></PrivateRoute>}
      />

      <Route
        path="/daily-timeline"
        element={<PrivateRoute><DailyTimeline /></PrivateRoute>}
      />

      <Route
        path="/weekly-timeline"
        element={<PrivateRoute><WeeklyTimeline /></PrivateRoute>}
      />

      <Route
        path="/insights"
        element={<PrivateRoute><Insights /></PrivateRoute>}
      />
    </Routes>
  );
}

export default App;