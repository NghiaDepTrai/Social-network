import axios from "axios";

export default (history = null) => {
  const baseURL = "http://localhost:5000/";
  let headers = { 'x-auth-token': "" };
  if (localStorage.token) {
    headers["x-auth-token"] = `${localStorage.token}`;
  }
  const axiosInstance = axios.create({
    baseURL: baseURL,
    headers,
  });

  axiosInstance.interceptors.response.use(
    (response) =>
      new Promise((resolve, reject) => {
        resolve(response);
      }),
    (error) => {
      if (!error.response) {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }

      if (error.response.status === 403) {
        localStorage.removeItem("token");
        if (history) {
          history.push("/login");
        } else {
          window.location = "/login";
        }
      } else {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
    }
  );
  return axiosInstance;
};