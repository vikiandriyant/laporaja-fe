import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Badge,
  ButtonGroup,
} from "react-bootstrap";
import { Trash, Eye } from "react-bootstrap-icons";
import Sidebar from "../../../shared/sidebar";
import { isValid, parseISO, format } from "date-fns";
import {
  getAllRiwayat,
  deleteRiwayat,
  // updateStatusRiwayat, // Hapus import ini jika tidak digunakan di tempat lain di file ini
} from "../../../_services/riwayat-laporan";
import ModalDetailRiwayat from "../../../shared/ModalDetailRiwayat";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

/* -------------------------------------------------------------------------- */
/* Helper util & constant                                                   */
/* -------------------------------------------------------------------------- */

const STATUS_OPTIONS = [
  { key: "selesai", label: "Selesai", variant: "success" },
  { key: "ditolak", label: "Tolak", variant: "danger" },
];

const getStatusBadge = (st) => {
  const opt = STATUS_OPTIONS.find((s) => s.key === st);
  return <Badge bg={opt?.variant ?? "secondary"}>{st.toUpperCase()}</Badge>;
};

const formatTanggal = (t) => {
  if (!t) return "-";
  const safe = t.includes("T") ? t : t.replace(" ", "T");
  const d = parseISO(safe);
  return isValid(d) ? format(d, "dd/MM/yyyy HH:mm") : "-";
};

/* -------------------------------------------------------------------------- */
/* Halaman utama                                                            */
/* -------------------------------------------------------------------------- */

const RiwayatAdmin = () => {
  const [setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [riwayatData, setRiwayatData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentValue, setCommentValue] = useState({});

  const itemsPerPage = 8;

  /* -------------------------- fetch data awal --------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Anda belum login. Silakan login dulu.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const list = await getAllRiwayat();
        setRiwayatData(list);
        // Initialize comment values
        const initialComments = {};
        list.forEach(item => {
          initialComments[item.riwayat_id] = item.komentar || '';
        });
        setCommentValue(initialComments);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* -------------------------- handler util ------------------------------ */
  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };
  const confirmDelete = (id) => {
    setIdToDelete(id);

    MySwal.fire({
      title: "Konfirmasi Hapus",
      text: "Yakin nih mau dihapus datanya?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus Sekarang",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "btn btn-danger me-2",
        cancelButton: "btn btn-secondary",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteConfirmed();
      }
    });
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteRiwayat(idToDelete);

      // Show success notification
      await MySwal.fire({
        title: "Berhasil!",
        text: "Data berhasil dihapus.",
        icon: "success",
        customClass: {
          confirmButton: "btn btn-success",
        },
        buttonsStyling: false,
      });

      // Update state to remove the deleted item
      setRiwayatData((prev) =>
        prev.filter((it) => it.riwayat_id !== idToDelete)
      );
    } catch (err) {
      console.error(err);

      // Show error notification
      await MySwal.fire({
        title: "Gagal!",
        text: "Gagal menghapus data.",
        icon: "error",
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });
    } finally {
      setShowDeleteModal(false);
      setIdToDelete(null);
    }
  };

  /* -------------------------- filter & paging --------------------------- */
  // Filter data hanya dengan status "selesai" atau "ditolak"
  const filteredByStatus = riwayatData.filter(it =>
    it.status === "selesai" || it.status === "ditolak"
  );

  const filtered = filteredByStatus.filter((it) =>
    [
      it.judul,
      it.status,
      it.jenis,
      it.created_at,
      it.jenis === "laporan" && it.laporan?.kategori?.nama_kategori,
      it.jenis === "surat" && it.surat?.jenis_surat,
      it.deskripsi,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Hitung total data dengan status "selesai" atau "ditolak"
  const totalSelesaiDitolak = filteredByStatus.length;

  /* -------------------------- render ----------------------------------- */
  // Loading state
  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "60vh" }}
            >
              <div className="text-center">
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
                <p className="mt-3 text-muted">
                  Memuat Riwayat...
                </p>
              </div>
            </div>
          </main>
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

  /* -------------------------------------------------------------------------- */
  /* Halaman utama (potongan render)                                         */
  /* -------------------------------------------------------------------------- */

  const totalFiltered = filtered.length; // setelah disaring search dan status

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />

        {/* ----------------------------- MAIN -------------------------------- */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          {/* ======= Header ======= */}
          <div className="d-flex justify-content-between align-items-center pt-3 pb-2 mb-4 border-bottom">
            <h1 className="h2"><i className="bi bi-clock-fill me-2"></i>Riwayat Laporan &amp; Surat</h1>
          </div>

          {/* ======= Kotak Cari + Total ======= */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari riwayat…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
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
                <i className="bi bi-clock me-1"></i> Total: {totalFiltered}
              </span>
              <span className="text-muted small">dari {totalSelesaiDitolak} riwayat (selesai/ditolak)</span>
            </div>
          </div>

          {/* ======= Tabel ======= */}
          <div className="card shadow-sm">
            <div className="card-body table-responsive rounded px-3 py-2">
              <Table hover>
                <thead className="table-dark rounded px-3 py-2">
                  <tr>
                    <th>Tanggal</th>
                    <th>Jenis</th>
                    <th>Judul</th>
                    <th>Status</th>
                    <th>Komentar</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.length ? (
                    currentItems.map((it) => (
                      <tr key={it.riwayat_id}>
                        <td>{formatTanggal(it.created_at)}</td>

                        <td>
                          <Badge
                            bg={it.jenis === "laporan" ? "info" : "success"}
                          >
                            {it.jenis.toUpperCase()}
                          </Badge>
                        </td>

                        <td>{it.judul}</td>
                        <td>{getStatusBadge(it.status)}</td>

                        <td>
                          <div className="d-flex flex-column">
                            <Form.Control
                              size="sm"
                              value={commentValue[it.riwayat_id] || ""}
                              placeholder="Komentar…"
                            />
                          </div>
                        </td>

                        <td className="text-center">
                          {/* Hanya menyisakan tombol Detail dan Hapus */}
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => openModal(it)}
                            title="Detail"
                          >
                            <Eye />
                          </Button>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Hapus"
                            onClick={() => confirmDelete(it.riwayat_id)}
                          >
                            <Trash />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="bi bi-clock-history me-2 text-center py-4"
                      >
                        Tidak ada data ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* ======= Pagination ======= */}
              {totalPages > 1 && (
                <nav className="d-flex justify-content-center">
                  <ul className="pagination mb-0">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (n) => (
                        <li
                          key={n}
                          className={`page-item ${
                            n === currentPage && "active"
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(n)}
                          >
                            {n}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* -- Modal detail -- */}
      <ModalDetailRiwayat
        show={showModal}
        item={selectedItem}
        onHide={() => setShowModal(false)}
      />
    </div>
  );
};

export default RiwayatAdmin;