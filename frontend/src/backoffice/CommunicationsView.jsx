import React, { useState } from 'react';

export default function CommunicationsView({
  news = [],
  onAddNews,
  onDeleteNews,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Avisos & Comunidad',
    snippet: '',
    content: '',
    author: 'Secretaría Parroquial',
    image_url: '',
  });

  const categories = [
    'Avisos & Comunidad',
    'Adquisición & Catálogo',
    'Club de Lectura',
    'Formación & Charlas',
    'Horarios & Culto',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.snippet) {
      alert('Por favor ingrese el título y el resumen del comunicado.');
      return;
    }
    const img =
      formData.image_url ||
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80';
    await onAddNews({
      ...formData,
      image_url: img,
    });
    setShowAddModal(false);
    setFormData({
      title: '',
      category: 'Avisos & Comunidad',
      snippet: '',
      content: '',
      author: 'Secretaría Parroquial',
      image_url: '',
    });
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Header */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 mb-6 border-b border-marble-border">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-gold-burnished font-bold">
              Gestión de Contenidos & Gaceta Parroquial
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
            <span className="text-xs text-warm-charcoal">Comunicaciones Comunitarias</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-sepia-heading tracking-tight">
            Comunicaciones, Boletines y Anuncios
          </h2>
          <p className="text-xs sm:text-sm text-warm-charcoal mt-0.5">
            Publicación y difusión de noticias, colectas de libros, convocatorias de lectura y avisos del atrio.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">post_add</span>
            <span>+ Redactar Nuevo Comunicado</span>
          </button>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              Comunicaciones Activas
            </span>
            <h4 className="text-2xl font-bold font-display text-sepia-heading mt-1">
              {news.length}
            </h4>
            <span className="text-[11px] text-gold-burnished font-semibold">En Cartelera Web</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-light text-gold-burnished flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">feed</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              Lecturas Estimadas
            </span>
            <h4 className="text-2xl font-bold font-display text-emerald-800 mt-1">
              1,420
            </h4>
            <span className="text-[11px] text-emerald-700 font-semibold">Comunidad del barrio</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">visibility</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              Canales Integrados
            </span>
            <h4 className="text-2xl font-bold font-display text-marian-blue mt-1">
              3
            </h4>
            <span className="text-[11px] text-marian-blue font-semibold">Web · Atrio · Hoja Dominical</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-marian-blue flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">share</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              Próximo Boletín
            </span>
            <h4 className="text-2xl font-bold font-display text-gold-burnished mt-1">
              Domingo
            </h4>
            <span className="text-[11px] text-warm-charcoal">Post-Misa de 11 hs</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-light text-gold-burnished flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">event</span>
          </div>
        </div>
      </section>

      {/* Main Grid: News List (Left 8 cols) + Editorial Guidelines (Right 4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* News Announcements List */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          <div className="p-4 bg-white rounded-2xl border border-marble-border shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-gold-burnished text-lg">campaign</span>
              <h3 className="font-bold font-display text-sm text-sepia-heading">
                Boletines y Comunicados en Publicación ({news.length})
              </h3>
            </div>
            <span className="text-xs text-warm-charcoal">
              Se visualizan inmediatamente en la Cartelera de Lectores
            </span>
          </div>

          {news.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-marble-border shadow-xs hover:border-gold-burnished/40 transition-all flex flex-col sm:flex-row gap-4 items-start"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full sm:w-36 h-28 object-cover rounded-xl shadow-xs border border-marble-border shrink-0"
                />
              )}
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-light text-gold-burnished">
                      {item.category || 'Avisos & Comunidad'}
                    </span>
                    <span className="text-[11px] text-warm-charcoal">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Reciente'}
                    </span>
                  </div>

                  <h4 className="font-bold font-display text-base text-sepia-heading hover:text-gold-burnished transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-warm-charcoal mt-1 line-clamp-2 leading-relaxed">
                    {item.snippet || item.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-marble-border flex items-center justify-between text-xs text-warm-charcoal">
                  <span>Por {item.author || 'Secretaría Parroquial'}</span>
                  {onDeleteNews && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`¿Eliminar el comunicado "${item.title}"?`)) {
                          onDeleteNews(item.id);
                        }
                      }}
                      className="text-terracotta hover:underline font-bold text-xs flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      <span>Retirar de Cartelera</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Editorial Guidelines Card (Right 4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 border border-marble-border shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-marble-border mb-3">
              <span className="material-symbols-outlined text-gold-burnished text-lg">edit_note</span>
              <h4 className="font-bold font-display text-sm text-sepia-heading">
                Pautas de Difusión Parroquial
              </h4>
            </div>

            <div className="space-y-3 text-xs text-warm-charcoal leading-relaxed">
              <div className="p-3 bg-parchment-base rounded-xl border border-marble-border">
                <strong className="text-sepia-heading block mb-0.5">Tono de la Biblioteca</strong>
                Los anuncios deben mantener un tono cordial, fraterno e integrador para todo el barrio de Temperley.
              </div>

              <div className="p-3 bg-parchment-base rounded-xl border border-marble-border">
                <strong className="text-sepia-heading block mb-0.5">Campañas de Donación</strong>
                Se aceptan todo tipo de géneros literarios (novelas, clásicos, infantiles, ciencia y filosofía).
              </div>

              <div className="p-3 bg-parchment-base rounded-xl border border-marble-border">
                <strong className="text-sepia-heading block mb-0.5">Sincronización con el Atrio</strong>
                Las novedades publicadas aquí se reflejan en la pantalla de la gacetilla pública y en la cartelera física.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Redactar Comunicado */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-marble-border relative animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-marble-border mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gold-light text-gold-burnished flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">post_add</span>
                </div>
                <div>
                  <h3 className="font-bold font-display text-base text-sepia-heading">
                    Redactar Nuevo Comunicado
                  </h3>
                  <p className="text-[11px] text-warm-charcoal">
                    Publicación oficial para la Gaceta Comunitaria
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-parchment-base text-warm-charcoal flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-bold text-sepia-heading mb-1">Título del Comunicado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Gran Colecta Anual: Nuevas novelas y clásicos para el barrio"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sepia-heading mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sepia-heading mb-1">Firmante / Autor</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sepia-heading mb-1">Resumen / Copete *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Breve extracto que se leerá en la portada..."
                  value={formData.snippet}
                  onChange={(e) => setFormData({ ...formData, snippet: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-sepia-heading mb-1">Cuerpo Completo del Anuncio</label>
                <textarea
                  rows="4"
                  placeholder="Detalle completo de la noticia, fechas, horarios y requisitos..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-sepia-heading mb-1">URL de Fotografía / Imagen (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-marble-border mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-parchment-base text-warm-charcoal font-bold hover:bg-parchment-card"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white font-bold shadow-xs cursor-pointer"
                >
                  Publicar en Cartelera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
