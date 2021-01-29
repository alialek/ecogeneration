import axios from "../interceptor";

export const getNews = () => {
  return axios.get("news");
};
