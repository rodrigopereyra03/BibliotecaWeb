import React, { useState } from 'react';
import { api } from '../api';

export default function InventoryView({
  books = [],
  loading = false,
  onAddBook,
  onDeleteBook,
  onDeliverReservation,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBook, setSelectedBook] = useState(books[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [qrModalBook, setQrModalBook] = useState(null);

  // File upload loading states
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Form state for new book
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'Novela Histórica',
    year: 2024,
    shelf_location: 'Estantería 2A · Módulo 01',
    copies: 2,
    available_copies: 2,
    format: 'Físico',
    cover_image: '',
    digital_url: '',
    description: '',
  });

  const categories = [
    'ALL',
    'Novela Histórica',
    'Literatura Universal',
    'Filosofía & Clásicos',
    'Misterio & Suspenso',
    'Terror & Cuentos',
    'Patrística & Teología',
    'Juvenil & Formación',
  ];

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((b.shelf_location || b.location) && (b.shelf_location || b.location).toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || b.genre === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectBook = (book) => {
    setSelectedBook(book);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setUploadError('');
    try {
      const res = await api.uploadFile(file, 'covers');
      setFormData((prev) => ({ ...prev, cover_image: res.url }));
    } catch (err) {
      setUploadError('Error al subir la imagen de portada a Neon: ' + (err.message || err));
    } finally {
      setUploadingCover(false);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    setUploadError('');
    try {
      const res = await api.uploadFile(file, 'pdfs');
      setFormData((prev) => ({
        ...prev,
        digital_url: res.url,
        format: prev.format === 'Físico' ? 'Ambos' : prev.format,
      }));
    } catch (err) {
      setUploadError('Error al subir el archivo PDF a Neon: ' + (err.message || err));
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSubmitNewBook = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author) {
      alert('Por favor complete al menos el título y el autor.');
      return;
    }
    const cover =
      formData.cover_image ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
    await onAddBook({
      ...formData,
      cover_image: cover,
      cover_url: cover,
      copies: parseInt(formData.copies) || 1,
      available_copies: parseInt(formData.copies) || 1,
      year: parseInt(formData.year) || 2024,
    });
    setShowAddModal(false);
    setFormData({
      title: '',
      author: '',
      genre: 'Novela Histórica',
      year: 2024,
      shelf_location: 'Estantería 2A · Módulo 01',
      copies: 2,
      available_copies: 2,
      format: 'Físico',
      cover_image: '',
      digital_url: '',
      description: '',
    });
  };

  const activeSelected = selectedBook || filteredBooks[0] || books[0];

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Header & Kicker */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 mb-6 border-b border-marble-border">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-gold-burnished font-bold">
              Catálogo e Inventario de Libros
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
            <span className="text-xs text-warm-charcoal">Gestión General de Ejemplares</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-sepia-heading tracking-tight">
            Gestión e Inventario de Libros
          </h2>
          <p className="text-xs sm:text-sm text-warm-charcoal mt-0.5">
            Inventario centralizado, signaturas topográficas, estanterías y control de ejemplares disponibles y reservados.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add_box</span>
            <span>+ Registrar Nuevo Título</span>
          </button>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              Total Ejemplares
            </span>
            <h4 className="text-2xl font-bold font-display text-sepia-heading mt-1">
              {books.reduce((acc, b) => acc + (b.copies || 1), 0)}
            </h4>
            <span className="text-[11px] text-gold-burnished font-semibold">
              {books.length} Títulos Registrados
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-light text-gold-burnished flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">auto_stories</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              En Sala / Disponibles
            </span>
            <h4 className="text-2xl font-bold font-display text-emerald-800 mt-1">
              {books.reduce((acc, b) => acc + (b.available_copies || 0), 0)}
            </h4>
            <span className="text-[11px] text-emerald-700 font-semibold">Listos para Retiro</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">check_circle</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              En Préstamo / Reserva
            </span>
            <h4 className="text-2xl font-bold font-display text-terracotta mt-1">
              {books.reduce((acc, b) => acc + Math.max(0, (b.copies || 1) - (b.available_copies || 0)), 0)}
            </h4>
            <span className="text-[11px] text-terracotta font-semibold">En manos de lectores</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-terracotta flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">schedule</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              Formato Híbrido
            </span>
            <h4 className="text-2xl font-bold font-display text-marian-blue mt-1">
              {books.filter((b) => b.format === 'Ambos' || b.format === 'Digital').length}
            </h4>
            <span className="text-[11px] text-marian-blue font-semibold">Con versión PDF</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-marian-blue flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">sim_card_download</span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-white p-4 rounded-2xl border border-marble-border shadow-xs mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por título, autor o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-parchment-base rounded-lg border border-marble-border text-xs focus:outline-none focus:ring-1 focus:ring-gold-burnished"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <label className="text-xs text-warm-charcoal shrink-0 font-medium">Categoría:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-parchment-base border border-marble-border rounded-lg text-xs px-3 py-2 text-sepia-heading focus:outline-none focus:ring-1 focus:ring-gold-burnished font-medium cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'Todas las Categorías' : c}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Main Content Grid: Table (Left 8 cols) + Ficha Tecnica (Right 4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Table Column */}
        <div className="xl:col-span-8 bg-white rounded-2xl border border-marble-border shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 bg-parchment-surface border-b border-marble-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-gold-burnished text-lg">menu_book</span>
              <h3 className="font-bold font-display text-sm text-sepia-heading">
                Catálogo General de Ejemplares ({filteredBooks.length})
              </h3>
            </div>
            <span className="text-[11px] text-warm-charcoal">
              Haga clic en una fila para ver su ficha
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-parchment-base/80 text-warm-charcoal uppercase tracking-wider text-[10px] border-b border-marble-border">
                  <th className="py-3 px-4">Tomo / Signatura</th>
                  <th className="py-3 px-4">Título & Autoría</th>
                  <th className="py-3 px-4">Ubicación</th>
                  <th className="py-3 px-4">Copias</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-marble-border text-sepia-heading">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-warm-charcoal">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-4xl text-gold-burnished/60">menu_book</span>
                        <p className="font-bold text-sm text-sepia-heading">No hay libros en el inventario</p>
                        <p className="text-xs text-warm-charcoal max-w-sm">
                          La base de datos se encuentra limpia. Haz clic en el botón superior "+ Registrar Nuevo Título" para dar de alta el primer libro.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => {
                    const isSelected = activeSelected && activeSelected.id === book.id;
                    const available = book.available_copies !== undefined ? book.available_copies : (book.copies || 1);
                    const total = book.total_copies || book.copies || 1;
                    const isAvailable = available > 0;
                    const cover = book.cover_url || book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                    const loc = book.location || book.shelf_location || 'Estantería General';

                    return (
                      <tr
                        key={book.id}
                        onClick={() => handleSelectBook(book)}
                        className={`hover:bg-gold-light/20 transition-colors cursor-pointer group ${
                          isSelected ? 'bg-gold-light/30' : ''
                        }`}
                      >
                        <td className="py-3 px-4 align-middle">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={cover}
                              alt={book.title}
                              className="w-9 h-13 object-cover rounded shadow-xs shrink-0 border border-marble-border"
                            />
                            <div>
                              <span className="inline-block px-1.5 py-0.5 rounded bg-gold-light text-gold-burnished font-mono font-bold text-[9px]">
                                {loc.split('·')[0].trim()}
                              </span>
                              <p className="text-[10px] text-warm-charcoal mt-0.5">{book.year || 2024}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 align-middle">
                          <p className="font-bold text-sepia-heading group-hover:text-gold-burnished transition-colors">
                            {book.title}
                          </p>
                          <p className="text-[11px] text-warm-charcoal">{book.author}</p>
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] bg-parchment-surface border border-marble-border text-warm-charcoal font-semibold">
                            {book.genre}
                          </span>
                        </td>

                        <td className="py-3 px-4 align-middle">
                          <div className="flex items-center gap-1 text-sepia-heading font-semibold">
                            <span className="material-symbols-outlined text-xs text-gold-burnished">meeting_room</span>
                            <span>{loc}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 align-middle">
                          <span className="font-semibold text-sepia-heading">
                            {available} / {total}
                          </span>
                          <span className="block text-[10px] text-warm-charcoal">
                            {book.format || 'Físico'}
                          </span>
                        </td>

                        <td className="py-3 px-4 align-middle">
                          {isAvailable ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              Disponible
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                              Prestado / Reservado
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setQrModalBook(book)}
                              title="Ver QR del Tomo"
                              className="p-1 rounded hover:bg-gold-light text-gold-burnished transition-colors"
                            >
                              <span className="material-symbols-outlined text-base">qr_code_2</span>
                            </button>
                            {onDeleteBook && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`¿Desea eliminar "${book.title}" del inventario?`)) {
                                    onDeleteBook(book.id);
                                  }
                                }}
                                title="Eliminar del Catálogo"
                                className="p-1 rounded hover:bg-red-50 text-terracotta transition-colors"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-parchment-surface border-t border-marble-border flex items-center justify-between text-xs text-warm-charcoal">
            <span>Mostrando {filteredBooks.length} ejemplares registrados</span>
            <span>Sede Central Capilla de Lourdes</span>
          </div>
        </div>

        {/* Right Column: Ficha Técnica */}
        {activeSelected && (
          <div className="xl:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-5 border border-marble-border shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-marble-border">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-gold-burnished text-lg">fact_check</span>
                  <h4 className="font-bold font-display text-sm text-sepia-heading">
                    Ficha Técnica del Activo
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-gold-light text-gold-burnished font-mono font-bold text-[10px]">
                  ID #{activeSelected.id}
                </span>
              </div>

              <div className="mt-4 flex gap-4 items-start">
                <img
                  src={activeSelected.cover_url || activeSelected.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                  alt={activeSelected.title}
                  className="w-20 h-28 object-cover rounded-lg shadow-sm shrink-0 border border-marble-border"
                />
                <div className="flex flex-col">
                  <h5 className="font-bold font-display text-sm text-sepia-heading leading-tight">
                    {activeSelected.title}
                  </h5>
                  <p className="text-xs text-warm-charcoal mt-0.5">{activeSelected.author}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] bg-parchment-base border border-marble-border text-gold-burnished font-semibold">
                    {activeSelected.genre} · {activeSelected.year || 2024}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1">
                    {activeSelected.available_copies !== undefined ? activeSelected.available_copies : (activeSelected.copies || 1)} de {activeSelected.total_copies || activeSelected.copies || 1} disponibles
                  </span>
                  {activeSelected.digital_url && (
                    <a
                      href={activeSelected.digital_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold text-burgundy-primary hover:underline"
                    >
                      <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                      <span>Ver PDF en Neon</span>
                    </a>
                  )}
                </div>
              </div>

              {(activeSelected.synopsis || activeSelected.description) && (
                <div className="mt-3 p-3 bg-parchment-base rounded-xl border border-marble-border text-xs text-warm-charcoal leading-relaxed">
                  {activeSelected.synopsis || activeSelected.description}
                </div>
              )}

              <div className="mt-4 p-3 bg-parchment-surface rounded-xl border border-marble-border">
                <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
                  Localización Física en Depósito
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-gold-burnished text-base">shelves</span>
                  <span className="text-xs font-bold text-sepia-heading">
                    {activeSelected.location || activeSelected.shelf_location || 'Estantería General'}
                  </span>
                </div>
                <p className="text-[11px] text-warm-charcoal mt-1">
                  Módulo central de biblioteca parroquial. Acceso libre para lectores y socios.
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setQrModalBook(activeSelected)}
                  className="flex-1 py-2 px-3 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">print</span>
                  <span>Ver Etiqueta QR</span>
                </button>
              </div>
            </div>

            {/* Policy Info Card */}
            <div className="bg-parchment-surface rounded-2xl p-4 border border-marble-border text-xs text-warm-charcoal">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-gold-burnished text-lg mt-0.5">policy</span>
                <div>
                  <h6 className="font-bold text-sepia-heading text-xs">Normas de Préstamo de Libros</h6>
                  <p className="text-[11px] mt-1 leading-relaxed">
                    Todo ejemplar retirado cuenta con un plazo de 21 días corridos. Prórrogas autorizadas vía portal web o mostrador parroquial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Registrar Nuevo Libro */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-marble-border relative animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-marble-border mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gold-light text-gold-burnished flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">add_box</span>
                </div>
                <div>
                  <h3 className="font-bold font-display text-base text-sepia-heading">
                    Registrar Nuevo Título
                  </h3>
                  <p className="text-[11px] text-warm-charcoal">
                    Biblioteca Parroquial Ntra. Sra. de Lourdes
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

            <form onSubmit={handleSubmitNewBook} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-bold text-sepia-heading mb-1">Título de la Obra *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ficciones, El Principito, Tratado de la Devoción"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sepia-heading mb-1">Autor / Autoría *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Jorge Luis Borges"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sepia-heading mb-1">Género / Categoría</label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading"
                  >
                    {categories.filter((c) => c !== 'ALL').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-sepia-heading mb-1">Año Publicación</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sepia-heading mb-1">Total Copias</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.copies}
                    onChange={(e) => setFormData({ ...formData, copies: e.target.value, available_copies: e.target.value })}
                    className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sepia-heading mb-1">Formato</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading"
                  >
                    <option value="Físico">Físico</option>
                    <option value="Digital">Digital (PDF)</option>
                    <option value="Ambos">Ambos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-sepia-heading mb-1">Ubicación / Estantería</label>
                <input
                  type="text"
                  placeholder="Ej. Estantería 2A · Módulo 01"
                  value={formData.shelf_location}
                  onChange={(e) => setFormData({ ...formData, shelf_location: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading"
                />
              </div>

              {/* Portada: URL o subir desde PC a Neon Bucket 'biblioteca' */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-sepia-heading">Portada del Libro</label>
                  <span className="text-[10px] text-warm-charcoal">URL directa o subir archivo</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://... o sube una imagen de tu PC"
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="flex-1 px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading text-xs"
                  />
                  <label className={`px-3 py-2 rounded-lg border border-gold-burnished/50 bg-gold-light/30 hover:bg-gold-light/60 text-gold-burnished font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs shrink-0 ${uploadingCover ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <span className="material-symbols-outlined text-base">cloud_upload</span>
                    <span>{uploadingCover ? 'Subiendo...' : 'Subir Portada'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingCover}
                      onChange={handleCoverUpload}
                    />
                  </label>
                </div>
                {formData.cover_image && (
                  <div className="mt-2 flex items-center gap-2 p-1.5 bg-parchment-base rounded-lg border border-marble-border text-[11px] text-warm-charcoal">
                    <img src={formData.cover_image} alt="Preview Portada" className="w-7 h-9 object-cover rounded shadow-2xs border border-marble-border shrink-0" />
                    <span className="truncate flex-1 font-mono text-[10px]">{formData.cover_image}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cover_image: '' })}
                      className="text-terracotta hover:underline font-bold text-[10px]"
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>

              {/* PDF Digital: URL o subir archivo a Neon Bucket 'biblioteca' */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-sepia-heading">Archivo Digital / PDF (Opcional)</label>
                  <span className="text-[10px] text-warm-charcoal">Almacenamiento Neon</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="URL del PDF o sube el documento"
                    value={formData.digital_url || ''}
                    onChange={(e) => setFormData({ ...formData, digital_url: e.target.value })}
                    className="flex-1 px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading text-xs"
                  />
                  <label className={`px-3 py-2 rounded-lg border border-burgundy-soft/40 bg-burgundy-soft/10 hover:bg-burgundy-soft/20 text-burgundy-primary font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs shrink-0 ${uploadingPdf ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <span className="material-symbols-outlined text-base">upload_file</span>
                    <span>{uploadingPdf ? 'Subiendo PDF...' : 'Subir PDF'}</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      disabled={uploadingPdf}
                      onChange={handlePdfUpload}
                    />
                  </label>
                </div>
                {formData.digital_url && (
                  <div className="mt-2 flex items-center gap-2 p-1.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-800">
                    <span className="material-symbols-outlined text-sm text-emerald-600">picture_as_pdf</span>
                    <span className="truncate flex-1 font-mono text-[10px]">{formData.digital_url}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, digital_url: '' })}
                      className="text-terracotta hover:underline font-bold text-[10px]"
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-terracotta text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{uploadError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-sepia-heading mb-1">Reseña / Descripción</label>
                <textarea
                  rows="3"
                  placeholder="Breve reseña literaria o contenido de la obra..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border focus:ring-1 focus:ring-gold-burnished text-sepia-heading"
                ></textarea>
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
                  Guardar en el Inventario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Etiqueta QR */}
      {qrModalBook && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-marble-border text-center">
            <h4 className="font-bold font-display text-base text-sepia-heading">
              Etiqueta Topográfica & QR
            </h4>
            <p className="text-xs text-warm-charcoal mt-1">{qrModalBook.title}</p>
            <div className="p-4 bg-parchment-base rounded-xl border border-marble-border my-4 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[96px] text-sepia-heading">
                qr_code_2
              </span>
              <span className="font-mono font-bold text-xs text-gold-burnished mt-2">
                LIB-LOURDES-{qrModalBook.id.toString().padStart(4, '0')}
              </span>
              <span className="text-[11px] text-warm-charcoal mt-0.5">
                {qrModalBook.shelf_location || 'Estantería 2A'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setQrModalBook(null)}
              className="w-full py-2 bg-gold-burnished text-white font-bold text-xs rounded-lg hover:bg-gold-accent transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
