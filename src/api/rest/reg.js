import axios from "../interceptor";

export const reg = (data) => {
  return axios.post("reg", data);
};
