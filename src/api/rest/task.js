import axios from "../interceptor";
/**
 *
 * @param {number} taskId
 * @param {string} link
 */
export const postTask = (data) => {
  return axios.post("task", data);
};
