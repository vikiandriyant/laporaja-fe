import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../_services/auth';
import { updateUser } from '../_services/user'; // Changed to use user service
import { useNavigate } from 'react-router-dom';
import Header from './header';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function Profil() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        nama_lengkap: '',
        no_telepon: '',
        tempat_tinggal: '',
        tanggal_lahir: '',
        jenis_kelamin: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                if (userData) {
                    setUser(userData);
                    setEditForm({
                        nama_lengkap: userData.nama_lengkap || '',
                        no_telepon: userData.no_telepon || '',
                        tempat_tinggal: userData.tempat_tinggal || '',
                        tanggal_lahir: userData.tanggal_lahir ? 
                            userData.tanggal_lahir.split('T')[0] : '',
                        jenis_kelamin: userData.jenis_kelamin || ''
                    });
                } else {
                    const res = await getCurrentUser();
                    localStorage.setItem('user', JSON.stringify(res));
                    setUser(res);
                    setEditForm({
                        nama_lengkap: res.nama_lengkap || '',
                        no_telepon: res.no_telepon || '',
                        tempat_tinggal: res.tempat_tinggal || '',
                        tanggal_lahir: res.tanggal_lahir ? 
                            res.tanggal_lahir.split('T')[0] : '',
                        jenis_kelamin: res.jenis_kelamin || ''
                    });
                }
            } catch (err) {
                console.error("Gagal ambil data user:", err);
                setError('Gagal mengambil data pengguna.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const getInitials = (fullName) => {
        if (!fullName) return '';
        const names = fullName.trim().split(' ');
        return names.length > 1
            ? names[0][0] + names[1][0]
            : names[0].substring(0, 2).toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleEditClose = () => {
        setShowEditModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const result = await MySwal.fire({
            title: 'Konfirmasi',
            text: 'Apakah Anda yakin ingin memperbarui profil?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, perbarui!',
            cancelButtonText: 'Batal',
            customClass: {
                confirmButton: 'btn btn-success me-2',
                cancelButton: 'btn btn-secondary'
            },
            buttonsStyling: false
        });
    
        if (!result.isConfirmed) return;
    
        try {
            const response = await updateUser(user.id, editForm);
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setShowEditModal(false);
    
            await MySwal.fire({
                title: 'Berhasil!',
                text: 'Profil berhasil diperbarui.',
                icon: 'success',
                customClass: {
                confirmButton: 'btn btn-success'
                },
                buttonsStyling: false
            });
        } catch (error) {
            console.error("Gagal memperbarui profil:", error);
            setError('Gagal memperbarui profil. Silakan coba lagi.');
            MySwal.fire({
                title: 'Gagal!',
                text: 'Profil gagal diperbarui.',
                icon: 'error'
            });
        }
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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Memuat data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="alert alert-warning">Data pengguna tidak ditemukan</div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100">
            <Header />

            <div className="container py-5">
                <div className="card shadow-lg mx-auto" style={{ maxWidth: '1000px', width: '100%' }}>
                    <div className="card-body text-center">
                        <div className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '80px', height: '80px', fontSize: '28px', fontWeight: 'bold' }}>
                            {getInitials(user.nama_lengkap)}
                        </div>
                        <h4 className="card-title">{user.nama_lengkap || 'Nama Tidak Tersedia'}</h4>
                        <p className="text-muted">{user.nik || 'NIK Tidak Tersedia'}</p>
                        <hr />
                        <div className="text-start px-3">
                            <p className="card-text"><strong>Tempat Tinggal:</strong> {user.tempat_tinggal || 'Alamat Tidak Tersedia'}</p>
                            <p className="card-text"><strong>Tanggal Lahir:</strong> {formatDate(user.tanggal_lahir) || 'Tanggal Lahir Tidak Tersedia'}</p>
                            <p className="card-text"><strong>Jenis Kelamin:</strong> {user.jenis_kelamin || 'Jenis Kelamin Tidak Tersedia'}</p>
                            <p className="card-text"><strong>Telepon:</strong> {user.no_telepon || 'Telepon Tidak Tersedia'}</p>
                        </div>
                    </div>

                    <div className="card-footer bg-white">
                        <div className="container px-0">
                            <div className="row g-2">
                                <div className="col-6">
                                    <button 
                                        className="btn btn-primary w-100" 
                                        onClick={handleEditClick}
                                        disabled={!user}
                                    >
                                        Edit Profil
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button className="btn btn-primary w-100">Laporan Saya</button>
                                </div>
                                <div className="">
                                    <button className="btn btn-danger w-100" onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal show={showEditModal} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profil</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Lengkap</Form.Label>
                            <Form.Control
                                type="text"
                                name="nama_lengkap"
                                value={editForm.nama_lengkap}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nomor Telepon</Form.Label>
                            <Form.Control
                                type="tel"
                                name="no_telepon"
                                value={editForm.no_telepon}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tempat Tinggal</Form.Label>
                            <Form.Control
                                type="text"
                                name="tempat_tinggal"
                                value={editForm.tempat_tinggal}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tanggal Lahir</Form.Label>
                            <Form.Control
                                type="date"
                                name="tanggal_lahir"
                                value={editForm.tanggal_lahir}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Jenis Kelamin</Form.Label>
                            <Form.Select
                                name="jenis_kelamin"
                                value={editForm.jenis_kelamin}
                                onChange={handleInputChange}
                            >
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleEditClose}>
                            Batal
                        </Button>
                        <Button variant="primary" type="submit">
                            Simpan Perubahan
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}