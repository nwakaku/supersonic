import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import PricingPage from "@/pages/pricing";
import AboutPage from "@/pages/about";
import Dashboard from "./pages/dashboard";
import Settings from "@/pages/settings";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Dashboard />} path="/dashboard" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<Settings />} path="/settings" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
