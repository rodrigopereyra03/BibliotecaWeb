import React from 'react';

export default function HorariosModal({ onClose }) {
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
            <span className="material-symbols-outlined text-xl">church</span>
            <span className="text-xs uppercase tracking-wider font-semibold">Secretaría & Atrio</span>
          </div>
          <h3 className="text-xl font-bold font-display text-sepia-heading">
            Horarios del Despacho y Retiro
          </h3>
          <p className="text-xs text-warm-charcoal">
            Capilla Ntra. Sra. de Lourdes · Sigmund Freud 201, Temperley
          </p>
        </div>

        <div className="flex flex-col gap-3 text-xs">
          <div className="p-3 rounded-xl bg-parchment-surface border border-marble-border flex flex-col gap-1">
            <span className="font-bold text-sepia-heading">Lunes a Viernes</span>
            <div className="flex justify-between text-warm-charcoal">
              <span>Turno Mañana:</span>
              <strong className="text-sepia-heading">10:00 a 13:00 hs</strong>
            </div>
            <div className="flex justify-between text-warm-charcoal">
              <span>Turno Tarde:</span>
              <strong className="text-sepia-heading">15:00 a 18:00 hs</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-parchment-surface border border-marble-border flex flex-col gap-1">
            <span className="font-bold text-sepia-heading">Sábados</span>
            <div className="flex justify-between text-warm-charcoal">
              <span>Atención General:</span>
              <strong className="text-sepia-heading">9:30 a 12:30 hs</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gold-light/40 border border-gold-burnished/30 flex flex-col gap-1">
            <span className="font-bold text-gold-burnished">Domingos (Misa Parroquial)</span>
            <div className="flex justify-between text-warm-charcoal">
              <span>Mostrador del Atrio:</span>
              <strong className="text-sepia-heading">8:30 a 14:00 hs</strong>
            </div>
            <p className="text-[11px] text-warm-charcoal mt-1">
              Retiro y devolución express con pase QR al término de la Santa Misa.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white text-xs font-bold shadow-md transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
