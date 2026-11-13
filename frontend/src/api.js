const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const api = {
  // Books
  async getBooks(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('q', params.search);
    if (params.genre && params.genre !== 'Todas las Categorías') query.append('genre', params.genre);
    if (params.format && params.format !== 'all') query.append('format', params.format);
    
    const res = await fetch(`${API_BASE}/books?${query.toString()}`);
    if (!res.ok) throw new Error('Error al obtener libros');
    return res.json();
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
    return res.json();
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
    const res = await fetch(`${API_BASE}/user/me`);
    if (!res.ok) throw new Error('Error al obtener datos de usuario');
    return res.json();
  },

  async registerUser(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al registrarse');
    }
    return res.json();
  },

  // Backoffice Analytics
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Error al obtener analítica');
    return res.json();
  }
};
