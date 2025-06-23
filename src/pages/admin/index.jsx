import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "../../shared/sidebar";
import { getAllRiwayat } from "../../_services/riwayat-laporan";
import { isValid, parseISO, format } from "date-fns";
import ModalDetailRiwayat from "../../shared/ModalDetailRiwayat";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };


  // Fetch data dari database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const riwayatData = await getAllRiwayat().catch(err => {
          console.error("Error fetching riwayat:", err);
          return [];
        });
  
        setReports(Array.isArray(riwayatData) ? riwayatData : []);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError("Gagal memuat data. Periksa koneksi server.");
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
              <div className="text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 text-muted">Memuat Data...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Hitung statistik laporan dengan safe fallbacks
  const totalLaporan = Array.isArray(reports) ? reports.length : 0;
  const totalUsers = Array.isArray(reports)
  ? new Set(reports.map(r => r?.users_user_id).filter(Boolean)).size
  : 0;

  // Data untuk grafik - hitung berdasarkan status dengan safe handling
  // Hitung statusCounts dulu
  const statusCounts = Array.isArray(reports)
    ? reports.reduce((acc, report) => {
        if (report && report.status) {
          acc[report.status] = (acc[report.status] || 0) + 1;
        }
        return acc;
      }, {})
    : {};

  // Hitung persentase per status
  const statusPersentase = {};
  if (totalLaporan > 0) {
    Object.entries(statusCounts).forEach(([status, count]) => {
      statusPersentase[status] = ((count / totalLaporan) * 100).toFixed(0);
    });
  }

  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Jumlah Laporan",
        data: Object.values(statusCounts),
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)", // Dalam Proses
          "rgba(75, 192, 192, 0.7)", // Selesai
          "rgba(255, 206, 86, 0.7)", // Perlu Ditinjau
          "rgba(255, 99, 132, 0.7)", // Ditolak
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Distribusi Status Laporan",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Format tanggal untuk tampilan
  const formatDate = (t) => {
    if (!t) return "-";
    const safe = t.includes("T") ? t : t.replace(" ", "T");
    const d = parseISO(safe);
    return isValid(d) ? format(d, "dd/MM/yyyy HH:mm") : "-";
  };
  
  // Urutkan laporan berdasarkan created_at (terbaru di atas)
  const sortedReports = Array.isArray(reports)
    ? [...reports]
        .filter((r) => r?.created_at) // filter yang tidak punya tanggal
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10)
    : [];

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4 bg-light">
          {/* Error Alert */}
          {error && (
            <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
                aria-label="Close"
              ></button>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Dashboard Admin</h2>
            <div className="d-flex gap-3">
              <div className="bg-primary text-white p-3 rounded shadow-sm">
                <div className="d-flex align-items-center">
                  <div>
                    <small className="opacity-75">Total Laporan</small>
                    <h3 className="mb-0 fw-bold">{totalLaporan}</h3>
                  </div>
                  <i className="bi bi-file-text-fill ms-3 fs-2 opacity-75"></i>
                </div>
              </div>
              <div className="bg-success text-white p-3 rounded shadow-sm">
                <div className="d-flex align-items-center">
                  <div>
                    <small className="opacity-75">Total Pengguna</small>
                    <h3 className="mb-0 fw-bold">{totalUsers}</h3>
                  </div>
                  <i className="bi bi-people-fill ms-3 fs-2 opacity-75"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Statistik Utama */}
          <div className="row mb-4">
            <div className="col-md-8">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  {Object.keys(statusCounts).length > 0 ? (
                    <Bar data={chartData} options={chartOptions} />
                  ) : (
                    <div className="d-flex flex-column justify-content-center align-items-center h-100 py-5">
                      <i className="bi bi-bar-chart-fill text-muted mb-3" style={{fontSize: '3rem'}}></i>
                      <p className="text-muted mb-0">Belum ada data laporan untuk ditampilkan</p>
                      <small className="text-muted">Grafik akan muncul setelah ada laporan masuk</small>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title d-flex align-items-center">
                    <i className="bi bi-graph-up me-2 text-success"></i>
                    Progress Laporan
                  </h5>
                  <div className="progress mt-4 mb-3" style={{ height: "25px", position: "relative" }}>
                    {Object.entries(statusPersentase).map(([status, percent]) => (
                      <div
                        key={status}
                        className={`progress-bar bg-${getStatusColor(status)}`}
                        role="progressbar"
                        style={{
                          width: `${percent}%`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem"
                        }}
                      >
                        {percent > 5 ? `${percent}%` : null} {/* Sembunyikan teks kalau terlalu kecil */}
                      </div>
                    ))}
                  </div>
                  <div className="list-group list-group-flush">
                    {Object.keys(statusCounts).length > 0 ? (
                      Object.entries(statusCounts).map(([status, count]) => (
                        <div
                          key={status}
                          className="list-group-item d-flex justify-content-between align-items-center px-0 border-0"
                        >
                          <div className="d-flex align-items-center">
                            <span
                              className={`badge bg-${getStatusColor(status)} me-2`}
                              style={{width: '12px', height: '12px'}}
                            >
                              &nbsp;
                            </span>
                            {status}
                          </div>
                          <span className="badge bg-primary rounded-pill">
                            {count}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="list-group-item text-center text-muted px-0 border-0 py-4">
                        <i className="bi bi-inbox mb-2 d-block" style={{fontSize: '2rem'}}></i>
                        Belum ada data status
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Laporan Terbaru */}
          <div className="card shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0 d-flex align-items-center">
                <i className="bi bi-clock-history me-2 text-primary"></i>
                Laporan Terbaru
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 px-4 py-3">Judul Laporan</th>
                      <th className="border-0 py-3">Tanggal</th>
                      <th className="border-0 py-3">Status</th>
                      <th className="border-0 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedReports.length > 0 ? (
                      sortedReports.map((report, index) => (
                        <tr key={report?.id || index}>
                          <td className="px-4 py-3">
                            <div className="fw-medium">
                              {report?.judul || report?.title || "Tanpa Judul"}
                            </div>
                            {report?.deskripsi && (
                              <small className="text-muted">
                                {report.deskripsi.length > 50 
                                  ? report.deskripsi.substring(0, 50) + "..." 
                                  : report.deskripsi}
                              </small>
                            )}
                          </td>
                          <td className="py-3">
                            <small className="text-muted">
                              {formatDate(report?.created_at || report?.tanggal || report?.date)}
                            </small>
                          </td>
                          <td className="py-3">
                            <span
                              className={`badge bg-${getStatusColor(
                                report?.status
                              )}`}
                            >
                              {report?.status || "Tidak Diketahui"}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                          <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openModal(report)}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-5">
                          <i className="bi bi-inbox mb-3 d-block" style={{fontSize: '3rem'}}></i>
                          <div>Belum ada laporan</div>
                          <small className="text-muted">Laporan yang masuk akan ditampilkan di sini</small>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      <ModalDetailRiwayat
        show={showModal}
        item={selectedItem}
        onHide={() => setShowModal(false)}
        readOnly={true}
      />
    </div>
  );
};



// Helper untuk warna status
const getStatusColor = (status) => {
  if (!status) return "secondary";

  const normalized = status.toLowerCase();

  switch (normalized) {
    case "dalam proses":
      return "info";
    case "perlu ditinjau":
      return "warning";
    case "selesai":
      return "success";
    case "ditolak":
      return "danger";
    default:
      return "secondary";
  }
};

export default AdminDashboard;