import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Form, Card, Badge, Modal, Spinner, Alert } from 'react-bootstrap';
import Header from "../../../shared/header";
import Footer from "../../../shared/footer";
import { useNavigate } from "react-router";
import ModalDetailLaporan from "../../../components/modaldetaillapor";
import { getAllRiwayat } from "../../../_services/riwayat-laporan";


const statusLabels = {
    "perlu ditinjau": "Perlu Ditinjau",
    "dalam proses": "Dalam Proses",
    "selesai": "Selesai",
    "ditolak": "Ditolak",
};


export default function RiwayatUser() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [jenisFilter, setJenisFilter] = useState("");
    const [reportsData, setReportsData] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    // Fetch data dari API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getAllRiwayat();
                setReportsData(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching riwayat laporan:", err);
                setError("Gagal memuat data riwayat laporan. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter data
    useEffect(() => {
        if (!reportsData.length) {
            setFilteredReports([]);
            return;
        }

        const filtered = reportsData.filter((report) => {
            const matchesSearch =
                report.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase());


            const matchesCategory = !categoryFilter ||
                (report.laporan?.kategori?.kategori_id?.toString() === categoryFilter);

            const matchesStatus = !statusFilter || report.status === statusFilter;

            const matchesJenis = !jenisFilter || report.jenis === jenisFilter;

            return matchesSearch && matchesCategory && matchesStatus && matchesJenis;
        });

        setFilteredReports(filtered);
    }, [searchTerm, categoryFilter, statusFilter, jenisFilter, reportsData]);

    const renderStats = () => {
        const stats = reportsData.reduce(
            (acc, report) => {
                acc.total++;
                const status = report.status || "perlu ditinjau";
                acc[status.replace(" ", "_")] = (acc[status.replace(" ", "_")] || 0) + 1;
                return acc;
            },
            { total: 0, perlu_ditinjau: 0, dalam_proses: 0, selesai: 0, ditolak: 0 }
        );

        return (
            <Row className="text-center my-4">
                <Col>
                    <h5>Total Laporan</h5>
                    <h3 className="text-dark">{stats.total}</h3>
                </Col>
                <Col>
                    <h5>Menunggu</h5>
                    <h3 className="text-dark">{stats.perlu_ditinjau}</h3>
                </Col>
                <Col>
                    <h5>Diproses</h5>
                    <h3 className="text-dark">{stats.dalam_proses}</h3>
                </Col>
                <Col>
                    <h5>Selesai</h5>
                    <h3 className="text-dark">{stats.selesai}</h3>
                </Col>
                <Col>
                    <h5>Ditolak</h5>
                    <h3 className="text-dark">{stats.ditolak}</h3>
                </Col>
            </Row>
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleCardClick = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedReport(null);
    };

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case "dalam proses":
                return "linear-gradient(45deg, #ffc107, #fd7e14)";
            case "perlu ditinjau":
                return "linear-gradient(45deg, #6c757d, #adb5bd)";
            case "selesai":
                return "linear-gradient(45deg, #198754, #20c997)";
            case "ditolak":
                return "linear-gradient(45deg, #dc3545, #ff073a)";
            default:
                return "#6c757d";
        }
    };

    const getCategoryName = (report) => {
        if (report.laporan?.kategori?.nama_kategori) {
            return report.laporan.kategori.nama_kategori;
        }
        return report.jenis === 'surat' ? 'Surat' : 'Umum';
    };

    const getUniqueCategories = () => {
        const categories = reportsData
            .filter(report => report.laporan?.kategori)
            .map(report => ({
                id: report.laporan.kategori.kategori_id,
                name: report.laporan.kategori.nama_kategori
            }));

        // Remove duplicates
        const uniqueCategories = categories.filter((category, index, self) =>
            index === self.findIndex(c => c.id === category.id)
        );

        return uniqueCategories;
    };

    if (loading) {
        return (
            <>
                <Container className="my-5 text-center">
                    <Spinner animation="border" role="status" className="me-2" />
                </Container>
            </>
        );
    }

    return (
        <>
            <Container className="my-5">
                {error && (
                    <Alert variant="danger" className="mb-4">
                        <i className="fa-solid fa-exclamation-triangle me-2"></i>
                        {error}
                        <Button
                            variant="outline-danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => window.location.reload()}
                        >
                            Muat Ulang
                        </Button>
                    </Alert>
                )}

                {renderStats()}

                <Row className="my-4 align-items-end">
                    <Col md>
                        <Form.Group controlId="searchInput">
                            <Form.Label>Cari Laporan</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ketik kata kunci..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group controlId="jenisFilter">
                            <Form.Label>Jenis</Form.Label>
                            <Form.Select
                                value={jenisFilter}
                                onChange={(e) => setJenisFilter(e.target.value)}
                            >
                                <option value="">Semua Jenis</option>
                                <option value="laporan">Laporan</option>
                                <option value="surat">Surat</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group controlId="categoryFilter">
                            <Form.Label>Kategori</Form.Label>
                            <Form.Select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">Semua Kategori</option>
                                {getUniqueCategories().map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group controlId="statusFilter">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">Semua Status</option>
                                {Object.entries(statusLabels).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md="auto">
                        <Button
                            className="w-100"
                            style={{
                                background: "linear-gradient(135deg, #0d6efd 0%, #6610f2 50%, #0dcaf0 100%)"
                            }}
                            type="button"
                            onClick={() => navigate("/Lapor")}
                        >
                            <i className="fa-solid fa-plus"></i> Buat Laporan Baru
                        </Button>
                    </Col>
                </Row>

                <Row>
                    {filteredReports.length === 0 ? (
                        <Col className="text-center text-muted py-5">
                            <div style={{ fontSize: "3rem" }}>
                                <i className="fa-solid fa-inbox"></i>
                            </div>
                            <h4 className="mt-3">Tidak ada laporan</h4>
                            <p>
                                {reportsData.length === 0
                                    ? "Anda belum memiliki laporan apapun."
                                    : "Tidak ada laporan yang sesuai dengan kriteria pencarian Anda."
                                }
                            </p>
                        </Col>
                    ) : (
                        filteredReports.map((report, index) => (
                            <Col md={6} lg={4} key={report.riwayat_id || index} className="mb-4">
                                <Card
                                    onClick={() => handleCardClick(report)}
                                    style={{ cursor: "pointer" }}
                                    className="h-100 shadow-sm"
                                >
                                    <Card.Header
                                        className="text-white"
                                        style={{
                                            background: "linear-gradient(135deg, #0d6efd 0%, #6610f2 50%, #0dcaf0 100%)"
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <small>
                                                    {report.jenis === 'laporan' ? 'RPT' : 'LTR'}-{report.riwayat_id || index + 1}
                                                </small>

                                            </div>
                                        </div>
                                        <h5 className="mt-2 mb-1">{report.judul}</h5>
                                        <small>
                                            <i className="fa-solid fa-calendar-days me-1"></i>
                                            {formatDate(report.created_at)}
                                        </small>
                                    </Card.Header>

                                    <Card.Body className="d-flex flex-column">
                                        <div className="mb-2">
                                            <Badge
                                                style={{
                                                    background: "linear-gradient(45deg, #0dcaf0 0%, #6f42c1 100%)",
                                                    color: "white"
                                                }}
                                            >
                                                {getCategoryName(report)}
                                            </Badge>
                                        </div>

                                        {report.laporan?.lokasi_kejadian ? (
                                            <p className="text-muted small mb-2">
                                                <i className="fa-solid fa-location-dot me-2" style={{ color: "#dc3545" }}></i>
                                                {report.laporan.lokasi_kejadian}
                                            </p>
                                        ) : report.surat?.jenis_surat ? (
                                            <p className="text-muted small mb-2">
                                                <i className="fa-solid fa-envelope me-2" style={{ color: "#0d6efd" }}></i>
                                                {report.surat.jenis_surat}
                                            </p>
                                        ) : null}

                                        <p className="flex-grow-1">
                                            {report.deskripsi?.length > 100
                                                ? `${report.deskripsi.substring(0, 100)}...`
                                                : report.deskripsi
                                            }
                                        </p>

                                        {report.komentar ? (
                                            <div className="alert alert-info py-2 small mb-2">
                                                <strong>Komentar:</strong> {report.komentar}
                                            </div>
                                        ) : (
                                            <div className="alert alert-info py-2 small mb-2 text-muted small mb-2">
                                                <i className="fa-regular fa-comment me-1"></i> Belum ada komentar
                                            </div>
                                        )}

                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                            <Badge
                                                style={{
                                                    background: getStatusBadgeStyle(report.status),
                                                    color: "white"
                                                }}
                                            >
                                                {statusLabels[report.status] || report.status}
                                            </Badge>

                                            {report.file_url && (
                                                <span className="text-primary">
                                                    <i className="fa-solid fa-paperclip"></i> Media
                                                </span>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            </Container>

            <ModalDetailLaporan
                show={showModal}
                handleClose={handleCloseModal}
                selectedReport={selectedReport}
            />
        </>
    );
}