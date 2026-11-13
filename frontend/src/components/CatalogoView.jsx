import React, { useState, useEffect, useRef } from 'react';

export default function CatalogoView({
  books,
  loading,
  selectedCategory,
  setSelectedCategory,
  formatFilter,
  setFormatFilter,
  searchTerm,
  setSearchTerm,
  onReserveSuccess,
}) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [pickupSlot, setPickupSlot] = useState('Turno Mañana (10:00 a 13:00 hs)');
  const [note, setNote] = useState('Retiro en mostrador del atrio');
  const [reserving, setReserving] = useState(false);
  const [activeTabMode, setActiveTabMode] = useState('physical');
  const workbenchRef = useRef(null);

  const categories = [
    'Todas las Categorías',
    'Novelas & Ficción',
    'Terror & Misterio',
    'Cuentos & Fantasía',
    'Suspenso & Policial',
    'Cuentos & Infantil',
    'Historia & Biografías',
  ];

  const physicalBooksCount = (books || []).filter(
    (b) => b.format === 'physical' || b.format === 'both' || b.format === 'Físico' || b.format === 'Ambos' || !b.format
  ).length;

  const digitalBooksCount = (books || []).filter(
    (b) => b.has_digital || b.format === 'digital' || b.format === 'both' || b.format === 'Digital' || b.format === 'Ambos' || Boolean(b.digital_url)
  ).length;

  useEffect(() => {
    if (books && books.length > 0 && !selectedBook) {
      setSelectedBook(books[0]);
    }
  }, [books]);

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    if (workbenchRef.current) {
      workbenchRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleConfirmReservation = async () => {
    if (!selectedBook) return;
    setReserving(true);
    try {
      await onReserveSuccess({
        book_id: selectedBook.id,
        pickup_slot: pickupSlot,
        note: note,
        pickup_location: 'Sigmund Freud 201, Temperley',
      });
    } catch (err) {
      alert(err.message || 'Error al confirmar reserva');
    } finally {
      setReserving(false);
    }
  };

  // Recommended featured book (e.g., first available or featured book)
  const featuredBook = books.find((b) => b.featured) || books[0];

  return (
    <div className="flex flex-col w-full pb-8">
      {/* ============================================================ */}
      {/* MOBILE-SPECIFIC HEADER & NOTICE (from catalogo_mobile.html) */}
      {/* ============================================================ */}
      <div className="lg:hidden flex flex-col gap-3 mb-5">
        {/* Mobile Search Bar */}
        <div className="relative flex items-center bg-parchment-card rounded-xl shadow-xs px-3.5 py-2.5 border border-marble-border">
          <span className="material-symbols-outlined text-gold-burnished text-xl mr-2.5 shrink-0">
            search
          </span>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, autor o género..."
            className="w-full bg-transparent border-none outline-none text-xs text-sepia-ink placeholder:text-outline"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-outline hover:text-sepia-ink text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Institutional Notice */}
        <div className="w-full bg-parchment-surface rounded-xl p-3 flex items-center justify-between border border-marble-border shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gold-light border border-gold-burnished/30 flex items-center justify-center shrink-0 text-gold-burnished">
              <span className="material-symbols-outlined text-base">account_balance</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-sepia-heading truncate">
                Libros de la Biblioteca Comunitaria
              </span>
              <span className="text-[10px] text-warm-charcoal truncate">
                Préstamos a domicilio: 21 días renovables
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-marble-border shrink-0">
            <span className="material-symbols-outlined text-xs text-gold-burnished" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="text-[10px] text-sepia-heading font-semibold">Regla Parroquial</span>
          </div>
        </div>

        {/* Mobile Filter Carousel Chips */}
        <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-2 py-1">
          <button
            type="button"
            onClick={() => { setFormatFilter('all'); setSelectedCategory('Todas las Categorías'); }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all ${
              formatFilter === 'all' && selectedCategory === 'Todas las Categorías'
                ? 'bg-gold-burnished text-white'
                : 'bg-white text-warm-charcoal border border-marble-border'
            }`}
          >
            <span className="material-symbols-outlined text-sm">menu_book</span>
            <span>Todos ({books.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFormatFilter('physical')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all ${
              formatFilter === 'physical'
                ? 'bg-gold-burnished text-white'
                : 'bg-white text-warm-charcoal border border-marble-border'
            }`}
          >
            <span className="material-symbols-outlined text-sm">import_contacts</span>
            <span>Libros Físicos</span>
          </button>
          <button
            type="button"
            onClick={() => setFormatFilter('digital')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all ${
              formatFilter === 'digital'
                ? 'bg-marian-blue text-white'
                : 'bg-white text-warm-charcoal border border-marble-border'
            }`}
          >
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
            <span>Descarga PDF</span>
          </button>
          {categories.filter((c) => c !== 'Todas las Categorías').map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all ${
                selectedCategory === cat
                  ? 'bg-gold-burnished text-white font-semibold'
                  : 'bg-white text-warm-charcoal border border-marble-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mobile: Volumen Recomendado Card */}
        {featuredBook && (
          <section className="w-full flex flex-col space-y-2 mt-1">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-gold-burnished text-sm">workspace_premium</span>
                <h2 className="text-xs font-bold uppercase tracking-wider text-sepia-heading">Volumen Recomendado</h2>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-warm-charcoal font-semibold">Edición Destacada</span>
            </div>

            <div className="bg-white rounded-xl p-3.5 border border-marble-border shadow-xs flex flex-col gap-3 relative overflow-hidden">
              <div className="flex gap-3 items-start">
                <div className="relative w-20 h-28 rounded-lg overflow-hidden shrink-0 shadow-sm border border-marble-border bg-parchment-surface">
                  <img
                    src={featuredBook.cover_url}
                    alt={featuredBook.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-gold-burnished text-white text-[9px] uppercase font-bold tracking-wider">
                    Sala
                  </span>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-gold-burnished text-[11px] font-bold">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span>{featuredBook.rating || 5.0}</span>
                    <span className="text-warm-charcoal font-normal text-[10px]">({featuredBook.reviews_count || 45} reseñas)</span>
                  </div>

                  <h3 className="text-sm font-bold font-display text-sepia-heading leading-snug line-clamp-1 mt-0.5">
                    {featuredBook.title}
                  </h3>
                  <p className="text-[11px] text-warm-charcoal truncate mt-0.5">
                    {featuredBook.author}
                  </p>

                  <div className="mt-2 text-[10px] text-gold-burnished font-mono font-bold truncate">
                    {featuredBook.location || 'Sector Central · Estante 2A'}
                  </div>

                  <span className="text-[10px] text-green-700 font-semibold mt-0.5">
                    {featuredBook.available_copies > 0 ? '✓ Listo para retiro' : 'Agotado'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectBook(featuredBook)}
                className="w-full py-2 px-3 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">bookmark_add</span>
                Apartar para Retiro
              </button>
            </div>
          </section>
        )}
      </div>

      {/* ============================================================ */}
      {/* DESKTOP HERO & FILTERS (hidden on mobile, visible on desktop) */}
      {/* ============================================================ */}
      <div className="hidden lg:block relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-parchment-surface via-parchment-card to-parchment-base border border-marble-border p-8 shadow-sm mb-8">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gold-burnished/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-marian-blue/5 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-marble-border shadow-2xs w-max">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
              <span className="text-xs uppercase tracking-wider text-gold-burnished font-semibold">
                Biblioteca Comunitaria Barrial
              </span>
              <span className="text-outline text-xs">•</span>
              <span className="text-xs text-warm-charcoal">Préstamos a Domicilio: 21 Días</span>
            </div>

            <h2 className="text-3xl font-bold font-display text-sepia-heading tracking-tight pt-1">
              Biblioteca Comunitaria de la Capilla Ntra. Sra. de Lourdes
            </h2>

            <p className="text-sm text-warm-charcoal leading-relaxed">
              Consulte todos nuestros libros abiertos a todo el barrio: novelas universales, literatura contemporánea, cuentos, terror, suspenso y divulgación para retiro a domicilio en Sigmund Freud 201, Temperley.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-marble-border shadow-xs">
              <span className="material-symbols-outlined text-gold-burnished text-2xl">shelves</span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-warm-charcoal font-semibold">Volúmenes Físicos</span>
                <span className="text-sm font-bold text-sepia-heading">
                  {physicalBooksCount} {physicalBooksCount === 1 ? 'Título' : 'Títulos'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-marble-border shadow-xs">
              <span className="material-symbols-outlined text-marian-blue text-2xl">cloud_done</span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-warm-charcoal font-semibold">Depósito Digital</span>
                <span className="text-sm font-bold text-sepia-heading">
                  {digitalBooksCount} {digitalBooksCount === 1 ? 'Documento' : 'Documentos'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Search & Filter Controls */}
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative w-full flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-burnished text-xl">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar novelas, cuentos, terror, suspenso o autores..."
                className="w-full bg-white hover:bg-parchment-base focus:bg-white text-sepia-ink placeholder:text-outline text-sm rounded-lg pl-11 pr-24 py-2.5 border border-marble-border focus:outline-none focus:ring-2 focus:ring-gold-burnished/50 focus:border-gold-burnished shadow-xs transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded bg-parchment-surface border border-marble-border text-warm-charcoal hover:text-sepia-ink"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="flex items-center p-1 rounded-lg bg-white border border-marble-border shadow-xs w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setFormatFilter('all')}
                className={`px-3 py-1.5 rounded text-xs transition-all ${
                  formatFilter === 'all'
                    ? 'bg-gold-burnished text-white font-semibold shadow-xs'
                    : 'text-warm-charcoal hover:text-sepia-ink'
                }`}
              >
                Todos ({books.length})
              </button>
              <button
                type="button"
                onClick={() => setFormatFilter('physical')}
                className={`px-3 py-1.5 rounded text-xs transition-all ${
                  formatFilter === 'physical'
                    ? 'bg-gold-burnished text-white font-semibold shadow-xs'
                    : 'text-warm-charcoal hover:text-sepia-ink'
                }`}
              >
                Libros Físicos ({physicalBooksCount})
              </button>
              <button
                type="button"
                onClick={() => setFormatFilter('digital')}
                className={`px-3 py-1.5 rounded text-xs transition-all ${
                  formatFilter === 'digital'
                    ? 'bg-gold-burnished text-white font-semibold shadow-xs'
                    : 'text-warm-charcoal hover:text-sepia-ink'
                }`}
              >
                Documentos PDF ({digitalBooksCount})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <span className="text-xs uppercase tracking-wider text-warm-charcoal font-semibold shrink-0 pl-1">
              Géneros:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gold-burnished text-white font-semibold shadow-xs'
                    : 'bg-white hover:bg-parchment-card text-warm-charcoal hover:text-sepia-heading border border-marble-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* INTERACTIVE WORKBENCH (Desktop + Slide Drawer on Mobile)      */}
      {/* ============================================================ */}
      {selectedBook && (
        <section
          ref={workbenchRef}
          className="relative w-full rounded-2xl bg-parchment-card border border-marble-border shadow-lg p-5 sm:p-6 lg:p-8 mb-8 overflow-hidden"
        >
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-gold-burnished/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-gold-burnished to-transparent opacity-80"></div>

          <div className="relative z-10 flex flex-col gap-5 sm:gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-marble-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold-light border border-gold-burnished/30 flex items-center justify-center text-gold-burnished shadow-xs">
                  <span className="material-symbols-outlined text-lg sm:text-xl">auto_stories</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-gold-burnished font-semibold">
                    Ejemplar para Reserva
                  </span>
                  <span className="text-base sm:text-lg font-bold font-display text-sepia-heading">
                    Ficha de Préstamo para Retiro en el Atrio
                  </span>
                </div>
              </div>

              <div className="flex items-center p-1 rounded-lg bg-white border border-marble-border shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTabMode('physical')}
                  className={`px-2.5 sm:px-3 py-1 rounded text-xs transition-all ${
                    activeTabMode === 'physical'
                      ? 'bg-gold-burnished text-white font-semibold shadow-xs'
                      : 'text-warm-charcoal hover:text-sepia-ink'
                  }`}
                >
                  Físico
                </button>
                {selectedBook.has_digital && (
                  <button
                    type="button"
                    onClick={() => setActiveTabMode('digital')}
                    className={`px-2.5 sm:px-3 py-1 rounded text-xs transition-all ${
                      activeTabMode === 'digital'
                        ? 'bg-marian-blue text-white font-semibold shadow-xs'
                        : 'text-warm-charcoal hover:text-sepia-ink'
                    }`}
                  >
                    PDF
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
              {/* Left Column: Cover & Details */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-white border border-marble-border shadow-xs flex flex-col items-center text-center gap-3">
                  <div className="relative w-36 h-52 sm:w-44 sm:h-64 rounded-lg overflow-hidden shadow-md bg-parchment-surface border border-marble-border flex items-center justify-center">
                    <img
                      src={selectedBook.cover_url}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-1 rounded bg-sepia-ink/85 backdrop-blur-md flex items-center justify-between text-[11px] text-white">
                      <span className="text-gold-accent flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-xs">menu_book</span> Físico
                      </span>
                      <span className="text-parchment-surface font-mono">
                        {selectedBook.available_copies > 0 ? `${selectedBook.available_copies} Disponibles` : 'Agotado'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 w-full pt-1 text-center">
                    <div className="flex flex-col items-center justify-center p-2 rounded bg-parchment-surface border border-marble-border/60">
                      <span className="text-[10px] uppercase text-warm-charcoal tracking-wider">Género</span>
                      <span className="text-xs font-semibold text-sepia-heading mt-0.5 truncate w-full">
                        {selectedBook.genre}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded bg-parchment-surface border border-marble-border/60">
                      <span className="text-[10px] uppercase text-warm-charcoal tracking-wider">Plazo</span>
                      <span className="text-xs font-semibold text-sepia-heading mt-0.5">21 Días</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded bg-parchment-surface border border-marble-border/60 col-span-2">
                      <span className="text-[10px] uppercase text-warm-charcoal tracking-wider">Ubicación</span>
                      <span className="text-xs text-gold-burnished font-mono font-bold mt-0.5 truncate w-full">
                        {selectedBook.location || 'Estante 2A · Atrio Central'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Title, Synopsis & Reservation Form */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="p-4 sm:p-6 rounded-xl bg-white border border-marble-border shadow-xs flex flex-col items-center text-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-gold-light text-gold-burnished text-xs uppercase tracking-wider font-semibold border border-gold-burnished/30">
                    {selectedBook.genre}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-sepia-heading leading-snug">
                    {selectedBook.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-warm-charcoal font-medium">
                    {selectedBook.author}
                  </p>

                  <div className="w-full mt-2 pt-2 border-t border-marble-border/60 flex flex-col items-center gap-1.5">
                    <p className="w-full text-xs sm:text-sm text-sepia-ink leading-relaxed italic bg-parchment-surface/70 p-3 sm:p-4 rounded-lg border border-marble-border/80 text-warm-charcoal text-center">
                      «{selectedBook.synopsis}»
                    </p>
                  </div>
                </div>

                {activeTabMode === 'physical' ? (
                  <div className="p-4 sm:p-6 rounded-xl bg-white border border-marble-border shadow-xs flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-center justify-between pb-1 border-b border-marble-border/50">
                      <span className="text-xs sm:text-sm text-sepia-heading font-bold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-gold-burnished text-lg sm:text-xl">event_available</span>
                        Paso 1: Selección de Turno de Retiro
                      </span>
                      <span className={`text-[11px] sm:text-xs px-2 py-0.5 rounded font-semibold ${
                        selectedBook.available_copies > 0
                          ? 'text-green-700 bg-green-50 border border-green-200'
                          : 'text-terracotta bg-terracotta-light border border-terracotta/20'
                      }`}>
                        {selectedBook.available_copies > 0 ? `${selectedBook.available_copies} Disponibles` : 'Agotado'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'Turno Mañana (10:00 a 13:00 hs)', title: 'Turno Mañana', hours: '10:00 a 13:00 hs', note: 'Recepción' },
                        { id: 'Turno Tarde (15:00 a 18:00 hs)', title: 'Turno Tarde', hours: '15:00 a 18:00 hs', note: 'Despacho' },
                        { id: 'Sábado (9:30 a 12:30 hs)', title: 'Sábado', hours: '9:30 a 12:30 hs', note: 'Atrio' },
                      ].map((slot) => {
                        const isSelected = pickupSlot === slot.id;
                        return (
                          <label
                            key={slot.id}
                            onClick={() => setPickupSlot(slot.id)}
                            className={`cursor-pointer relative p-2.5 sm:p-3 rounded-xl border flex flex-col items-center text-center gap-0.5 transition-all ${
                              isSelected
                                ? 'bg-gold-light/40 border-2 border-gold-burnished shadow-xs'
                                : 'bg-parchment-base border-marble-border hover:bg-gold-light/20'
                            }`}
                          >
                            <input
                              type="radio"
                              name="pickupSlot"
                              checked={isSelected}
                              onChange={() => setPickupSlot(slot.id)}
                              className="accent-amber-700 absolute top-2 right-2"
                            />
                            <span className="text-xs sm:text-sm font-bold text-sepia-heading">{slot.title}</span>
                            <span className="text-[11px] text-warm-charcoal">{slot.hours}</span>
                            <span className="text-[9px] text-gold-burnished font-semibold mt-0.5 px-1.5 py-0.5 bg-white/80 rounded border border-gold-burnished/20">
                              {slot.note}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-warm-charcoal font-semibold text-sepia-heading">
                        Paso 2: Nota opcional
                      </label>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ej. Retirar al término de la Santa Misa..."
                        className="w-full bg-parchment-base text-sepia-ink text-xs rounded-lg px-3 py-2 border border-marble-border focus:outline-none focus:ring-1 focus:ring-gold-burnished"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={selectedBook.available_copies <= 0 || reserving}
                      onClick={handleConfirmReservation}
                      className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        selectedBook.available_copies > 0 && !reserving
                          ? 'bg-gold-burnished hover:bg-gold-accent text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">event_available</span>
                      <span>{reserving ? 'Generando Pase QR...' : 'Confirmar Reserva para Retiro'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-white border border-marble-border shadow-xs flex flex-col gap-3 text-center items-center">
                    <span className="text-xs sm:text-sm text-marian-blue font-bold">
                      Edición Digital Completa (PDF)
                    </span>
                    {selectedBook.digital_url ? (
                      <a
                        href={selectedBook.digital_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 rounded-lg bg-marian-blue hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-base">open_in_new</span>
                        Abrir / Descargar PDF desde Neon
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => alert(`Versión digital no disponible aún para: ${selectedBook.title}`)}
                        className="px-6 py-2 rounded-lg bg-slate-300 text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-2 cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                        PDF no cargado
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* CATALOG SHELF / LIST (Adaptive Mobile Horizontal & Grid)     */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gold-burnished shadow-[0_0_8px_rgba(184,134,11,0.6)]"></div>
          <h3 className="text-lg sm:text-xl font-bold font-display text-sepia-heading">
            Nuestros Libros
          </h3>
          <span className="text-[11px] px-2 py-0.5 rounded bg-parchment-surface text-warm-charcoal border border-marble-border">
            {books.length} Obras
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-warm-charcoal">
          <span className="material-symbols-outlined text-3xl animate-spin text-gold-burnished mb-2">autorenew</span>
          <p className="text-xs">Cargando libros...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="py-12 text-center text-warm-charcoal bg-white rounded-xl border border-marble-border p-6">
          <p className="text-sm font-semibold text-sepia-heading">No se encontraron libros</p>
          <p className="text-xs mt-1">Pruebe ajustando la búsqueda o el género.</p>
        </div>
      ) : (
        <>
          {/* MOBILE COMPACT HORIZONTAL LIST (from catalogo_mobile.html) */}
          <div className="lg:hidden flex flex-col gap-2.5">
            {books.map((b) => {
              const isAvailable = b.available_copies > 0;
              return (
                <div
                  key={b.id}
                  onClick={() => handleSelectBook(b)}
                  className="bg-white rounded-xl p-3 border border-marble-border shadow-2xs hover:shadow-xs transition-all flex gap-3 items-center cursor-pointer active:scale-[0.99]"
                >
                  <div className="relative w-16 h-22 rounded-md overflow-hidden bg-parchment-surface border border-marble-border shrink-0">
                    <img
                      src={b.cover_url}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-gold-burnished font-bold truncate">
                        {b.genre}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-parchment-surface text-warm-charcoal border border-marble-border font-mono ml-auto shrink-0">
                        {b.format === 'both' ? 'PDF+Físico' : b.format === 'digital' ? 'PDF' : 'Físico'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold font-display text-sepia-heading truncate leading-tight">
                      {b.title}
                    </h4>
                    <p className="text-[11px] text-warm-charcoal truncate mt-0.5">{b.author}</p>

                    <div className="flex items-center justify-between text-[10px] text-warm-charcoal mt-1.5">
                      <span className={isAvailable ? 'text-green-700 font-semibold' : 'text-terracotta font-semibold'}>
                        {isAvailable ? `${b.available_copies} disp.` : 'Reservado'}
                      </span>
                      <span className="text-gold-burnished font-semibold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        {b.rating || 5.0}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectBook(b);
                    }}
                    className="w-8 h-8 rounded-full bg-gold-light border border-gold-burnished/30 text-gold-burnished flex items-center justify-center shrink-0 hover:bg-gold-burnished hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">bookmark_add</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* DESKTOP 4-COLUMN GRID */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {books.map((b) => {
              const isAvailable = b.available_copies > 0;
              return (
                <div
                  key={b.id}
                  className="book-card group relative rounded-xl bg-parchment-card hover:bg-white p-4 border border-marble-border shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-3">
                    <div className="relative w-full h-56 rounded-lg overflow-hidden bg-parchment-surface border border-marble-border/60 shadow-xs flex items-center justify-center">
                      <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/35 to-transparent z-10 pointer-events-none"></div>
                      <img
                        src={b.cover_url}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 z-20">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[11px] text-gold-burnished border border-marble-border font-semibold shadow-2xs">
                          <span className="material-symbols-outlined text-xs">menu_book</span>
                          {b.format === 'both' ? 'Físico + PDF' : b.format === 'digital' ? 'PDF Digital' : 'Físico'}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 z-20">
                        <span className="px-2 py-0.5 rounded bg-white/95 text-[10px] text-warm-charcoal border border-marble-border font-mono font-medium">
                          {b.genre}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gold-burnished text-[11px] uppercase tracking-wide font-semibold truncate max-w-[150px]">
                          {b.genre}
                        </span>
                        <span className="flex items-center gap-0.5 text-gold-burnished text-xs font-bold">
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          {b.rating || 5.0}
                        </span>
                      </div>

                      <h4 className="text-base font-bold font-display text-sepia-heading leading-snug line-clamp-1">
                        {b.title}
                      </h4>
                      <p className="text-xs text-warm-charcoal truncate">{b.author}</p>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white border border-marble-border/60 text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-gold-burnished' : 'bg-terracotta'}`}></span>
                      <span className="text-xs text-sepia-heading font-medium">
                        {isAvailable ? `${b.available_copies} Disponibles` : 'Reservado'}
                      </span>
                      <span className="text-[11px] text-warm-charcoal ml-auto truncate max-w-[110px]">
                        {b.location ? b.location.split('·')[0] : 'Atrio'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 mt-1">
                    <button
                      type="button"
                      onClick={() => handleSelectBook(b)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-gold-burnished hover:bg-gold-accent text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <span className="material-symbols-outlined text-sm">bookmark_add</span>
                      Ver & Reservar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
