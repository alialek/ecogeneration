import axios from "../interceptor";

export const auth = (url, referral) => {
  return axios.post("auth", { url, referral });
};
