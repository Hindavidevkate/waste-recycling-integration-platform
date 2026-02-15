import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./pages/Admin/AdminLayout";
import DashboardHome from "./pages/Admin/DashboardHome";
import UsersPage from "./pages/Admin/Users";
import PickupsPage from "./pages/Admin/Pickups";
import WasteCategories from "./pages/Admin/WasteCategories";
import Reports from "./pages/Admin/Reports";
import Complaints from "./pages/Admin/Complaints";
import Navbar from "./components/Navbar";
import ProducerLayout from "./pages/Producer/ProducerLayout";
import ProducerDashboard from "./pages/Producer/DashboardHome";
import CreateListing from "./pages/Producer/CreateListing";
import MyListings from "./pages/Producer/MyListings";
import ProducerHistory from "./pages/Producer/History";
import Notifications from "./pages/Producer/Notifications";
import Profile from "./pages/Producer/Profile";
import KabadiwalaLayout from "./pages/Collector/KabadiwalaLayout";
import KabadiwalaDashboard from "./pages/Collector/Dashboard";

// Transporter imports
import TransporterLayout from "./pages/Transporter/TransporterLayout";
import TransporterDashboard from "./pages/Transporter/Dashboard";
import BrowseJobs from "./pages/Transporter/BrowseJobs";
import MyJobs from "./pages/Transporter/MyJobs";
import Fleet from "./pages/Transporter/Fleet";
import Earnings from "./pages/Transporter/Earnings";
import TransporterHistory from "./pages/Transporter/History";
import TransporterProfile from "./pages/Transporter/Profile";

// Recycler imports
import RecyclerLayout from "./pages/Recycler/RecyclerLayout";
import RecyclerDashboard from "./pages/Recycler/Dashboard";
import BrowseWaste from "./pages/Recycler/BrowseWaste";
import IncomingShipments from "./pages/Recycler/IncomingShipments";
import InventoryManagement from "./pages/Recycler/InventoryManagement";
import RecyclerProfile from "./pages/Recycler/Profile";
import ProcurementHistory from "./pages/Recycler/ProcurementHistory";
import RecyclerReports from "./pages/Recycler/Reports";
import SelectTransporter from "./pages/Recycler/SelectTransporter";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="collectors" element={<UsersPage roleFilter="collector" />} />
          <Route path="recyclers" element={<UsersPage roleFilter="recycler" />} />
          <Route path="pickups" element={<PickupsPage />} />
          <Route path="categories" element={<WasteCategories />} />
          <Route path="reports" element={<Reports />} />
          <Route path="complaints" element={<Complaints />} />
        </Route>
        <Route path="/kabadiwala" element={<KabadiwalaLayout />}>
          <Route index element={<KabadiwalaDashboard />} />
          <Route path="browse" element={<BrowseWaste />} />
        </Route>
        <Route path="/producer" element={<ProducerLayout />}>
          <Route index element={<ProducerDashboard />} />
          <Route path="create" element={<CreateListing />} />
          <Route path="listings" element={<MyListings />} />
          <Route path="history" element={<ProducerHistory />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/transporter" element={<TransporterLayout />}>
          <Route index element={<TransporterDashboard />} />
          <Route path="browse" element={<BrowseJobs />} />
          <Route path="my-jobs" element={<MyJobs />} />
          <Route path="fleet" element={<Fleet />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="history" element={<TransporterHistory />} />
          <Route path="profile" element={<TransporterProfile />} />
        </Route>
        <Route path="/recycler" element={<RecyclerLayout />}>
          <Route index element={<RecyclerDashboard />} />
          <Route path="browse" element={<BrowseWaste />} />
          <Route path="shipments" element={<IncomingShipments />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="history" element={<ProcurementHistory />} />
          <Route path="reports" element={<RecyclerReports />} />
          <Route path="profile" element={<RecyclerProfile />} />
          <Route path="select-transporter/:id" element={<SelectTransporter />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
