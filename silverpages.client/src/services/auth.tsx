import axios from "axios";

const register = (email: string, password: string) => {
    return axios.post("/api/register", {
        email,
        password,
    });
};

const login = (email : string, password: string) => {
    return axios
        .post("/api/login?useCookies=true", {
            email,
            password,
        })
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
};

export default {
    register,
    login,
    logout,
};