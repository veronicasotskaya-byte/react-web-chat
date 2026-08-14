import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Bots from "./pages/Bots";
import Agents from "./pages/Agents.tsx";
import EditBot from "./pages/EditBot.tsx";
import EditAgent from "./pages/EditAgent.tsx";
import Widgets from "./pages/Widgets";
import EditWidget from "./pages/EditWidget.tsx";

import { Toaster } from "react-hot-toast";
import WidgetDemo from "./pages/WidgetDemo.tsx";
import Chats from "./pages/Chats.tsx";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bots" element={<Bots />} />
        <Route path="/bots/new" element={<EditBot />} />
        <Route path="/bots/:id/edit" element={<EditBot />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agents/new" element={<EditAgent />} />
        <Route path="/agents/:id/edit" element={<EditAgent />} />
        <Route path="/widgets" element={<Widgets />} />
        <Route path="/widgets/demo" element={<WidgetDemo />} />
        <Route path="/widgets/demo/:publicWidgetId" element={<WidgetDemo />} />
        <Route path="/widgets/new" element={<EditWidget />} />
        <Route path="/widgets/:id/edit" element={<EditWidget />} />
        <Route path="/chats" element={<Chats />} />
        <Route
          path="*"
          element={<div style={{ padding: 40 }}>Page not found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
