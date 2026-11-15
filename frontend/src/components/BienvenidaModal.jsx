import React from 'react';

export default function BienvenidaModal({ user, onClose, onGoToCatalog }) {
  if (!user) return null;

  const handleStart = () => {
    onClose();
    if (onGoToCatalog) {
      onGoToCatalog();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#fdfbf7] border border-marble-border shadow-2xl flex flex-col text-left overflow-hidden">
        
        {/* ============================================================ */}
        {/* HEADER HERO BANNER                                           */}
        {/* ============================================================ */}
        <div className="relative h-36 sm:h-40 w-full overflow-hidden select-none">
          <img
            src="/virgen-lourdes.jpg"
            alt="Capilla Nuestra Señora de Lourdes"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-black/30"></div>

          {/* Close button */}
          <button
            onClick={handleStart}
            aria-label="Cerrar modal"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/20 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          {/* Banner text & icon */}
          <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between text-white">
            <div className="flex flex-col gap-0.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-burnished/90 text-white text-[10px] font-bold uppercase tracking-wider w-max shadow-2xs">
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>Registro Exitoso</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white leading-tight drop-shadow-sm mt-1">
                ¡Bienvenido a la Comunidad!
              </h3>
              <p className="text-[11px] text-stone-200">
                Biblioteca Popular San Tito Brandsma · Capilla Ntra. Sra. de Lourdes
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-gold-accent shadow-xs shrink-0">
              <span className="material-symbols-outlined text-2xl">how_to_reg</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CARNET DIGITAL DEL LECTOR                                    */}
        {/* ============================================================ */}
        <div className="p-6 flex flex-col gap-5">
          {/* Card simulating physical library card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-white via-parchment-base to-gold-light/25 border-2 border-gold-burnished/40 p-5 shadow-sm overflow-hidden">
            {/* Subtle watermark background icon */}
            <span className="material-symbols-outlined absolute -right-3 -bottom-4 text-7xl text-gold-burnished/10 pointer-events-none select-none">
              local_library
            </span>

            <div className="flex items-start justify-between gap-3 pb-3 border-b border-marble-border/80">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-warm-charcoal font-bold block">
                  Carnet Oficial de Socio Lector
                </span>
                <h4 className="text-lg font-bold font-display text-sepia-heading leading-tight mt-0.5">
                  {user.name}
                </h4>
                <p className="text-xs text-warm-charcoal">
                  {user.email}
                </p>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-[9px] uppercase tracking-wider text-warm-charcoal font-semibold">
                  N° Credencial
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-gold-burnished text-white font-mono font-bold text-xs shadow-2xs tracking-wide mt-0.5">
                  #{user.member_number}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 text-[11px] text-warm-charcoal">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-gold-burnished text-sm">schedule</span>
                <span>Préstamos por <strong>21 días</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-gold-burnished text-sm">church</span>
                <span>Retiro en <strong>Atrio Parroquial</strong></span>
              </div>
            </div>
          </div>

          {/* Quick usage note */}
          <div className="p-3 rounded-xl bg-gold-light/30 border border-gold-burnished/25 text-xs text-sepia-heading flex items-start gap-2.5">
            <span className="material-symbols-outlined text-gold-burnished text-base shrink-0 mt-0.5">
              info
            </span>
            <p className="leading-relaxed text-[11px]">
              Tu carnet ya está activo en nuestro sistema. Podés buscar cualquier obra en el catálogo, pulsar <strong>"Reservar"</strong> y retirar tus libros tras la misa o en secretaría (Sigmund Freud 201, Temperley).
            </p>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={handleStart}
            className="w-full py-3.5 px-6 rounded-xl bg-gold-burnished hover:bg-gold-accent text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer hover:shadow-lg active:scale-[0.99]"
          >
            <span>Explorar Catálogo & Reservar Mi Primer Libro</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-parchment-surface border-t border-marble-border/60 text-center text-[11px] text-warm-charcoal">
          Capilla Nuestra Señora de Lourdes • Sigmund Freud 201, Temperley
        </div>
      </div>
    </div>
  );
}
