import api from "./axios";

export const getAllProjects = (params) =>
  api.get("/projects", { params });

export const getProjectBySlug = (slug) =>
  api.get(`/projects/${slug}`);

export const fetchProjects = getAllProjects;
export const fetchProjectBySlug = getProjectBySlug;