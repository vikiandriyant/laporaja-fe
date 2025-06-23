import { useState } from "react";
import { createLaporan, deleteLaporan, updateLaporan } from "../../../../_services/laporan";
import { createRiwayat, updateRiwayat } from "../../../../_services/riwayat-laporan";
import { createSurat, deleteSurat, updateSurat } from "../../../../_services/surat";

export const useFormSubmission = () => {
    const [isLoading, setIsLoading] = useState(false);

    const submitLaporan = async (formData) => {
        setIsLoading(true);
        let laporanId = null;

        try {
            // 1. Create laporan first
            const laporanData = {
                lokasi_kejadian: formData.lokasi_kejadian,
                tanggal_kejadian: new Date().toISOString(),
                kategori_kategori_id: parseInt(formData.kategori)
            };

            const laporanResponse = await createLaporan(laporanData);
            laporanId = laporanResponse.data?.laporan_id;

            if (!laporanId) {
                throw new Error("Gagal membuat laporan");
            }

            // 2. Create riwayat with reference to laporan
            const riwayatFormData = new FormData();
            riwayatFormData.append("jenis", "laporan");
            riwayatFormData.append("judul", formData.judul);
            riwayatFormData.append("deskripsi", formData.deskripsi);
            riwayatFormData.append("status", "perlu ditinjau");
            riwayatFormData.append("laporan_laporan_id", laporanId);

            if (formData.file) riwayatFormData.append("file", formData.file);
            if (formData.kontak) riwayatFormData.append("kontak", formData.kontak);
            

            const riwayatResponse = await createRiwayat(riwayatFormData);

            if (!riwayatResponse.success) {
                throw new Error("Gagal membuat riwayat");
            }

            return { success: true, data: { laporan: laporanResponse, riwayat: riwayatResponse } };

        } catch (error) {
            // Rollback laporan jika ada error
            if (laporanId) {
                try {
                    await deleteLaporan(laporanId);
                } catch (rollbackError) {
                    console.error("Gagal rollback:", rollbackError);
                }
            }
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const updateLaporanData = async (formData, riwayatId, laporanId) => {
        setIsLoading(true);
        
        try {
            // 1. Update laporan
            const laporanData = {
                lokasi_kejadian: formData.lokasi_kejadian,
                kategori_kategori_id: parseInt(formData.kategori)
            };

            const laporanResponse = await updateLaporan(laporanId, laporanData);

            // 2. Update riwayat
            const riwayatFormData = new FormData();
            riwayatFormData.append("judul", formData.judul);
            riwayatFormData.append("deskripsi", formData.deskripsi);
            
            if (formData.file) riwayatFormData.append("file", formData.file);
            if (formData.kontak) riwayatFormData.append("kontak", formData.kontak);

            const riwayatResponse = await updateRiwayat(riwayatId, riwayatFormData);

            if (!riwayatResponse.success) {
                throw new Error("Gagal memperbarui riwayat");
            }

            return { success: true, data: { laporan: laporanResponse, riwayat: riwayatResponse } };

        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const submitSurat = async (formData) => {
        setIsLoading(true);
        let suratId = null;

        try {
            // 1. Create surat first
            const suratData = {
                jenis_surat: formData.jenisSurat
            };

            const suratResponse = await createSurat(suratData);
            suratId = suratResponse.data?.surat_id;

            if (!suratId) {
                throw new Error("Gagal membuat surat");
            }

            // 2. Create riwayat with reference to surat
            const riwayatFormData = new FormData();
            riwayatFormData.append("jenis", "surat");
            riwayatFormData.append("judul", formData.judul);
            riwayatFormData.append("deskripsi", formData.deskripsi);
            riwayatFormData.append("status", "perlu ditinjau");
            riwayatFormData.append("surat_surat_id", suratId);

            if (formData.file) riwayatFormData.append("file", formData.file);
            if (formData.kontak) riwayatFormData.append("kontak", formData.kontak);
            
            const riwayatResponse = await createRiwayat(riwayatFormData);

            if (!riwayatResponse.success) {
                throw new Error("Gagal membuat riwayat");
            }

            return { success: true, data: { surat: suratResponse, riwayat: riwayatResponse } };

        } catch (error) {
            // Rollback surat jika ada error
            if (suratId) {
                try {
                    await deleteSurat(suratId);
                } catch (rollbackError) {
                    console.error("Gagal rollback:", rollbackError);
                }
            }
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const updateSuratData = async (formData, riwayatId, suratId) => {
        setIsLoading(true);
        
        try {
            // 1. Update surat
            const suratData = {
                jenis_surat: formData.jenisSurat
            };

            const suratResponse = await updateSurat(suratId, suratData);

            // 2. Update riwayat
            const riwayatFormData = new FormData();
            riwayatFormData.append("judul", formData.judul);
            riwayatFormData.append("deskripsi", formData.deskripsi);
            
            if (formData.file) riwayatFormData.append("file", formData.file);
            if (formData.kontak) riwayatFormData.append("kontak", formData.kontak);

            const riwayatResponse = await updateRiwayat(riwayatId, riwayatFormData);

            if (!riwayatResponse.success) {
                throw new Error("Gagal memperbarui riwayat");
            }

            return { success: true, data: { surat: suratResponse, riwayat: riwayatResponse } };

        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        submitLaporan,
        submitSurat,
        updateLaporanData,
        updateSuratData,
        isLoading
    };
};