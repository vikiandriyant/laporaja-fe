import API from "../_api";

export const createSurat = async (data) => {
    try {
        const response = await API.post("/surat", data);
        return response.data;
    } catch (error) {
        console.error("Gagal membuat surat:", error);
        throw error;
    }
};

export const getSuratById = async (id) => {
    try {
        const response = await API.get(`/surat/${id}`);
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil surat:", error);
        throw error;
    }
};

export const updateSurat = async (id, data) => {
    try {
        const response = await API.post(`/surat/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Gagal memperbarui surat:", error);
        throw error;
    }
};

export const deleteSurat = async (id) => {
    try {
        const response = await API.delete(`/surat/${id}`);
        return response.data;
    } catch (error) {
        console.error("Gagal menghapus surat:", error);
        throw error;
    }
};

export const getAllSurat = async () => {
  try {
    const response = await API.get("/surat");
    console.log("RESPON SURAT:", response.data);
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil semua surat:", error);
    throw error;
  }
};
