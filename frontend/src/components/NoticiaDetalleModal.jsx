import React, { useEffect } from 'react';
import { resolveMediaUrl } from '../api';

export default function NoticiaDetalleModal({ noticia, onClose, onGoToCatalog }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!noticia) return null;

  const pubDate = new Date(noticia.published).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-marble-border shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-marble-border/60 bg-parchment-surface shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-light border border-gold-burnished/30 flex items-center justify-center text-gold-burnished">
              <span className="material-symbols-outlined text-base">newspaper</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-warm-charcoal font-bold">Gaceta Parroquial & Cartelera</p>
              <p className="text-xs font-semibold text-sepia-heading capitalize">{pubDate}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-marble-border/40 text-warm-charcoal flex items-center justify-center transition-colors cursor-pointer border border-marble-border"
            title="Cerrar detalle"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-5">
          {/* News Image */}
          {noticia.image_url && (
            <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-marble-border shadow-xs bg-parchment-surface shrink-0">
              <img
                src={resolveMediaUrl(noticia.image_url)}
                alt={noticia.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-gold-burnished border border-marble-border text-xs font-bold shadow-xs">
                  {noticia.category}
                </span>
              </div>
            </div>
          )}

          {/* Title and metadata */}
          <div className="space-y-2">
            {!noticia.image_url && (
              <span className="inline-block px-3 py-1 rounded-full bg-gold-light text-gold-burnished border border-gold-burnished/30 text-xs font-bold">
                {noticia.category}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-sepia-heading leading-snug">
              {noticia.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-warm-charcoal pt-1">
              <span className="material-symbols-outlined text-base text-gold-burnished">person</span>
              <span className="font-semibold text-sepia-heading">{noticia.author || 'Secretaría Parroquial'}</span>
              <span>•</span>
              <span className="text-warm-charcoal">Capilla Ntra. Sra. de Lourdes</span>
            </div>
          </div>

          {/* Full content */}
          <div className="border-t border-marble-border/70 pt-4">
            <p className="text-sm sm:text-base text-sepia-heading/90 leading-relaxed whitespace-pre-line">
              {noticia.content}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-parchment-surface border-t border-marble-border/60 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-marble-border bg-white hover:bg-parchment-card text-sepia-heading text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Volver a la Cartelera</span>
          </button>
          {onGoToCatalog && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToCatalog();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold-burnished hover:bg-gold-accent text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">auto_stories</span>
              <span>Explorar Catálogo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
