import React, { useState } from 'react';

export default function RegistroModal({ onClose, onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Por favor complete su nombre y correo electrónico.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onRegisterSuccess({ name, email, phone });
      onClose();
    } catch (err) {
      setError(err.message || 'Error al procesar el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-marble-border shadow-2xl p-6 sm:p-8 flex flex-col gap-5 text-left overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gold-burnished"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-warm-charcoal hover:text-sepia-ink p-1 rounded-lg hover:bg-parchment-surface transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gold-burnished">
            <span className="material-symbols-outlined text-xl">badge</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Credencial de Lector</span>
          </div>
          <h3 className="text-xl font-bold font-display text-sepia-heading">
            Inscripción de Lector Vecinal
          </h3>
          <p className="text-xs text-warm-charcoal">
            Complete sus datos para obtener su número de credencial y solicitar préstamos a domicilio por 21 días.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-terracotta-light border border-terracotta/20 text-terracotta text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-sepia-heading">Nombre y Apellido *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. María González"
              className="w-full bg-parchment-base text-sepia-ink text-sm rounded-lg px-3.5 py-2 border border-marble-border focus:outline-none focus:ring-1 focus:ring-gold-burnished"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-sepia-heading">Correo Electrónico *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej. maria@ejemplo.com"
              className="w-full bg-parchment-base text-sepia-ink text-sm rounded-lg px-3.5 py-2 border border-marble-border focus:outline-none focus:ring-1 focus:ring-gold-burnished"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-sepia-heading">Teléfono o WhatsApp (Opcional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej. +54 11 1234-5678"
              className="w-full bg-parchment-base text-sepia-ink text-sm rounded-lg px-3.5 py-2 border border-marble-border focus:outline-none focus:ring-1 focus:ring-gold-burnished"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">how_to_reg</span>
              {loading ? 'Generando Credencial...' : 'Completar Registro & Obtener Credencial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
