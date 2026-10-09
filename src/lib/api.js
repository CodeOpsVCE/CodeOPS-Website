const API_BASE = import.meta.env.VITE_API_URL || "https://codeops-website.onrender.com/api";
export const ASSET_BASE = API_BASE.replace(/\/api\/?$/, "");
export const resolveAssetUrl = (url) => url && url.startsWith("/") ? `${ASSET_BASE}${url}` : url;

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      headers: isFormData ? { ...(options.headers || {}) } : { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("API request timed out. Make sure the CodeOPS server is running.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

const crud = (name) => ({
  list: () => request(`/${name}`),
  add: (item) => request(`/${name}`, { method:"POST", body:JSON.stringify(item) }),
  update: (id,item) => request(`/${name}/${id}`, { method:"PUT", body:JSON.stringify(item) }),
  remove: (id) => request(`/${name}/${id}`, { method:"DELETE" }),
});

export const api = {
  login: (username, password) => request("/auth/login", { method:"POST", body:JSON.stringify({ username, password }) }),
  logout: () => request("/auth/logout", { method:"POST" }),
  me: () => request("/auth/me"),
  admins: () => request("/admin"),
  addAdmin: (username,password) => request("/admin", { method:"POST", body:JSON.stringify({ username,password }) }),
  removeAdmin: (id) => request(`/admin/${id}`, { method:"DELETE" }),

  events: () => request("/event"),
  addEvent: (event) => {
    const form = new FormData();
    Object.entries(event).forEach(([key,value]) => {
      if (key === "posterFile") { if (value) form.append("poster", value); }
      else if (value !== "") form.append(key,value);
    });
    return request("/event", { method:"POST", body:form });
  },
  updateEvent: (id,event) => {
    const form = new FormData();
    Object.entries(event).forEach(([key,value]) => {
      if (key === "posterFile") { if (value) form.append("poster", value); }
      else if (value !== "") form.append(key,value);
    });
    return request(`/event/${id}`, { method:"PUT", body:form });
  },
  removeEvent: (id) => request(`/event/${id}`, { method:"DELETE" }),

  leaderboard: crud("leaderboard"),
  agents: {
    ...crud("agent"),
    importCsv: (agents) => request("/agents/import", { method:"POST", body:JSON.stringify({ agents }) }),
    reorder: (order) => request("/agents/reorder", { method:"PUT", body:JSON.stringify({ order }) }),
  },
  alerts: crud("alert"),
  gallery: crud("gallery"),
  posters: crud("poster"),
  contact: {
    get: () => request("/contact"),
    update: (item) => request("/contact", { method:"PUT", body:JSON.stringify(item) }),
  },
  media: {
    list: () => request("/media"),
    upload: (file,title,kind="image") => {
      const form = new FormData();
      form.append("file",file);
      if (title) form.append("title",title);
      form.append("kind",kind);
      return request("/media", { method:"POST", body:form });
    },
    remove: (id) => request(`/media/${id}`, { method:"DELETE" }),
  },
  siteSettings: {
    get: () => request("/site-settings"),
    update: (sections, home) => request("/site-settings", { method:"PUT", body:JSON.stringify({ sections, home }) }),
  },
  stats: {
    get: () => request("/stats"),
    update: (item) => request("/stats", { method:"PUT", body:JSON.stringify(item) }),
  },
};
