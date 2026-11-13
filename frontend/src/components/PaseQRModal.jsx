import React from 'react';

export default function PaseQRModal({ reservation, onClose, onGoToReservations }) {
  if (!reservation) return null;
  const book = reservation.book || {};
  const expiresDate = new Date(reservation.expires_at).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-marble-border shadow-2xl p-5 sm:p-8 flex flex-col gap-4 sm:gap-6 text-center my-auto overflow-hidden">
        {/* Top Decorative Border */}
        <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-gold-burnished via-gold-accent to-gold-burnished"></div>

        {/* Top Header Row with Back button for mobile */}
        <div className="flex items-center justify-between w-full pt-1">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-warm-charcoal hover:text-sepia-ink text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Volver</span>
          </button>
          <button
            onClick={onClose}
            className="text-warm-charcoal hover:text-sepia-ink p-1 rounded-lg hover:bg-parchment-surface transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Confirmation Header */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-gold-light border border-gold-burnished/30 flex items-center justify-center text-gold-burnished shadow-xs">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-gold-burnished font-bold mt-1">
            Reserva Registrada con Éxito
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-sepia-heading">
            ¡Reserva Confirmada!
          </h3>
          <p className="text-xs text-warm-charcoal max-w-sm">
            Libro reservado a su nombre. Presente este pase al retirar en la biblioteca.
          </p>
        </div>

        {/* Book Preview Card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-parchment-surface border border-marble-border text-left">
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-12 h-16 rounded object-cover border border-marble-border shrink-0 shadow-2xs"
          />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[9px] uppercase tracking-wider text-gold-burnished font-bold truncate">
              {book.genre || 'Literatura'}
            </span>
            <h4 className="text-xs font-bold font-display text-sepia-heading truncate leading-tight">
              {book.title}
            </h4>
            <p className="text-[11px] text-warm-charcoal truncate">{book.author}</p>
            <span className="text-[10px] text-warm-charcoal font-mono mt-0.5 truncate">
              {book.location || 'Estante 2A · Biblioteca'}
            </span>
          </div>
        </div>

        {/* Big QR Pass Container */}
        <div className="p-4 sm:p-6 rounded-2xl bg-parchment-surface border-2 border-dashed border-marble-border flex flex-col items-center gap-3">
          <div className="p-3 bg-white rounded-xl border border-marble-border shadow-md">
            <svg viewBox="0 0 100 100" className="w-36 h-36 sm:w-44 sm:h-44 text-sepia-ink fill-current">
              <rect x="5" y="5" width="25" height="25" rx="3" />
              <rect x="70" y="5" width="25" height="25" rx="3" />
              <rect x="5" y="70" width="25" height="25" rx="3" />
              <rect x="12" y="12" width="11" height="11" fill="white" />
              <rect x="77" y="12" width="11" height="11" fill="white" />
              <rect x="12" y="77" width="11" height="11" fill="white" />
              <rect x="40" y="10" width="8" height="20" />
              <rect x="40" y="40" width="20" height="20" />
              <rect x="70" y="45" width="20" height="10" />
              <rect x="10" y="40" width="20" height="10" />
              <rect x="40" y="70" width="15" height="20" />
              <rect x="65" y="65" width="25" height="25" />
              <rect x="72" y="72" width="11" height="11" fill="white" />
            </svg>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] text-warm-charcoal font-semibold uppercase tracking-wider">
              Código de Pase QR
            </span>
            <span className="text-lg sm:text-xl font-mono font-bold text-gold-burnished tracking-wider">
              {reservation.reservation_code}
            </span>
          </div>

          <div className="w-full pt-2.5 border-t border-marble-border/70 flex flex-col gap-1 text-[11px] text-left">
            <div className="flex justify-between">
              <span className="text-warm-charcoal">Punto de Entrega:</span>
              <strong className="text-sepia-heading text-right">Sigmund Freud 201</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-charcoal">Turno Elegido:</span>
              <span className="text-sepia-heading font-semibold text-right">{reservation.pickup_slot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-charcoal">Fecha Límite:</span>
              <span className="text-terracotta font-semibold text-right">{expiresDate}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="w-full sm:flex-1 py-2.5 px-3 rounded-lg bg-parchment-surface hover:bg-parchment-card text-sepia-heading border border-marble-border text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">print</span>
            Imprimir / Guardar
          </button>

          <button
            onClick={() => {
              onClose();
              if (onGoToReservations) onGoToReservations();
            }}
            className="w-full sm:flex-1 py-2.5 px-3 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">confirmation_number</span>
            Ir a Mis Reservas
          </button>
        </div>
      </div>
    </div>
  );
}
