
/**
 *
 * @param {string} msg messege the alert will show on the screen
 * @param {string} alertType tells the frontend the kind of alert
 * @param {number} timeout setted to 5000 by default it hold how many ms to the alert disappear
 */
import { toast } from "react-toastify";

export const showToast = (mes, type, options = {}) => {
  switch (type) {
    case "warning":
      toast.dismiss();
      setTimeout(() => {
        toast.dismiss();
        toast.warn(mes, options);
      }, 400);
      break;
    case "error":
      toast.error(mes, options);
      break;
    case "success":
      toast.success(mes, options);
      break;
    case "dark":
      toast.dark(mes, options);
      break;
    default:
      toast.info(mes, options);
      break;
  }
};

export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  };
  showToast(
    msg,
    "success",
    toastOptions
  );
};
