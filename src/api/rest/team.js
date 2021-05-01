import axios from "../interceptor";

export const getTeam = () => {
  return axios.get("team");
};

/**
 *
 * @param {string} data.type create/edit/delete
 * @param {number} data.id
 * @param {string} data.title
 * @param {string} data.description
 * @param {string} data.emoji
 * @returns Promise
 */

export const updateTeam = (data) => {
  return axios.post("team", data);
};

/**
 *
 * @param {string} data.type add/delete
 * @param {number} data.id user_id
 * @returns Promise
 */

export const updateTeamAdmin = (data) => {
  return axios.post("team/admin", data);
};

/**
 *
 * @param {string} data.type <teamId>/<userId>/<userId>
 * @param {number} data.id send/confirm/reject
 * @returns Promise
 */

export const updateTeamMembers = (data) => {
  return axios.post("team/invite", data);
};

/**
 *
 * @param {string} data.type <userId>/<teamId>
 * @param {number} data.id  ban/exit
 * @returns Promise
 */

export const leaveTeam = (data) => {
  return axios.post("team/leave", data);
};
/**
 *
 * @param {string} data.type <userId>/<teamId>
 * @param {number} data.id  ban/exit
 * @returns Promise
 */

export const getTeamById = ({ id }) => {
  return axios.post("team/load", { id });
};
