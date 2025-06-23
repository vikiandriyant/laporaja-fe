import { BrowserRouter, Route, Routes } from "react-router-dom";
import RiwayatAdmin from "./pages/Admin/riwayatadmin";
import KelolaLaporan from "./pages/Admin/kelolalaporan";
import Pengguna from "./pages/Admin/Pengguna";
import AdminDashboard from "./pages/Admin/index";
import LandingPage from "./pages/public";
import FormLapor from "./pages/public/laporan/create";
import RiwayatUser from "./pages/public/riwayatuser/index";
// Import Auth Components
import Login from "./pages/_auth/login";
import Register from "./pages/_auth/register";
import ForgotPassword from "./pages/_auth/forgotpassword";
import Profil from "./shared/profil";
import PublicLayout from "./layouts/public";
import KategoriAdmin from "./pages/Admin/kategori";
import EditForm from "./pages/public/laporan/edit";

function App() {
  return (
    <>
      <div className="">
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="/lapor" element={<FormLapor />} />
              <Route path="/riwayat" element={<RiwayatUser />} />
              <Route path="/lapor/edit/:id" element={<EditForm />} />
            </Route>

            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="profil" element={<Profil />} />
            
            <Route path="/kelola-laporan" element={<KelolaLaporan />} />
            <Route path="/riwayat-admin" element={<RiwayatAdmin />} />
            <Route path="/pengguna" element={<Pengguna />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/kategori" element={<KategoriAdmin />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;