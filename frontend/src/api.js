const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function resolveMediaUrl(url) {
  if (!url) return '';
  if (url.includes('.storage.') && url.includes('.neon.tech/biblioteca/')) {
    const parts = url.split('.neon.tech/biblioteca/');
    if (parts.length > 1) {
      return `/api/storage/${parts[1]}`;
    }
  }
  return url;
}

export const api = {
  // Books
  async getBooks(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('q', params.search);
    if (params.genre && params.genre !== 'Todas las Categorías') query.append('genre', params.genre);
    if (params.format && params.format !== 'all') query.append('format', params.format);
    
    const res = await fetch(`${API_BASE}/books?${query.toString()}`);
    if (!res.ok) throw new Error('Error al obtener libros');
    const items = await res.json();
    return (items || []).map((b) => ({
      ...b,
      cover_url: resolveMediaUrl(b.cover_url),
      digital_url: resolveMediaUrl(b.digital_url),
    }));
  },

  async getBook(id) {
    const res = await fetch(`${API_BASE}/books/${id}`);
    if (!res.ok) throw new Error('Error al obtener el libro');
    return res.json();
  },

  async createBook(bookData) {
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al registrar libro');
    }
    return res.json();
  },

  async updateBook(id, bookData) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al actualizar libro');
    }
    return res.json();
  },

  async deleteBook(id) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar libro');
    return res.json();
  },

  // Reservations
  async getReservations() {
    const res = await fetch(`${API_BASE}/reservations`);
    if (!res.ok) throw new Error('Error al obtener reservas');
    return res.json();
  },

  async createReservation(data) {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'No se pudo crear la reserva');
    }
    return res.json();
  },

  async cancelReservation(id) {
    const res = await fetch(`${API_BASE}/reservations/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!res.ok) throw new Error('Error al cancelar la reserva');
    return res.json();
  },

  async deliverReservation(data) {
    const res = await fetch(`${API_BASE}/reservations/deliver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al entregar reserva');
    }
    return res.json();
  },

  // Loans
  async getLoans() {
    const res = await fetch(`${API_BASE}/loans`);
    if (!res.ok) throw new Error('Error al obtener préstamos');
    return res.json();
  },

  async renewLoan(id) {
    const res = await fetch(`${API_BASE}/loans/renew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al renovar préstamo');
    }
    return res.json();
  },

  async returnLoan(payload) {
    const loanId = typeof payload === 'object' ? (payload.loan_id || payload.id) : payload;
    const res = await fetch(`${API_BASE}/loans/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: loanId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al registrar devolución');
    }
    return res.json();
  },

  // News
  async getNews() {
    const res = await fetch(`${API_BASE}/news`);
    if (!res.ok) throw new Error('Error al obtener noticias');
    const items = await res.json();
    return (items || []).map((item) => ({
      ...item,
      image_url: resolveMediaUrl(item.image_url),
    }));
  },

  async createNews(newsData) {
    const res = await fetch(`${API_BASE}/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al publicar noticia');
    }
    return res.json();
  },

  async updateNews(id, newsData) {
    const res = await fetch(`${API_BASE}/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al actualizar noticia');
    }
    return res.json();
  },

  async deleteNews(id) {
    const res = await fetch(`${API_BASE}/news/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar noticia');
    return res.json();
  },

  // Users & Members
  async getUsers() {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error('Error al obtener miembros');
    return res.json();
  },

  async getCurrentUser() {
    try {
      const stored = localStorage.getItem('biblioteca_user');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      const userId = parsed?.id || parsed?.user_id;
      if (!userId) {
        localStorage.removeItem('biblioteca_user');
        return null;
      }

      const res = await fetch(`${API_BASE}/user/me?id=${userId}`, {
        headers: parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {},
      });

      // Solo si el servidor rechaza explícitamente la autenticación (401/403) eliminamos la sesión
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('biblioteca_user');
        return null;
      }

      // Si hubo un error temporal del servidor (500, 502, timeout, etc.), no cerramos la sesión
      if (!res.ok) {
        return { ...parsed, id: userId, user_id: userId };
      }

      const data = await res.json();
      if (!data || (!data.id && !data.user_id)) {
        return { ...parsed, id: userId, user_id: userId };
      }

      const updated = {
        ...parsed,
        ...data,
        id: data.id || data.user_id || userId,
        user_id: data.user_id || data.id || userId,
        token: parsed.token,
      };
      localStorage.setItem('biblioteca_user', JSON.stringify(updated));
      return updated;
    } catch (e) {
      // Si falla la red o está offline, conservamos la sesión local
      try {
        const stored = localStorage.getItem('biblioteca_user');
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        const userId = parsed?.id || parsed?.user_id;
        return userId ? { ...parsed, id: userId, user_id: userId } : null;
      } catch {
        return null;
      }
    }
  },

  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Credenciales inválidas');
    }
    const userId = data.user?.id || data.user?.user_id;
    const userWithToken = {
      ...data.user,
      id: userId,
      user_id: userId,
      token: data.token,
    };
    localStorage.setItem('biblioteca_user', JSON.stringify(userWithToken));
    if (data.user?.role === 'admin') {
      localStorage.setItem('biblioteca_backoffice', 'true');
    } else {
      localStorage.setItem('biblioteca_backoffice', 'false');
    }
    return userWithToken;
  },

  async logout() {
    localStorage.removeItem('biblioteca_user');
    localStorage.removeItem('biblioteca_backoffice');
  },

  async registerUser(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Error al registrarse');
    }
    const userId = data.user?.id || data.user?.user_id;
    const userWithToken = {
      ...data.user,
      id: userId,
      user_id: userId,
      token: data.token,
    };
    localStorage.setItem('biblioteca_user', JSON.stringify(userWithToken));
    localStorage.setItem('biblioteca_backoffice', 'false');
    return userWithToken;
  },

  // Banners API
  async getBanners() {
    const res = await fetch(`${API_BASE}/banners`);
    if (!res.ok) throw new Error('Error al obtener banners');
    const data = await res.json();
    const normalized = {};
    for (const [k, v] of Object.entries(data || {})) {
      normalized[k] = {
        ...v,
        image_url: resolveMediaUrl(v.image_url),
      };
    }
    return normalized;
  },

  async updateBanner(bannerData) {
    const res = await fetch(`${API_BASE}/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bannerData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al actualizar banner');
    }
    return res.json();
  },

  async resetBanner(key) {
    const res = await fetch(`${API_BASE}/banners/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });
    if (!res.ok) throw new Error('Error al resetear banner');
    const data = await res.json();
    const normalized = {};
    for (const [k, v] of Object.entries(data || {})) {
      normalized[k] = {
        ...v,
        image_url: resolveMediaUrl(v.image_url),
      };
    }
    return normalized;
  },

  // Backoffice Analytics
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Error al obtener analítica');
    return res.json();
  },

  // File Upload (Neon Object Storage bucket 'biblioteca')
  async uploadFile(file, folder = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al subir archivo');
    }
    return res.json(); // { url: '...', filename: '...' }
  },

  // Admin DB Reset
  async resetDatabase() {
    const res = await fetch(`${API_BASE}/admin/reset-db`, {
      method: 'POST'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al resetear la base de datos');
    }
    return res.json();
  }
};
