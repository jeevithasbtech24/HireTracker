const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("ht_user") || "{}");
  return user.token || null;
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ---- AUTH ----

export const registerUser = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// ---- JOBS ----

export const getJobs = async () => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    headers: authHeaders(),
  });
  return res.json();
};

export const addJob = async (job) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(job),
  });
  return res.json();
};

export const updateJob = async (id, job) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(job),
  });
  return res.json();
};

export const deleteJob = async (id) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
};

export const changePassword = async (currentPassword, newPassword) => {
  const res = await fetch(`${BASE_URL}/auth/change-password`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return res.json();
};

export const updateName = async (name) => {
  const res = await fetch(`${BASE_URL}/auth/update-name`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ name }),
  });
  return res.json();
};