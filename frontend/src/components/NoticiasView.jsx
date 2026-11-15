import React, { useState } from 'react';
import { resolveMediaUrl } from '../api';
import NoticiaDetalleModal from './NoticiaDetalleModal';

export default function NoticiasView({ news, loading, onGoToCatalog, banner }) {
  const [selectedNoticia, setSelectedNoticia] = useState(null);
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
      {/* EDITORIAL PANORAMIC BANNER (Desktop & Mobile)                */}
      {/* ============================================================ */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-parchment-surface via-parchment-card to-[#1e3a5f]/15 border border-marble-border shadow-sm mb-8 p-6 sm:p-8 lg:p-10">
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-gold-burnished/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -top-16 w-80 h-80 rounded-full bg-marian-blue/10 blur-3xl pointer-events-none"></div>

        {/* Right side masked image */}
        <div className="absolute right-0 top-0 bottom-0 w-[420px] pointer-events-none select-none overflow-hidden hidden xl:block">
          <img
            src={banner?.image_url || '/hero-titus.jpg'}
            alt="Patrono del Saber y la Comunicación"
            className="w-full h-full object-cover object-top opacity-85 transition-opacity"
            style={{
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 96%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 96%)',
            }}
          />
          <div className="absolute bottom-3 right-5 px-3 py-1 rounded-full bg-sepia-heading/80 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
            <span className="text-[11px] text-parchment-surface font-display font-medium">
              {banner?.subtitle || 'San Tito Brandsma · Patrono del Saber y la Comunicación'}
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-4 max-w-2xl xl:max-w-3xl">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-marble-border shadow-2xs w-max">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
              <span className="text-xs uppercase tracking-wider text-sepia-heading font-bold">
                {banner?.tagline || 'Gaceta Parroquial & Cartelera Barrial • Temperley'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold font-display text-sepia-heading tracking-tight leading-tight">
              {banner?.title || 'La Vida en Comunidad y la Cultura del Encuentro'}
            </h1>

            {banner?.quote && (
              <p className="text-sm text-sepia-heading/90 italic font-display border-l-2 border-gold-burnished pl-3 my-1">
                "{banner.quote.replace(/^"|"$/g, '')}"
              </p>
            )}

            <p className="text-xs sm:text-sm text-warm-charcoal leading-relaxed">
              Consulte aquí los anuncios oficiales, convocatorias al club de lectura, campañas de donación de obras y actividades culturales de la Capilla Nuestra Señora de Lourdes en Sigmund Freud 201.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap pt-1">
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/90 backdrop-blur-sm border border-marble-border shadow-xs">
              <span className="material-symbols-outlined text-gold-burnished text-xl">menu_book</span>
              <span className="text-xs font-bold text-sepia-heading">Colecta de Libros</span>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/90 backdrop-blur-sm border border-marble-border shadow-xs">
              <span className="material-symbols-outlined text-marian-blue text-xl">groups</span>
              <span className="text-xs font-bold text-sepia-heading">Club de Lectura</span>
            </div>

            <button
              onClick={onGoToCatalog}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-burnished hover:bg-gold-accent text-white text-xs font-bold transition-all shadow-xs ml-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">auto_stories</span>
              <span>Explorar Catálogo</span>
            </button>
          </div>
        </div>
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
                onClick={() => setSelectedNoticia(item)}
                className="group rounded-2xl bg-white border border-marble-border shadow-xs hover:shadow-lg hover:border-gold-burnished/40 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-parchment-surface">
                    <img
                      src={resolveMediaUrl(item.image_url)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-gold-burnished border border-marble-border text-[11px] font-bold shadow-2xs">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col gap-1.5">
                    <span className="text-[10px] text-warm-charcoal font-medium">{pubDate}</span>
                    <h3 className="text-base font-bold font-display text-sepia-heading group-hover:text-gold-burnished transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-warm-charcoal leading-relaxed mt-1 line-clamp-3">
                      {item.content}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-marble-border/60 flex items-center justify-between text-[11px] text-warm-charcoal bg-parchment-surface/30">
                  <span className="italic truncate max-w-[150px]">{item.author || 'Secretaría Parroquial'}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNoticia(item);
                    }}
                    className="text-gold-burnished font-bold hover:text-gold-accent hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Leer publicación</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Noticia Detalle Modal */}
      {selectedNoticia && (
        <NoticiaDetalleModal
          noticia={selectedNoticia}
          onClose={() => setSelectedNoticia(null)}
          onGoToCatalog={onGoToCatalog}
        />
      )}
    </div>
  );
}
