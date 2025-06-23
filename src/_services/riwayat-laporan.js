import API from "../_api";

export const getAllRiwayat = async () => {
  try {
    const response = await API.get("/riwayat-laporan");
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil riwayat laporan:", error);
    throw error;
  }
};

export const getRiwayatById = async (id) => {
  try {
    const response = await API.get(`/riwayat-laporan/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil riwayat laporan:", error);
    throw error;
  }
};

export const createRiwayat = async (data) => {
  try {
    const response = await API.post("/riwayat-laporan", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Data berhasil disimpan",
    };
  } catch (error) {
    console.error("Gagal membuat riwayat laporan:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
};

export const updateRiwayat = async (id, formData) => {
  try {
    const response = await API.post(`/riwayat-laporan/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Kembalikan seluruh response
  } catch (error) {
    console.error("Gagal memperbarui riwayat laporan:", error);

    // Berikan error message yang lebih informatif
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan saat memperbarui riwayat";

    throw new Error(errorMessage);
  }
};

// Update this function to match backend expectations
export const updateStatusRiwayat = async (id, data) => {
  try {
    // Send as a single object with status and komentar properties
    const response = await API.post(`/riwayat-laporan/${id}/status`, {
      status: data.status,
      komentar: data.komentar,
    });
    return response.data.data;
  } catch (error) {
    console.error("Gagal memperbarui status riwayat:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Gagal memperbarui status";
    throw new Error(errorMessage);
  }
};

export const deleteRiwayat = async (id) => {
  try {
    const response = await API.delete(`/riwayat-laporan/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Gagal menghapus riwayat laporan:", error);
    throw error;
  }
};
