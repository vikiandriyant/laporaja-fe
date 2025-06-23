import API from "../_api";

export const createLaporan = async (data) => {
    try {
        const response = await API.post("/laporan", data);
        return response.data;
    } catch (error) {
        console.error("Gagal membuat laporan:", error);
        throw error;
    }
};

export const getLaporanById = async (id) => {
    try {
        const response = await API.get(`/laporan/${id}`);
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil laporan:", error);
        throw error;
    }
};

export const updateLaporan = async (id, data) => {
    try {
        const response = await API.post(`/laporan/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Gagal memperbarui laporan:", error);
        throw error;
    }
};

export const deleteLaporan = async (id) => {
    try {
        const response = await API.delete(`/laporan/${id}`);
        return response.data;
    } catch (error) {
        console.error("Gagal menghapus laporan:", error);
        throw error;
    }
};

export const getAllLaporan = async () => {
    try {
        const response = await API.get("/laporan");
        console.log("RESPON LAPORAN:", response.data);
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil semua laporan:", error);
        throw error;
    }
};

