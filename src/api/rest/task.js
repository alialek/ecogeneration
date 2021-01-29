import axios from "../interceptor";
/**
 *
 * @param {number} taskId
 * @param {string} link
 */
export const postTask = (taskId, link) => {
  return axios.post("task", { taskId, link });
};
