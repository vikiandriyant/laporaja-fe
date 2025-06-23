import React, { useState, useEffect } from 'react';
import Sidebar from "../../../shared/sidebar";
import { getAllUsers } from "../../../_services/user";
import { Modal, Button, Card, Badge, Row, Col } from 'react-bootstrap';
import { Eye, Person, Telephone, CardText, House, Calendar, GenderAmbiguous, Clock } from 'react-bootstrap-icons';

// Komponen Detail Pengguna yang dipercantik
const UserDetailCard = ({ user }) => {
  if (!user) return null;

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <div className="text-center mb-4">
          <div className="d-inline-block position-relative">
            <div className="bg-primary rounded-circle p-4">
              <Person size={48} className="text-white" />
            </div>
          </div>
          <h3 className="mt-3 mb-1">{user.nama_lengkap || '-'}</h3>
          <p className="text-muted">Pengguna Terdaftar</p>
        </div>

        <div className="mb-4">
          <Row className="g-3">
            <Col md={6}>
              <Card className="h-100 border">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded p-2 me-3">
                      <CardText size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-0 text-muted">NIK</h6>
                      <p className="mb-0 fs-5 fw-semibold">{user.nik || '-'}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="h-100 border">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded p-2 me-3">
                      <Telephone size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-0 text-muted">No. Telepon</h6>
                      <p className="mb-0 fs-5 fw-semibold">{user.no_telepon || '-'}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="h-100 border">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded p-2 me-3">
                      <House size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-0 text-muted">Tempat Tinggal</h6>
                      <p className="mb-0 fs-5 fw-semibold">{user.tempat_tinggal || '-'}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="h-100 border">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded p-2 me-3">
                      <Calendar size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-0 text-muted">Tanggal Lahir</h6>
                      <p className="mb-0 fs-5 fw-semibold">
                        {user.tanggal_lahir ? new Date(user.tanggal_lahir).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : '-'}
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="h-100 border">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded p-2 me-3">
                      <GenderAmbiguous size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-0 text-muted">Jenis Kelamin</h6>
                      <Badge 
                        bg={user.jenis_kelamin === 'Laki-laki' || user.jenis_kelamin === 'L' ? 'info' : 'warning'} 
                        className="fs-6"
                      >
                        {user.jenis_kelamin || '-'}
                      </Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="h-100 border">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded p-2 me-3">
                      <Clock size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-0 text-muted">Tanggal Dibuat</h6>
                      <p className="mb-0 fs-5 fw-semibold">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

// Komponen Modal Detail Pengguna
const UserDetailModal = ({ show, onHide, user }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold">Detail Pengguna</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <UserDetailCard user={user} />
      </Modal.Body>
      <Modal.Footer className="border-top-0">
        <Button variant="outline-secondary" onClick={onHide}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Komponen utama Pengguna
const Pengguna = () => {
  // States
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const itemsPerPage = 8;

  // Fetch only users with role 'user'
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      const data = response.data || response;
      const filtered = data.filter(user => user.role === 'user');
      setUsers(filtered);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data pengguna. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedUsers = () => {
    if (!sortConfig.key) return [...users];

    return [...users].sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getFilteredUsers = () => {
    const search = searchTerm.toLowerCase();
    return getSortedUsers().filter(user =>
      ['nik', 'nama_lengkap', 'no_telepon'].some(field =>
        user[field]?.toString().toLowerCase().includes(search))
    );
  };

  const filteredUsers = getFilteredUsers();
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <i className="bi bi-arrow-down-up text-muted ms-1"></i>;
    return sortConfig.direction === 'asc'
      ? <i className="bi bi-arrow-up text-primary ms-1"></i>
      : <i className="bi bi-arrow-down text-primary ms-1"></i>;
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisible = 8;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);

    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>

          {start > 1 && (
            <>
              <li className="page-item"><button className="page-link" onClick={() => paginate(1)}>1</button></li>
              {start > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
            </>
          )}

          {pages.map(num => (
            <li key={num} className={`page-item ${currentPage === num ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(num)}>{num}</button>
            </li>
          ))}

          {end < totalPages && (
            <>
              {end < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
              <li className="page-item"><button className="page-link" onClick={() => paginate(totalPages)}>{totalPages}</button></li>
            </>
          )}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  // Fungsi untuk membuka modal detail
  const handleShowDetailModal = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  // UI Loading State
  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
              <div className="text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 text-muted">Memuat Data Pengguna...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">

          <div className="d-flex justify-content-between align-items-center pt-3 pb-2 mb-4 border-bottom">
            <h1 className="h2"><i className="bi bi-people-fill me-2"></i>Daftar Pengguna</h1>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}

          {/* Search */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari NIK, nama, atau nomor telepon..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
                {searchTerm && (
                  <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-6 text-end">
              <span className="badge bg-primary fs-6 me-2">
                <i className="bi bi-people me-1"></i> Total: {filteredUsers.length}
              </span>
              <span className="text-muted small">dari {users.length} pengguna</span>
            </div>
          </div>

          {/* Table */}
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th onClick={() => requestSort('nik')} style={{ cursor: 'pointer' }} className="text-nowrap">
                        <i className="bi bi-card-text me-1"></i>NIK {renderSortIcon('nik')}
                      </th>
                      <th onClick={() => requestSort('nama_lengkap')} style={{ cursor: 'pointer' }} className="text-nowrap">
                        <i className="bi bi-person me-1"></i>Nama Lengkap {renderSortIcon('nama_lengkap')}
                      </th>
                      <th onClick={() => requestSort('no_telepon')} style={{ cursor: 'pointer' }} className="text-nowrap">
                        <i className="bi bi-telephone me-1"></i>No. Telepon {renderSortIcon('no_telepon')}
                      </th>
                      <th className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? currentItems.map(user => (
                      <tr key={user.id}>
                        <td><span className="fw-bold text-primary">{user.nik || '-'}</span></td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle me-2"><i className="bi bi-person-fill"></i></div>
                            <span className="fw-semibold">{user.nama_lengkap || '-'}</span>
                          </div>
                        </td>
                        <td><span className="text-muted">{user.no_telepon || '-'}</span></td>
                        <td className="text-center">
                          <Button
                            variant="outline-info"
                            size="sm"
                            title="Detail Pengguna"
                            onClick={() => handleShowDetailModal(user)}
                          >
                            <Eye /> Detail
                          </Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">
                          <i className="bi bi-inbox display-4 d-block mb-3"></i>
                          <h5>Tidak ada data pengguna</h5>
                          <p>{searchTerm ? `Tidak ditemukan pengguna dengan kata kunci "${searchTerm}"` : 'Belum ada pengguna yang terdaftar'}</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {currentItems.length > 0 && (
            <div className="row mt-4">
              <div className="col-md-6">
                <p className="text-muted mb-0">
                  Menampilkan {indexOfFirstItem + 1} - {indexOfFirstItem + currentItems.length} dari {filteredUsers.length} pengguna
                </p>
              </div>
              <div className="col-md-6">{renderPagination()}</div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Detail Pengguna */}
      <UserDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        user={selectedUser}
      />

      {/* Custom styles */}
      <style jsx>{`
        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 123, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default Pengguna;