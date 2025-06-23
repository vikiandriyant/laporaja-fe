import API from "../_api";

export const getAllKategori = async () => {
    try {
        const response = await API.get("/kategori");
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil semua kategori:", error);
        throw error;
    }
};

export const createKategori = async (data) => {
    try {
        const response = await API.post("/kategori", data);
        return response.data;
    } catch (error) {
        console.error("Gagal membuat kategori:", error);
        throw error;
    }
};

export const updateKategori = async (id, data) => {
    try {
        const response = await API.put(`/kategori/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Gagal memperbarui kategori:", error);
        throw error;
    }
};

export const deleteKategori = async (id) => {
    try {
        const response = await API.delete(`/kategori/${id}`);
        return response.data;
    } catch (error) {
        console.error("Gagal menghapus kategori:", error);
        throw error;
    }
};
