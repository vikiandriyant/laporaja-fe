import { NavLink, Link, useNavigate } from "react-router-dom"; // ganti NavLink untuk active state
import { Dropdown } from "react-bootstrap";
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const MySwal = withReactContent(Swal);

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await MySwal.fire({
      title: 'Konfirmasi Logout',
      text: 'Apakah Anda yakin ingin logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, logout',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton: 'btn btn-danger me-2',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem('user');
    localStorage.removeItem('token');

    await MySwal.fire({
      title: 'Sampai jumpa!',
      text: 'Anda berhasil logout.',
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-success'
      },
      buttonsStyling: false
    });

    navigate('/login');
  };

  return (
    <nav
      className="col-md-3 col-lg-2 d-md-block bg-dark text-white sidebar"
      style={{
        minWidth: "auto",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        overflowY: "auto",
        zIndex: 1000
      }}
    >
      <div className="pt-3 vh-100">
        <div className="sidebar-header px-3 py-4 border-bottom">
          <Link
            to="/dashboard"
            className="d-flex align-items-center text-white text-decoration-none"
          >
            <img
              src="/src/assets/logo.png"
              alt="Logo"
              style={{ height: 30 }}
              className="me-2"
            />
          </Link>
        </div>
        <ul className="nav flex-column mt-4">
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/dashboard">
              <i className="bi bi-house-door me-2" /> Beranda
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/pengguna">
              <i className="bi bi-people me-2" /> Pengguna
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/kategori">
              <i className="bi bi-tags me-2" /> Kelola Kategori
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/kelola-laporan">
              <i className="bi bi-inbox me-2" /> Kelola Laporan
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/riwayat-admin">
              <i className="bi bi-clock-history me-2" /> Riwayat Laporan
            </NavLink>
          </li>

          <li className="nav-item mt-4 border-top pt-3">
            <Link
              className="nav-link text-danger"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-left me-2" /> Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
