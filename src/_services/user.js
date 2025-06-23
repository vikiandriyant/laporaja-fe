import API from "../_api";

export const getAllUsers = async () => {
    try {
        const response = await API.get("/user");
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil semua pengguna:", error);
        throw error;
    }
};

export const getUserById = async (id) => {
    try {
        const response = await API.get(`/user/${id}`);
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil pengguna:", error);
        throw error;
    }
};

export const updateUser = async (id, data) => {
    try {
        const response = await API.post(`/user/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Gagal memperbarui pengguna:", error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await API.delete(`/user/${id}`);
        return response.data;
    } catch (error) {
        console.error("Gagal menghapus pengguna:", error);
        throw error;
    }
};
