import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormSubmission } from "./hooks/useFormSubmission";
import ModalSukses from "../../../components/modalsukses";

export default function EditForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportData } = location.state || {};
  const [formType] = useState(reportData?.jenis || "laporan");
  const [showModal, setShowModal] = useState(false);
  const { updateLaporanData, updateSuratData, isLoading } = useFormSubmission();

  useEffect(() => {
    if (!reportData) {
      navigate("/Lapor");
    }
  }, [reportData, navigate]);

  const handleSubmitLaporan = async (e) => {
    e.preventDefault();

    const formData = {
      judul: e.target.judul.value.trim(),
      kategori: e.target.kategori.value.trim(),
      lokasi_kejadian: e.target.lokasi.value.trim(),
      deskripsi: e.target.deskripsi.value.trim(),
      file: e.target.file.files[0] || null, // Handle jika tidak ada file baru
      kontak: e.target.kontak.value.trim(),
    };

    if (
      !formData.judul ||
      !formData.kategori ||
      !formData.lokasi_kejadian ||
      !formData.deskripsi
    ) {
      alert("Semua field wajib harus diisi!");
      return;
    }

    try {
      const result = await updateLaporanData(
        formData,
        reportData.riwayat_id,
        reportData.laporan_laporan_id
      );

      if (result.success) {
        setShowModal(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert(result.error); // Tampilkan error message
      }
    } catch (error) {
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  const handleSubmitSurat = async (e) => {
    e.preventDefault();

    const formData = {
      judul: e.target.judul.value.trim(),
      jenisSurat: e.target.jenisSurat.value.trim(),
      deskripsi: e.target.deskripsi.value.trim(),
      file: e.target.lampiran.files[0],
      kontak: e.target.kontak.value.trim(),
    };

    if (!formData.judul || !formData.jenisSurat || !formData.deskripsi) {
      alert("Semua field wajib diisi!");
      return;
    }

    const result = await updateSuratData(
      formData,
      reportData.riwayat_id,
      reportData.surat_surat_id
    );

    if (result.success) {
      setShowModal(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert("Terjadi kesalahan saat memperbarui surat: " + result.error);
    }
  };

  return (
    <>
      <div className="position-relative overflow-hidden">
        {/* Same banner as in create.jsx */}
        <div
          className="position-absolute w-100"
          style={{
            background:
              "linear-gradient(135deg, #0d6efd 0%, #6610f2 50%, #0dcaf0 100%)",
            height: "70vh",
            zIndex: -1,
          }}
        >
          {/* Same SVG elements as in create.jsx */}
        </div>

        <div className="container position-relative">
          <main>
            <div className="py-5 text-center text-white">
              <h2 className="mb-4 fw-bold">
                Edit {reportData?.jenis === "laporan" ? "Laporan" : "Surat"}
              </h2>
              <p className="lead mb-4 opacity-90">
                Perbarui {reportData?.jenis === "laporan" ? "laporan" : "surat"}{" "}
                Anda dengan informasi terbaru.
              </p>
            </div>
            <div
              className="container col-xxl-8 px-4 py-5 col-md-7 col-lg-8 mb-5"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                boxShadow:
                  "0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)",
              }}
            >
              {formType === "laporan" ? (
                <form
                  className="needs-validation"
                  noValidate
                  onSubmit={handleSubmitLaporan}
                >
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="judul" className="form-label">
                        Judul Laporan*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="judul"
                        name="judul"
                        defaultValue={reportData?.judul}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="kategori" className="form-label">
                        Kategori*
                      </label>
                      <select
                        className="form-select"
                        id="kategori"
                        name="kategori"
                        defaultValue={
                          reportData?.laporan?.kategori?.kategori_id || ""
                        }
                        required
                      >
                        <option value="">Pilih Kategori Laporan</option>
                        <option value="1">Infrastruktur</option>
                        <option value="2">Kebersihan</option>
                        <option value="3">Keamanan</option>
                        <option value="4">Administrasi</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="lokasi" className="form-label">
                        Lokasi Kejadian*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lokasi"
                        name="lokasi"
                        defaultValue={reportData?.laporan?.lokasi_kejadian}
                        placeholder="Masukkan alamat atau koordinat"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="deskripsi" className="form-label">
                        Deskripsi Permasalahan*
                      </label>
                      <textarea
                        className="form-control"
                        id="deskripsi"
                        name="deskripsi"
                        rows="5"
                        defaultValue={reportData?.deskripsi}
                        placeholder="Jelaskan permasalahan secara rinci..."
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        File/Video Pendukung{" "}
                        <span className="text-muted">(Optional)</span>
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        name="file"
                        accept="image/*,video/*,audio/*"
                      />
                      {reportData?.file_url && (
                        <small className="text-muted">
                          File saat ini:{" "}
                          <a
                            href={reportData.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Lihat
                          </a>
                        </small>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        Kontak <span className="text-muted">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="kontak"
                        defaultValue={reportData?.kontak}
                        placeholder="No. HP atau Email"
                      />
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="d-flex gap-2">
                    <button
                      className="col-8 btn btn-primary btn-lg w-50"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Memperbarui..." : "Perbarui Laporan"}
                    </button>
                    <button
                      className="col-4 btn btn-outline-dark btn-lg w-50"
                      type="button"
                      onClick={() => navigate("/riwayat")}
                    >
                      Kembali ke Riwayat
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  className="needs-validation"
                  noValidate
                  onSubmit={handleSubmitSurat}
                >
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="judul" className="form-label">
                        Judul Surat*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="judul"
                        name="judul"
                        defaultValue={reportData?.judul}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="jenisSurat" className="form-label">
                        Jenis Surat*
                      </label>
                      <select
                        className="form-select"
                        id="jenisSurat"
                        name="jenisSurat"
                        defaultValue={reportData?.surat?.jenis_surat || ""}
                        required
                      >
                        <option value="">Pilih Jenis Surat</option>
                        <option value="keterangan">Surat Keterangan</option>
                        <option value="pengantar">Surat Pengantar</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="keperluan" className="form-label">
                        Keperluan*
                      </label>
                      <textarea
                        className="form-control"
                        id="keperluan"
                        name="deskripsi"
                        rows="4"
                        defaultValue={reportData?.deskripsi}
                        placeholder="Tuliskan keperluan Anda"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        Lampiran <span className="text-muted">(Optional)</span>
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        accept="image/*,.pdf"
                        name="lampiran"
                      />
                      {reportData?.file_url && (
                        <small className="text-muted">
                          File saat ini:{" "}
                          <a
                            href={reportData.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Lihat
                          </a>
                        </small>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        Kontak <span className="text-muted">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="kontak"
                        defaultValue={reportData?.kontak}
                        placeholder="No. HP atau Email"
                      />
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="d-flex gap-2">
                    <button
                      className="col-8 btn btn-primary btn-lg w-50"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Memperbarui..." : "Perbarui Surat"}
                    </button>
                    <button
                      className="col-4 btn btn-outline-dark btn-lg w-50"
                      type="button"
                      onClick={() => navigate("/riwayat")}
                    >
                      Kembali ke Riwayat
                    </button>
                  </div>
                </form>
              )}
            </div>
          </main>
        </div>
      </div>

      <ModalSukses
        show={showModal}
        onClose={() => setShowModal(false)}
        message={
          reportData?.jenis === "laporan"
            ? "Laporan berhasil diperbarui!"
            : "Surat berhasil diperbarui!"
        }
        onNavigate={() => navigate("/riwayat")}
      />
    </>
  );
}
