import axios from "../interceptor";

export const getRating = () => {
  return axios.post("rating");
};
