import { Modal, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";

export default function ModalDetailLaporan({ show, handleClose, selectedReport }) {
    const navigate = useNavigate();
    const statusLabels = {
        "perlu ditinjau": "Perlu Ditinjau",
        "dalam proses": "Dalam Proses",
        "selesai": "Selesai",
        "ditolak": "Ditolak",
    };

    if (!selectedReport) return null;

    function formatDate(dateStr) {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

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

    const handleEdit = () => {
        handleClose();
        // Navigate to edit page with the report data
        navigate(`/Lapor/edit/${selectedReport.riwayat_id}`, {
            state: {
                reportData: selectedReport,
                isEdit: true
            }
        });
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header
                closeButton
                style={{
                    background: "linear-gradient(135deg, #0d6efd 0%, #6610f2 50%, #0dcaf0 100%)",
                    color: "white",
                    border: "none"
                }}
            >
                <Modal.Title style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                    {selectedReport.judul || "Detail Laporan"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "2rem" }}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <strong style={{ color: "#6c757d" }}>ID Riwayat:</strong>
                            <div style={{
                                background: "linear-gradient(45deg, #f8f9fa, #e9ecef)",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                marginTop: "4px",
                                fontFamily: "monospace"
                            }}>
                                {selectedReport.jenis === 'laporan' ? 'RPT' : 'LTR'}-{selectedReport.riwayat_id}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <strong style={{ color: "#6c757d" }}>Tanggal Dibuat:</strong>
                            <div style={{ marginTop: "4px" }}>
                                <i className="fa-solid fa-calendar-days me-2" style={{ color: "#0d6efd" }}></i>
                                {formatDate(selectedReport.created_at)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <strong style={{ color: "#6c757d" }}>Jenis:</strong>
                            <div style={{ marginTop: "8px" }}>
                                <Badge
                                    bg="primary"
                                    style={{
                                        fontSize: "0.9rem",
                                        padding: "8px 16px",
                                        borderRadius: "12px",
                                        textTransform: "capitalize"
                                    }}
                                >
                                    {selectedReport.jenis}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <strong style={{ color: "#6c757d" }}>Kategori:</strong>
                            <div style={{ marginTop: "8px" }}>
                                <span
                                    className="badge"
                                    style={{
                                        background: "linear-gradient(45deg, #0dcaf0 0%, #6f42c1 100%)",
                                        color: "white",
                                        fontSize: "0.9rem",
                                        padding: "8px 16px",
                                        borderRadius: "12px"
                                    }}
                                >
                                    {getCategoryName(selectedReport)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <strong style={{ color: "#6c757d" }}>Status:</strong>
                            <div style={{ marginTop: "8px" }}>
                                <span
                                    className="badge"
                                    style={{
                                        background: getStatusBadgeStyle(selectedReport.status),
                                        color: "white",
                                        fontSize: "0.9rem",
                                        padding: "8px 16px",
                                        borderRadius: "12px"
                                    }}
                                >
                                    {statusLabels[selectedReport.status] || selectedReport.status}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                {selectedReport?.laporan?.lokasi_kejadian ? (
                    <p className="text-muted small mb-2">
                        <i className="fa-solid fa-location-dot me-2" style={{ color: "#dc3545" }}></i>
                        {selectedReport.laporan.lokasi_kejadian}
                    </p>
                ) : selectedReport?.surat?.jenis_surat ? (
                    <p className="text-muted small mb-2">
                        <i className="fa-solid fa-envelope me-2" style={{ color: "#0d6efd" }}></i>
                        {selectedReport.surat.jenis_surat}
                    </p>
                ) : null}


                <div className="mb-3">
                    <strong style={{ color: "#6c757d" }}>Deskripsi:</strong>
                    <div style={{
                        marginTop: "8px",
                        padding: "16px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        border: "1px solid #e9ecef",
                        lineHeight: "1.6"
                    }}>
                        {selectedReport.deskripsi || "Tidak ada deskripsi"}
                    </div>
                </div>

                {selectedReport.komentar && (
                    <div className="mb-3">
                        <strong style={{ color: "#6c757d" }}>Komentar Admin:</strong>
                        <div style={{
                            marginTop: "8px",
                            padding: "16px",
                            backgroundColor: "#e7f3ff",
                            borderRadius: "8px",
                            border: "1px solid #b8daff",
                            lineHeight: "1.6"
                        }}>
                            <i className="fa-solid fa-comment me-2" style={{ color: "#0d6efd" }}></i>
                            {selectedReport.komentar}
                        </div>
                    </div>
                )}

                {selectedReport.file_url && (
                    <div className="mb-3">
                        <strong style={{ color: "#6c757d" }}>Media Terlampir:</strong>
                        <div style={{
                            marginTop: "8px",
                            padding: "12px 16px",
                            background: "linear-gradient(45deg, #e3f2fd, #f3e5f5)",
                            borderRadius: "8px",
                            border: "1px solid #bbdefb"
                        }}>
                            <i
                                className="fa-solid fa-paperclip me-2"
                                style={{
                                    background: "linear-gradient(45deg, #0d6efd, #6610f2)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text"
                                }}
                            ></i>
                            <a
                                href={selectedReport.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none", color: "#0d6efd" }}
                            >
                                Lihat File Terlampir
                            </a>
                        </div>
                    </div>
                )}

            </Modal.Body>
            <Modal.Footer style={{
                background: "#f8f9fa",
                border: "none",
                padding: "1rem 2rem"
            }}>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                    style={{
                        background: "linear-gradient(135deg, #6c757d 0%, #495057 100%)",
                        border: "none",
                        padding: "10px 24px",
                        borderRadius: "6px",
                        fontWeight: "500"
                    }}
                >
                    Tutup
                </Button>
                {/* Edit button */}
                {selectedReport.status === "perlu ditinjau" ? (
                    <Button
                        variant="primary"
                        onClick={handleEdit}
                        style={{
                            background: "linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)",
                            border: "none",
                            padding: "10px 24px",
                            borderRadius: "6px",
                            fontWeight: "500"
                        }}
                    >
                        <i className="fa-solid fa-pen-to-square me-2"></i> Edit
                    </Button>
                ) : null}
            </Modal.Footer>
        </Modal>
    );
}