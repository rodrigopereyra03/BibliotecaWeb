import React from 'react';

export default function HorariosModal({ onClose, banner }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-marble-border shadow-2xl flex flex-col text-left overflow-hidden">
        
        {/* ============================================================ */}
        {/* PHOTOGRAPHIC HEADER BANNER                                    */}
        {/* ============================================================ */}
        <div className="relative h-36 w-full overflow-hidden select-none">
          <img
            src={banner?.image_url || '/capilla-fachada.jpg'}
            alt="Capilla Nuestra Señora de Lourdes"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sepia-heading via-sepia-heading/60 to-black/30"></div>

          {/* Close button on banner */}
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/20 shadow-xs"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          {/* Overlay titles */}
          <div className="absolute bottom-3 left-4 right-4 flex flex-col gap-0.5 text-white">
            <div className="flex items-center gap-1.5 text-gold-light text-[11px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm text-gold-burnished">church</span>
              <span>{banner?.tagline || 'Despacho Parroquial & Atrio'}</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white leading-tight">
              {banner?.title || 'Horarios de Retiro y Atención'}
            </h3>
            <p className="text-[11px] text-parchment-surface/85 truncate">
              {banner?.description || 'Sigmund Freud 201 · Temperley'}
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SCHEDULE CONTENT                                             */}
        {/* ============================================================ */}
        <div className="p-6 flex flex-col gap-3.5 text-xs">
          <div className="p-3 rounded-xl bg-parchment-surface border border-marble-border flex flex-col gap-1 shadow-2xs">
            <span className="font-bold text-sepia-heading flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
              Lunes a Viernes
            </span>
            <div className="flex justify-between text-warm-charcoal mt-1">
              <span>Turno Mañana:</span>
              <strong className="text-sepia-heading">10:00 a 13:00 hs</strong>
            </div>
            <div className="flex justify-between text-warm-charcoal">
              <span>Turno Tarde:</span>
              <strong className="text-sepia-heading">15:00 a 18:00 hs</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-parchment-surface border border-marble-border flex flex-col gap-1 shadow-2xs">
            <span className="font-bold text-sepia-heading flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
              Sábados
            </span>
            <div className="flex justify-between text-warm-charcoal mt-1">
              <span>Atención General:</span>
              <strong className="text-sepia-heading">9:30 a 12:30 hs</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gold-light/40 border border-gold-burnished/30 flex flex-col gap-1 shadow-2xs">
            <span className="font-bold text-gold-burnished flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
              Domingos (Jornada Comunitaria)
            </span>
            <div className="flex justify-between text-warm-charcoal mt-1">
              <span>Mostrador del Atrio:</span>
              <strong className="text-sepia-heading">8:30 a 14:00 hs</strong>
            </div>
            <p className="text-[11px] text-warm-charcoal mt-1">
              Retiro y devolución de libros durante toda la jornada comunitaria en el atrio central.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gold-burnished hover:bg-gold-accent text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
