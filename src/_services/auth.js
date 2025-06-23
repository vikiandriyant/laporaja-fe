import API from "../_api";
import { useJwt } from "react-jwt";

// Login
export const login = async (credentials) => {
  try {
    const response = await API.post("/login", credentials);
    const token = response.data.token;
    if (token) {
      localStorage.setItem("token", token);
    }
    return response.data;
  } catch (error) {
    console.error("Gagal login:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Register - kirim field yang sesuai ke backend Laravel
export const register = async (data) => {
  try {
    const response = await API.post("/register", {
      nik: data.nik,
      nama_lengkap: data.namalengkap,
      no_telepon: data.noTelepon,
      password: data.password,
    });
    return response.data;
  } catch (error) {
    console.error("Gagal registrasi:", error.response?.data || error.message);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    localStorage.removeItem("token");
    const response = await API.post("/logout");
    return response.data;
  } catch (error) {
    console.error("Gagal logout:", error);
    throw error;
  }
};

// Ambil user login
export const getCurrentUser = async () => {
  try {
    const response = await API.get("/user");
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
    throw error;
  }
};

export const requestResetToken = async (nik) => {
  try {
    const response = await API.post("/forgot-password", { nik });
    return response.data;
  } catch (error) {
    console.error("Gagal meminta token reset:", error.response?.data || error.message);
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await API.post("/reset-password", data);
    return response.data;
  } catch (error) {
    console.error("Gagal reset password:", error.response?.data || error.message);
    throw error;
  }
};

export const useDecodeToken = (token) => {
  const { decodeToken, isExpired } = useJwt(token);

  try {
    if (isExpired) {
      return {
        success: false,
        massage: "Token Expired",
        data: null
      }
    }

    return {
      success: true,
      massage: "Token Valid",
      data: decodeToken(token)
    }

  } catch (error) {
    return {
      success: false,
      massage: error.massage,
      data: null
    }
  }
}