import axios from "../interceptor";
/**
 *
 * @param {number} taskId
 * @param {string} link
 */
export const getTasks = () => {
  return axios.get("tasks");
};
