import React from 'react';

export default function NoticiasView({ news, loading, onGoToCatalog }) {
  return (
    <div className="flex flex-col w-full pb-8">
      {/* ============================================================ */}
      {/* MOBILE HEADER & COMMUNITY STATS (from noticias_mobile.html)  */}
      {/* ============================================================ */}
      <div className="lg:hidden flex flex-col gap-3 mb-5">
        <div className="flex items-center justify-between bg-parchment-surface px-4 py-2.5 rounded-xl border border-marble-border shadow-xs">
          <div>
            <p className="text-[10px] text-warm-charcoal uppercase tracking-wider font-semibold">Vida en Comunidad</p>
            <h2 className="text-sm font-bold font-display text-sepia-heading">Gaceta Parroquial & Avisos</h2>
          </div>
          <span className="text-[10px] text-gold-burnished font-mono font-bold">Sigmund Freud 201</span>
        </div>

        {/* 4 Quick Stat Badges */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white rounded-xl p-2.5 flex flex-col items-center text-center border border-marble-border shadow-2xs">
            <span className="text-base font-bold font-display text-sepia-heading">8</span>
            <span className="text-[9px] text-warm-charcoal mt-0.5 leading-tight">Avisos Mes</span>
          </div>
          <div className="bg-white rounded-xl p-2.5 flex flex-col items-center text-center border border-marble-border shadow-2xs">
            <span className="text-base font-bold font-display text-sepia-heading">3</span>
            <span className="text-[9px] text-warm-charcoal mt-0.5 leading-tight">Clubes</span>
          </div>
          <div className="bg-white rounded-xl p-2.5 flex flex-col items-center text-center border border-marble-border shadow-2xs">
            <span className="text-base font-bold font-display text-sepia-heading">2</span>
            <span className="text-[9px] text-warm-charcoal mt-0.5 leading-tight">Eventos</span>
          </div>
          <div className="bg-white rounded-xl p-2.5 flex flex-col items-center text-center border border-marble-border shadow-2xs">
            <span className="text-base font-bold font-display text-gold-burnished">45+</span>
            <span className="text-[9px] text-warm-charcoal mt-0.5 leading-tight">Libros</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP HEADER BANNER                                         */}
      {/* ============================================================ */}
      <div className="hidden lg:flex items-center justify-between pb-6 mb-8 border-b border-marble-border flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gold-light border border-gold-burnished/30 flex items-center justify-center text-gold-burnished shadow-xs">
            <span className="material-symbols-outlined text-2xl">newspaper</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold font-display text-sepia-heading">
              Noticias & Cartelera Comunitaria
            </h2>
            <p className="text-xs text-warm-charcoal">
              Novedades, club de lectura barrial, donaciones y actividades de la biblioteca.
            </p>
          </div>
        </div>

        <button
          onClick={onGoToCatalog}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-parchment-card hover:bg-white text-sepia-heading border border-marble-border text-xs font-semibold transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-base text-gold-burnished">auto_stories</span>
          Ir al Catálogo
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-warm-charcoal">
          <span className="material-symbols-outlined text-3xl animate-spin text-gold-burnished mb-2">autorenew</span>
          <p className="text-xs">Cargando comunicados...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {news.map((item) => {
            const pubDate = new Date(item.published).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-marble-border shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-parchment-surface">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-gold-burnished border border-marble-border text-[11px] font-bold shadow-2xs">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col gap-1.5">
                    <span className="text-[10px] text-warm-charcoal font-medium">{pubDate}</span>
                    <h3 className="text-base font-bold font-display text-sepia-heading leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-warm-charcoal leading-relaxed mt-1">
                      {item.content}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-marble-border/60 flex items-center justify-between text-[11px] text-warm-charcoal">
                  <span className="italic">{item.author}</span>
                  <button
                    type="button"
                    onClick={onGoToCatalog}
                    className="text-gold-burnished font-bold hover:underline"
                  >
                    Ver en catálogo →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
