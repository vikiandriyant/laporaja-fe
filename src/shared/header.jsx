import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function Header() {
    const navigate = useNavigate();

    // Ambil user dari localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const getInitials = (fullName) => {
        if (!fullName) return '';
        const names = fullName.trim().split(' ');
        const initials = names.length > 1
            ? names[0][0] + names[1][0]
            : names[0].substring(0, 2);
        return initials.toUpperCase();
    };

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
        <div 
            className="container-fluid bg-white border-bottom shadow-sm"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1030,
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.95)"
            }}
        >
            <div className="container">
                <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3">
                    <Link to="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                        <img
                            src="../src/assets/logo.png"
                            alt="Logo"
                            style={{ height: '30px', objectFit: 'contain' }}
                            className="me-2"
                        />
                    </Link>

                    <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                        <li>
                            <Link 
                                to="/" 
                                className="nav-link px-2 link-dark"
                                onClick={() => {
                                    if (window.location.pathname === '/') {
                                        window.location.reload();
                                    }
                                }}
                            >
                                Beranda
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="#"
                                className="nav-link px-2 link-dark"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleScroll('caraKerja');
                                }}
                            >
                                Cara Kerja
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="#"
                                className="nav-link px-2 link-dark"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleScroll('testimonial');
                                }}
                            >
                                Testimonial
                            </Link>
                        </li>

                        {/* Dropdown Lapor */}
                        <li>
                            <Dropdown>
                                <Dropdown.Toggle variant="light" id="dropdown-basic" className="nav-link px-2 link-dark border-0">
                                    Lapor
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to="/lapor">Buat Laporan</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/riwayat">Riwayat Laporan</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </li>
                    </ul>

                    <div className="col-md-3 text-end">
                        {!user ? (
                            <>
                                <Link to="/login" className="btn btn-outline-primary me-3 rounded-pill">
                                    Masuk
                                </Link> 
                                <Link to="/register" className="btn btn-primary rounded-pill">
                                    Daftar
                                </Link>
                            </>
                        ) : (
                            <div className="d-flex justify-content-end align-items-center">
                                <Dropdown align="end">
                                    <Dropdown.Toggle 
                                        variant="light" 
                                        className="border-0 p-0 d-flex align-items-center gap-2"
                                        style={{ backgroundColor: 'transparent' }}
                                    >
                                        <div 
                                            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                                            style={{ 
                                                width: '40px', 
                                                height: '40px', 
                                                fontWeight: 'bold',
                                                flexShrink: 0 
                                            }}
                                            title={user.nama_lengkap}
                                        >
                                            {getInitials(user.nama_lengkap)}
                                        </div>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to="/profil">Profil</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        )}
                    </div>
                </header>
            </div>
        </div>
    );
}