import React, { useState } from 'react';
import { api, resolveMediaUrl } from '../api';

const PRESET_IMAGES = [
  { label: 'Fachada Capilla', url: '/capilla-fachada.jpg' },
  { label: 'Virgen de Lourdes', url: '/virgen-lourdes.jpg' },
  { label: 'San Tito Brandsma', url: '/hero-titus.jpg' },
];

const SECTION_TABS = [
  { id: 'carrusel', label: 'Carrusel de Portada', badge: '3 Slides Rotativos', icon: 'view_carousel' },
  { id: 'noticias', label: 'Noticias & Cartelera', badge: '1 Foto Fija', icon: 'newspaper' },
  { id: 'reservas', label: 'Mis Reservas', badge: '1 Foto Fija', icon: 'bookmark' },
  { id: 'horarios', label: 'Horarios del Despacho', badge: '1 Foto Fija', icon: 'schedule' },
  { id: 'sidebar', label: 'Barra Lateral (Tótem)', badge: '1 Foto Fija', icon: 'vertical_split' },
  { id: 'auth', label: 'Login & Registro', badge: '1 Foto Fija c/u', icon: 'login' },
];

const BANNER_DEFINITIONS = [
  // 1. Carrusel Portada (El único con 3 fotos/slides)
  {
    key: 'hero_slide_1',
    category: 'carrusel',
    label: 'Slide 1 · Nuestra Señora de Lourdes',
    location: 'Portada del Catálogo (Slide Inicial)',
    icon: 'flare',
  },
  {
    key: 'hero_slide_2',
    category: 'carrusel',
    label: 'Slide 2 · San Tito Brandsma',
    location: 'Portada del Catálogo (Slide Central)',
    icon: 'menu_book',
  },
  {
    key: 'hero_slide_3',
    category: 'carrusel',
    label: 'Slide 3 · Biblioteca Parroquial Abierta',
    location: 'Portada del Catálogo (Slide Comunitario)',
    icon: 'church',
  },

  // 2. Noticias & Cartelera (1 sola foto fija)
  {
    key: 'noticias_banner',
    category: 'noticias',
    label: 'Banner Editorial de Noticias & Cartelera',
    location: 'Encabezado superior fijo en la sección Noticias',
    icon: 'newspaper',
  },

  // 3. Mis Reservas (1 sola foto fija)
  {
    key: 'reservas_banner',
    category: 'reservas',
    label: 'Banner Guía de Retiro en 3 Pasos',
    location: 'Encabezado superior fijo en Mis Reservas',
    icon: 'bookmark',
  },

  // 4. Modal de Horarios (1 sola foto fija)
  {
    key: 'horarios_modal',
    category: 'horarios',
    label: 'Cabecera Fotográfica del Despacho',
    location: 'Ventana emergente fija de Horarios de Secretaría',
    icon: 'schedule',
  },

  // 5. Barra Lateral / Tótem (1 sola foto fija)
  {
    key: 'sidebar_totem',
    category: 'sidebar',
    label: 'Tarjeta Tótem Inferior de la Biblioteca',
    location: 'Pie de la barra lateral izquierda fija',
    icon: 'vertical_split',
  },

  // 6. Login y Registro (1 sola foto fija cada una)
  {
    key: 'login_screen',
    category: 'auth',
    label: 'Pantalla de Acceso (Login)',
    location: 'Columna izquierda 50/50 fija de inicio de sesión',
    icon: 'login',
  },
  {
    key: 'registro_screen',
    category: 'auth',
    label: 'Pantalla de Registro de Lectores',
    location: 'Columna izquierda 50/50 fija de nuevo lector',
    icon: 'person_add',
  },
];

export default function BannersView({ banners = {}, onUpdateBanners }) {
  const [activeCategory, setActiveCategory] = useState('carrusel');
  const [editingBanners, setEditingBanners] = useState({});
  const [uploadingKey, setUploadingKey] = useState(null);
  const [savingKey, setSavingKey] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync initial state from prop
  const getBannerData = (key) => {
    return editingBanners[key] || banners[key] || {
      key,
      title: '',
      tagline: '',
      subtitle: '',
      quote: '',
      description: '',
      image_url: '/capilla-fachada.jpg',
      badge_text: '',
      button_text: '',
    };
  };

  const handleFieldChange = (key, field, value) => {
    const current = getBannerData(key);
    setEditingBanners((prev) => ({
      ...prev,
      [key]: {
        ...current,
        [field]: value,
      },
    }));
  };

  const handleFileUpload = async (key, file) => {
    if (!file) return;
    try {
      setUploadingKey(key);
      const res = await api.uploadFile(file, 'banners');
      const resolvedUrl = resolveMediaUrl(res.url);
      handleFieldChange(key, 'image_url', resolvedUrl);
      setToastMessage({
        type: 'success',
        text: `¡Foto subida a Neon Storage con éxito! Recordá guardar los cambios del banner.`,
      });
    } catch (err) {
      console.error(err);
      setToastMessage({
        type: 'error',
        text: `Error al subir imagen: ${err.message}`,
      });
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSaveBanner = async (key) => {
    try {
      setSavingKey(key);
      const dataToSave = getBannerData(key);
      await api.updateBanner(dataToSave);
      if (onUpdateBanners) {
        await onUpdateBanners();
      }
      setToastMessage({
        type: 'success',
        text: `¡Banner "${dataToSave.title || key}" guardado exitosamente en la base de datos!`,
      });
    } catch (err) {
      console.error(err);
      setToastMessage({
        type: 'error',
        text: `No se pudo guardar el banner: ${err.message}`,
      });
    } finally {
      setSavingKey(null);
    }
  };

  const handleResetBanner = async (key) => {
    if (!window.confirm('¿Deseás restaurar este banner a su imagen y textos originales de fábrica?')) {
      return;
    }
    try {
      setSavingKey(key);
      await api.resetBanner(key);
      if (onUpdateBanners) {
        await onUpdateBanners();
      }
      setEditingBanners((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      setToastMessage({
        type: 'success',
        text: `Banner restaurado a su configuración original.`,
      });
    } catch (err) {
      console.error(err);
      setToastMessage({
        type: 'error',
        text: `Error al restaurar: ${err.message}`,
      });
    } finally {
      setSavingKey(null);
    }
  };

  const handleResetAll = async () => {
    if (!window.confirm('¿Estás seguro de restaurar TODOS los banners del sitio a sus fotos y textos originales?')) {
      return;
    }
    try {
      setSavingKey('all');
      await api.resetBanner('');
      if (onUpdateBanners) {
        await onUpdateBanners();
      }
      setEditingBanners({});
      setToastMessage({
        type: 'success',
        text: `Todos los banners fueron restaurados a su configuración de fábrica.`,
      });
    } catch (err) {
      console.error(err);
      setToastMessage({
        type: 'error',
        text: `Error al restaurar todos: ${err.message}`,
      });
    } finally {
      setSavingKey(null);
    }
  };

  const filteredDefinitions = BANNER_DEFINITIONS.filter(
    (def) => def.category === activeCategory
  );

  const activeTabMeta = SECTION_TABS.find((t) => t.id === activeCategory);

  return (
    <div className="flex flex-col w-full pb-12 animate-fade-in">
      {/* Top Header */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 mb-6 border-b border-marble-border">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-gold-burnished font-bold">
              Identidad Visual & Contenido
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
            <span className="text-xs text-warm-charcoal">Gestión por Sección</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-sepia-heading tracking-tight">
            Banners, Fotografías y Mensajes
          </h2>
          <p className="text-xs sm:text-sm text-warm-charcoal mt-0.5 max-w-3xl">
            Modificá las fotos y textos de cada sección. El único lugar con carrusel rotativo (3 fotos) es la <strong>Portada</strong>.
            Las demás secciones (Noticias, Mis Reservas, Horarios, etc.) tienen una <strong>única foto fija</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetAll}
            disabled={savingKey === 'all'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-parchment-card hover:bg-white text-sepia-heading border border-marble-border text-xs font-semibold shadow-2xs transition-all hover:border-terracotta/40 hover:text-terracotta cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            <span>Restaurar Todos los Originales</span>
          </button>
        </div>
      </section>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`mb-6 p-4 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
            toastMessage.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">
              {toastMessage.type === 'error' ? 'error' : 'verified'}
            </span>
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-warm-charcoal hover:text-sepia-heading"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Clear Specific Tabs Per Section */}
      <div className="flex items-center gap-2 p-1.5 bg-parchment-surface rounded-2xl border border-marble-border mb-8 max-w-full flex-wrap">
        {SECTION_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gold-burnished text-white shadow-xs'
                  : 'text-warm-charcoal hover:bg-white hover:text-sepia-heading'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-white/20 text-white' : 'bg-parchment-card text-warm-charcoal'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Section Explanatory Pill */}
      <div className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-marble-border shadow-2xs max-w-max">
        <span className="material-symbols-outlined text-gold-burnished text-base">info</span>
        <span className="text-xs text-warm-charcoal">
          Sección activa: <strong className="text-sepia-heading">{activeTabMeta?.label}</strong> · {activeTabMeta?.badge}
        </span>
      </div>

      {/* Banner Cards Grid */}
      <div className="flex flex-col gap-8">
        {filteredDefinitions.map((def) => {
          const item = getBannerData(def.key);
          const isUploading = uploadingKey === def.key;
          const isSaving = savingKey === def.key;

          return (
            <div
              key={def.key}
              className="bg-white rounded-3xl border border-marble-border shadow-xs overflow-hidden flex flex-col transition-all hover:shadow-sm"
            >
              {/* Card Top Title Bar */}
              <div className="px-6 py-4 bg-parchment-surface/60 border-b border-marble-border flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gold-light text-gold-burnished border border-gold-burnished/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">{def.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-display text-sepia-heading leading-tight">
                      {def.label}
                    </h3>
                    <p className="text-[11px] text-warm-charcoal font-medium">
                      Ubicación: <strong className="text-sepia-heading">{def.location}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleResetBanner(def.key)}
                    disabled={isSaving}
                    title="Restaurar a valores de fábrica"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-marble-border text-[11px] font-semibold text-warm-charcoal hover:text-terracotta hover:border-terracotta/40 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">restart_alt</span>
                    <span>Restaurar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveBanner(def.key)}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">
                      {isSaving ? 'autorenew' : 'save'}
                    </span>
                    <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
                  </button>
                </div>
              </div>

              {/* Card Body: Split Preview + Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                {/* Left: Live Visual Preview (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-warm-charcoal flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-gold-burnished">visibility</span>
                    Vista Previa en Vivo
                  </span>

                  <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-parchment-card border border-marble-border shadow-inner group">
                    <img
                      src={item.image_url || '/capilla-fachada.jpg'}
                      alt={item.title || 'Banner'}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/capilla-fachada.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 flex flex-col justify-end p-4 text-white">
                      {item.tagline && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gold-light line-clamp-1 mb-1">
                          {item.tagline}
                        </span>
                      )}
                      <h4 className="text-base font-bold font-display leading-tight line-clamp-2">
                        {item.title || 'Título del Banner'}
                      </h4>
                      {item.quote && (
                        <p className="text-[11px] text-parchment-surface/90 italic mt-1 line-clamp-2">
                          "{item.quote}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-parchment-surface border border-marble-border text-[11px] text-warm-charcoal flex items-center justify-between">
                    <span className="truncate pr-2">Foto actual: <strong className="text-sepia-heading font-mono">{item.image_url?.split('/').pop() || 'Ninguna'}</strong></span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                      Activo
                    </span>
                  </div>
                </div>

                {/* Right: Controls & Text Inputs (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4 text-xs">
                  {/* Image Source Selection */}
                  <div className="p-4 rounded-2xl bg-parchment-surface border border-marble-border flex flex-col gap-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="font-bold text-sepia-heading flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-gold-burnished">add_photo_alternate</span>
                        Cambiar Fotografía del Banner
                      </label>
                      <span className="text-[10px] text-warm-charcoal">Formatos: JPG, PNG, WEBP</span>
                    </div>

                    {/* Upload File Input */}
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-dashed border-gold-burnished/50 hover:border-gold-burnished text-sepia-heading font-bold text-xs cursor-pointer shadow-2xs hover:bg-gold-light/20 transition-all">
                        <span className="material-symbols-outlined text-lg text-gold-burnished">
                          {isUploading ? 'autorenew' : 'cloud_upload'}
                        </span>
                        <span>{isUploading ? 'Subiendo a Neon Cloud...' : 'Subir Nueva Foto desde tu PC'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(def.key, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Presets Quick Picker */}
                    <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-marble-border/60">
                      <span className="text-[10px] text-warm-charcoal font-semibold">O elegir foto fija:</span>
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => handleFieldChange(def.key, 'image_url', preset.url)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                            item.image_url === preset.url
                              ? 'bg-gold-burnished text-white border-gold-burnished'
                              : 'bg-white text-sepia-heading border-marble-border hover:bg-parchment-card'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Manual Image URL Input */}
                    <div className="pt-1">
                      <label className="block text-[10px] text-warm-charcoal font-medium mb-1">
                        O escribir / pegar URL directa de la imagen:
                      </label>
                      <input
                        type="text"
                        value={item.image_url || ''}
                        onChange={(e) => handleFieldChange(def.key, 'image_url', e.target.value)}
                        placeholder="https://... o /capilla-fachada.jpg"
                        className="w-full px-3 py-1.5 bg-white rounded-lg border border-marble-border font-mono text-[11px] text-sepia-heading focus:ring-1 focus:ring-gold-burnished"
                      />
                    </div>
                  </div>

                  {/* Text Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-sepia-heading mb-1">
                        Título Principal del Banner
                      </label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => handleFieldChange(def.key, 'title', e.target.value)}
                        placeholder="Ej: Biblioteca Comunitaria..."
                        className="w-full px-3 py-2 bg-white rounded-lg border border-marble-border text-xs font-semibold text-sepia-heading focus:ring-1 focus:ring-gold-burnished"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-sepia-heading mb-1">
                        Epígrafe / Etiqueta Superior (Tagline)
                      </label>
                      <input
                        type="text"
                        value={item.tagline || ''}
                        onChange={(e) => handleFieldChange(def.key, 'tagline', e.target.value)}
                        placeholder="Ej: Patrona & Identidad..."
                        className="w-full px-3 py-2 bg-white rounded-lg border border-marble-border text-xs text-sepia-heading focus:ring-1 focus:ring-gold-burnished"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-sepia-heading mb-1">
                        Texto del Botón o Acción
                      </label>
                      <input
                        type="text"
                        value={item.button_text || ''}
                        onChange={(e) => handleFieldChange(def.key, 'button_text', e.target.value)}
                        placeholder="Ej: Explorar Catálogo"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-marble-border text-xs text-sepia-heading focus:ring-1 focus:ring-gold-burnished"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-sepia-heading mb-1">
                        Cita o Lema Destacado (Entrecomillado)
                      </label>
                      <input
                        type="text"
                        value={item.quote || ''}
                        onChange={(e) => handleFieldChange(def.key, 'quote', e.target.value)}
                        placeholder="Ej: 'Bajo el amparo de la Virgen...'"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-marble-border text-xs italic text-sepia-heading focus:ring-1 focus:ring-gold-burnished"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-sepia-heading mb-1">
                        Descripción o Párrafo Informativo
                      </label>
                      <textarea
                        rows="2"
                        value={item.description || ''}
                        onChange={(e) => handleFieldChange(def.key, 'description', e.target.value)}
                        placeholder="Texto descriptivo para los lectores..."
                        className="w-full px-3 py-2 bg-white rounded-lg border border-marble-border text-xs text-sepia-heading focus:ring-1 focus:ring-gold-burnished leading-relaxed resize-y"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
