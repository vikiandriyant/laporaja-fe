import React, { useState, useEffect } from "react";
import { Modal, Form, Badge, Image, ButtonGroup, Button } from "react-bootstrap";
import { Check2, X } from "react-bootstrap-icons";
import { isValid, parseISO, format } from "date-fns";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);


// Helper functions
const formatTanggal = (t) => {
  if (!t) return "-";
  const safe = t.includes("T") ? t : t.replace(" ", "T");
  const d = parseISO(safe);
  return isValid(d) ? format(d, "dd/MM/yyyy HH:mm") : "-";
};

const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

const getFileType = (filename) => {
  if (!filename) return 'unknown';
  const extension = getFileExtension(filename);
  
  // Image files
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
    return 'image';
  }
  // Video files
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
    return 'video';
  }
  // Audio files
  if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension)) {
    return 'audio';
  }
  // PDF files
  if (extension === 'pdf') {
    return 'pdf';
  }
  // Document files
  if (['doc', 'docx'].includes(extension)) {
    return 'document';
  }
  // Spreadsheet files
  if (['xls', 'xlsx', 'csv'].includes(extension)) {
    return 'spreadsheet';
  }
  // Presentation files
  if (['ppt', 'pptx'].includes(extension)) {
    return 'presentation';
  }
  
  return 'unknown';
};

const getFileIcon = (fileType) => {
  const iconMap = {
    'pdf': 'bi-file-earmark-pdf-fill text-danger',
    'document': 'bi-file-earmark-word-fill text-primary',
    'spreadsheet': 'bi-file-earmark-excel-fill text-success',
    'presentation': 'bi-file-earmark-ppt-fill text-warning',
    'audio': 'bi-file-earmark-music-fill text-info',
    'video': 'bi-file-earmark-play-fill text-dark',
    'unknown': 'bi-file-earmark-fill text-secondary'
  };
  
  return iconMap[fileType] || iconMap['unknown'];
};

const STATUS_OPTIONS = [
  { key: "perlu ditinjau", label: "Tinjau", variant: "warning" },
  { key: "dalam proses", label: "Proses", variant: "info" },
  { key: "selesai", label: "Selesai", variant: "success" },
  { key: "ditolak", label: "Tolak", variant: "danger" },
];

const ModalDetailRiwayat = ({ 
  show, 
  item, 
  onHide, 
  onUpdate, 
  isAdmin = false,
  readOnly = false 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (item) {
      setComment(item.komentar ?? "");
      setSelectedStatus(item.status);
    }
  }, [item]);

  const FileViewer = ({ fileUrl, fileType, fileName, style = {} }) => {
    switch (fileType) {
      case 'image':
        return (
          <Image
            src={fileUrl}
            alt={fileName}
            fluid
            className="rounded"
            style={{ maxHeight: "300px", ...style }}
            onError={(e) => {
              console.log('Image load error:', e.target.src);
              e.target.style.display = 'none';
            }}
          />
        );
      
      case 'video':
        return (
          <video
            controls
            className="rounded"
            style={{ maxHeight: "300px", width: "100%", ...style }}
          >
            <source src={fileUrl} type={`video/${getFileExtension(fileName)}`} />
            Browser Anda tidak mendukung video HTML5.
          </video>
        );
      
      case 'audio':
        return (
          <div className="text-center py-4">
            <i className="bi bi-file-earmark-music-fill fs-1 text-info mb-3"></i>
            <audio controls className="w-100">
              <source src={fileUrl} type={`audio/${getFileExtension(fileName)}`} />
              Browser Anda tidak mendukung audio HTML5.
            </audio>
            <p className="mt-2 mb-0">{fileName}</p>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="text-center py-4">
            <i className="bi bi-file-earmark-pdf-fill fs-1 text-danger mb-3"></i>
            <p className="mb-2">{fileName}</p>
            <div className="d-flex gap-2 justify-content-center">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => window.open(fileUrl, '_blank')}
              >
                <i className="bi bi-eye me-1"></i>
                Lihat
              </Button>
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = fileUrl;
                  link.download = fileName;
                  link.click();
                }}
              >
                <i className="bi bi-download me-1"></i>
                Unduh
              </Button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-4">
            <i className={`${getFileIcon(fileType)} fs-1 mb-3`}></i>
            <p className="mb-2">{fileName}</p>
            <p className="text-muted small mb-3">
              File {fileType.toUpperCase()} - {getFileExtension(fileName).toUpperCase()}
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => window.open(fileUrl, '_blank')}
              >
                <i className="bi bi-eye me-1"></i>
                Buka
              </Button>
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = fileUrl;
                  link.download = fileName;
                  link.click();
                }}
              >
                <i className="bi bi-download me-1"></i>
                Unduh
              </Button>
            </div>
          </div>
        );
    }
  };

  const FileThumbnail = ({ fileUrl, fileType, fileName, isActive, onClick }) => {
    const thumbnailStyle = {
      cursor: "pointer",
      border: isActive ? "3px solid #0d6efd" : "1px solid #dee2e6",
      width: "80px",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    };

    if (fileType === 'image') {
      return (
        <div className="thumbnail" onClick={onClick} style={thumbnailStyle}>
          <Image
            src={fileUrl}
            alt={`Thumbnail ${fileName}`}
            width={80}
            height={60}
            className="object-fit-cover rounded"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNSAyMEg1NVY0MEgyNVYyMFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+';
            }}
          />
        </div>
      );
    }

    return (
      <div 
        className="thumbnail rounded d-flex flex-column align-items-center justify-content-center bg-light" 
        onClick={onClick} 
        style={thumbnailStyle}
      >
        <i className={`${getFileIcon(fileType)} fs-6`}></i>
        <small className="text-truncate" style={{ fontSize: '10px', width: '70px' }}>
          {getFileExtension(fileName).toUpperCase()}
        </small>
      </div>
    );
  };

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

  const getStatusBadge = (status) => {
    const color = getStatusColor(status);
    return <Badge bg={color}>{status.toUpperCase()}</Badge>;
  };

  const getReporterNIK = (laporan) => {
    return laporan?.users?.nik || 
           laporan?.user?.nik || 
           laporan?.users?.NIK || 
           laporan?.user?.NIK || 
           'NIK tidak tersedia';
  };

  const getCategoryName = (laporan) => {
    return laporan?.laporan?.kategori?.nama_kategori || 
           'Kategori tidak diketahui';
  };

  const getMediaFiles = (laporan) => {
    if (laporan?.media && Array.isArray(laporan.media) && laporan.media.length > 0) {
      return laporan.media;
    }
    
    if (laporan?.file) {
      if (typeof laporan.file === 'string') {
        return [laporan.file];
      }
      if (Array.isArray(laporan.file)) {
        return laporan.file;
      }
    }
    
    if (laporan?.files && Array.isArray(laporan.files)) {
      return laporan.files;
    }
    
    return null;
  };

  const handleSubmit = async () => {
    const confirmChange = await MySwal.fire({
      title: 'Konfirmasi Perubahan?',
      text: "Anda yakin ingin menyimpan perubahan ini?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "btn btn-primary me-2",
        cancelButton: "btn btn-secondary",
    }
    });
  
    if (!confirmChange.isConfirmed) return;
  
    if (onUpdate) {
      try {
        await onUpdate(item.riwayat_id, selectedStatus, comment);
        // Modal akan ditutup melalui callback onHide yang dipanggil dari parent
        await MySwal.fire({
          title: 'Berhasil!',
          text: 'Data berhasil diperbarui.',
          icon: 'success',
          customClass: {
          confirmButton: 'btn btn-success'
          },
          buttonsStyling: false
      });

      if (onHide) {
        onHide();
      }
      
      } catch (error) {
        console.error("Gagal menyimpan perubahan:", error);
        MySwal.fire(
          'Gagal!',
          'Terjadi kesalahan saat menyimpan perubahan.',
          'error'
        );
      }
    }
  };

  if (!item) return null;

  const mediaFiles = getMediaFiles(item);
  const isLaporan = item.jenis === 'laporan' || item.laporan;
  const jenisItem = isLaporan ? 'Laporan' : 'Surat';

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Detail {jenisItem}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h4 className="fw-bold">{item.judul || item.laporan?.judul || item.surat?.judul}</h4>
          <p className="text-muted mb-3">Tanggal Dibuat: {formatTanggal(item.created_at)}</p>

          <div className="row mb-3">
            <div className="col-md-6">
              <h6 className="fw-bold">Status:</h6>
              {getStatusBadge(item.status)}
            </div>
            <div className="col-md-6">
              <h6 className="fw-bold">Pelapor:</h6>
              <p className="mb-0">{getReporterNIK(item)}</p>
            </div>
          </div>

          {isLaporan && (
            <>
              <div className="row mb-3">
                <div className="col-md-6">
                  <h6 className="fw-bold">Kategori:</h6>
                  <p className="mb-0">{getCategoryName(item)}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold">Lokasi Kejadian:</h6>
                  <p className="mb-0">{item.laporan?.lokasi_kejadian || '-'}</p>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <h6 className="fw-bold">Tanggal Kejadian:</h6>
                  <p className="mb-0">{formatTanggal(item.laporan?.tanggal_kejadian) || '-'}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold">Kontak:</h6>
                  <p className="mb-0">{item.kontak || '-'}</p>
                </div>
              </div>
            </>
          )}

          {!isLaporan && (
            <div className="row mb-3">
              <div className="col-md-6">
                <h6 className="fw-bold">Jenis Surat:</h6>
                <p className="mb-0">{item.surat?.jenis_surat || 'Tidak diketahui'}</p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold">Kontak:</h6>
                <p className="mb-0">{item.kontak || '-'}</p>
              </div>
            </div>
          )}

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Deskripsi</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={item.deskripsi || item.isi || ""}
              readOnly
              className="bg-light"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Media/File</Form.Label>
            {mediaFiles && mediaFiles.length > 0 ? (
              <div className="media-gallery">
                <div className="mb-3 text-center">
                  {(() => {
                    const currentFile = mediaFiles[activeIndex];
                    const fileName = currentFile ? currentFile.split('/').pop() : '';
                    const fileType = getFileType(fileName);
                    
                    return (
                      <FileViewer
                        fileUrl={currentFile}
                        fileType={fileType}
                        fileName={fileName}
                      />
                    );
                  })()}
                </div>
                
                {mediaFiles.length > 1 && (
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    {mediaFiles.map((media, index) => {
                      const fileName = media ? media.split('/').pop() : '';
                      const fileType = getFileType(fileName);
                      
                      return (
                        <FileThumbnail
                          key={index}
                          fileUrl={media}
                          fileType={fileType}
                          fileName={fileName}
                          isActive={activeIndex === index}
                          onClick={() => setActiveIndex(index)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-3 bg-light rounded">
                <i className="bi bi-file-earmark fs-1 text-muted"></i>
                <p className="mt-2 mb-0">Tidak ada file yang disertakan</p>
                {item.file && (
                  <small className="text-muted d-block">
                    File: {item.file}
                  </small>
                )}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Komentar {isAdmin ? 'Admin' : ''}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => !readOnly && setComment(e.target.value)}
              placeholder={readOnly ? "Tidak ada komentar" : "Tulis komentar…"}
              readOnly={readOnly}
            />
          </Form.Group>

          {isAdmin && onUpdate && (
            <div className="mb-3">
              <h6 className="fw-bold">Ubah Status</h6>
              <ButtonGroup className="flex-wrap gap-2">
                {STATUS_OPTIONS.map(({ key, label, variant }) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={selectedStatus === key ? variant : `outline-${variant}`}
                    onClick={() => setSelectedStatus(key)}
                  >
                    {label}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {isAdmin && onUpdate && (
          <Button 
            variant="primary" 
            onClick={handleSubmit}
          >
            Kirim
          </Button>
        )}
        <Button variant="secondary" onClick={onHide}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetailRiwayat;