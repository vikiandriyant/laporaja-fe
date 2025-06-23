import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Badge,
  InputGroup,
  Pagination,
} from "react-bootstrap";
import { Pencil, Trash, Plus } from "react-bootstrap-icons";
import Sidebar from "../../../shared/sidebar";
import {
  getAllKategori,
  createKategori,
  updateKategori,
  deleteKategori,
} from "../../../_services/kategori";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const KategoriAdmin = () => {
  const [kategori, setKategori] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ nama_kategori: "" });

  const itemsPerPage = 8;

  // Fetch data kategori
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllKategori();
        setKategori(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Gagal memuat data kategori");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler untuk perubahan form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Buka modal untuk tambah kategori baru
  const openCreateModal = () => {
    setFormData({ nama_kategori: "" });
    setSelectedKategori(null);
    setShowModal(true);
  };

  // Buka modal untuk edit kategori
  const openEditModal = (kategori) => {
    setSelectedKategori(kategori);
    setFormData({ nama_kategori: kategori.nama_kategori });
    setShowModal(true);
  };

  // Konfirmasi hapus kategori
  const confirmDelete = (id, nama) => {
    MySwal.fire({
      title: "Konfirmasi Hapus",
      html: `Yakin ingin menghapus kategori <strong>"${nama}"</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "btn btn-danger me-2",
        cancelButton: "btn btn-secondary",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  // Proses hapus kategori
  const handleDelete = async (id) => {
    try {
      await deleteKategori(id);
      
      // Update state
      setKategori(kategori.filter(kategori => kategori.kategori_id !== id));
      
      // Notifikasi sukses
      MySwal.fire({
        title: "Berhasil!",
        text: "Kategori berhasil dihapus",
        icon: "success",
        customClass: {
          confirmButton: "btn btn-success",
        },
        buttonsStyling: false,
      });
    } catch (err) {
      console.error("Error deleting category:", err);
      
      // Notifikasi error
      MySwal.fire({
        title: "Gagal!",
        text: "Gagal menghapus kategori",
        icon: "error",
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });
    }
  };

  // Simpan data (tambah/edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Dapatkan user ID dari localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        throw new Error("User information not found");
      }
      
      // Tambahkan user_id ke payload
      const payload = {
        ...formData,
        users_user_id: user.id
      };

      if (selectedKategori) {
        // Update kategori
        await updateKategori(selectedKategori.kategori_id, payload);
        
        // Update state
        setKategori(kategori.map(kat => 
          kat.kategori_id === selectedKategori.kategori_id 
            ? { ...kat, nama_kategori: formData.nama_kategori } 
            : kat
        ));
      } else {
        // Tambah kategori baru
        const response = await createKategori(payload);
        
        // Tambahkan user data ke response untuk ditampilkan di tabel
        const newKategori = {
          ...response.data,
          user: {
            nama_lengkap: user.nama_lengkap
          }
        };
        
        setKategori([...kategori, newKategori]);
      }
      
      setShowModal(false);
      
      // Notifikasi sukses
      MySwal.fire({
        title: "Berhasil!",
        text: `Kategori berhasil ${selectedKategori ? "diperbarui" : "ditambahkan"}`,
        icon: "success",
        customClass: {
          confirmButton: "btn btn-success",
        },
        buttonsStyling: false,
      });
    } catch (err) {
      console.error("Error saving category:", err);
      
      // Tampilkan pesan error yang lebih spesifik
      let errorMessage = `Gagal ${selectedKategori ? "memperbarui" : "menambahkan"} kategori`;
      
      if (err.response?.data?.errors) {
        errorMessage = Object.values(err.response.data.errors).join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      MySwal.fire({
        title: "Gagal!",
        text: errorMessage,
        icon: "error",
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });
    }
  };

  // Filter dan pagination
  const filtered = kategori.filter(kategori => 
    Object.values(kategori).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Render loading state
  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
              <div className="text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 text-muted">Memuat data kategori...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <div className="alert alert-danger">{error}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center pt-3 pb-2 mb-4 border-bottom">
            <h1 className="h2">
              <i className="bi bi-tags-fill me-2"></i>Kelola Kategori
            </h1>
          </div>

          {/* Search Box + Add Button */}
          <div className="row mb-4">
            <div className="col-md-8">
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Cari kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                )}
              </InputGroup>
            </div>
            <div className="col-md-4 text-end">
              <Button variant="primary" onClick={openCreateModal}>
                <Plus className="me-1" /> Tambah Kategori
              </Button>
            </div>
          </div>

          {/* Info Total */}
          <div className="d-flex justify-content-end mb-3">
            <Badge bg="primary" className="fs-6">
              <i className="bi bi-tag me-1"></i> Total: {filtered.length}
            </Badge>
          </div>

          {/* Table */}
          <div className="card shadow-sm">
            <div className="card-body table-responsive rounded px-3 py-2">
              <Table hover>
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nama Kategori</th>
                    <th>Dibuat Oleh</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((kategori) => (
                      <tr key={kategori.kategori_id}>
                        <td>{kategori.kategori_id}</td>
                        <td>{kategori.nama_kategori}</td>
                        <td>
                          {kategori.user?.nama_lengkap ? (
                            <div>{kategori.user.nama_lengkap}</div>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => openEditModal(kategori)}
                            title="Edit"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Hapus"
                            onClick={() => confirmDelete(kategori.kategori_id, kategori.nama_kategori)}
                          >
                            <Trash />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        <i className="bi bi-tag me-2"></i>
                        Tidak ada data kategori ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.Prev 
                      disabled={currentPage === 1} 
                      onClick={() => setCurrentPage(currentPage - 1)} 
                    />
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Pagination.Item>
                    ))}
                    
                    <Pagination.Next 
                      disabled={currentPage === totalPages} 
                      onClick={() => setCurrentPage(currentPage + 1)} 
                    />
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Form */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedKategori ? "Edit Kategori" : "Tambah Kategori Baru"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Kategori</Form.Label>
              <Form.Control
                type="text"
                name="nama_kategori"
                value={formData.nama_kategori}
                onChange={handleInputChange}
                placeholder="Masukkan nama kategori"
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => setShowModal(false)}
              >
                Batal
              </Button>
              <Button variant="primary" type="submit">
                {selectedKategori ? "Simpan Perubahan" : "Tambah Kategori"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default KategoriAdmin;