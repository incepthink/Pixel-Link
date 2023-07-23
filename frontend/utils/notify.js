import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notify = (message, type) => {
  toast(message, {
    position: "bottom-right",
    type: type ? type : "default",
  });
}

export default notify;