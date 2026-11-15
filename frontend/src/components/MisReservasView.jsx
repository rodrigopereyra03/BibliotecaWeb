import React from 'react';

export default function MisReservasView({
  reservations,
  loading,
  onCancelReservation,
  onViewPass,
  onGoToCatalog,
}) {
  const activeReservation = reservations[0];

  return (
    <div className="flex flex-col w-full pb-8">
      {/* ============================================================ */}
      {/* MOBILE HEADER & PASTORAL STATS (from mis_reservas_mobile.html) */}
      {/* ============================================================ */}
      <div className="lg:hidden flex flex-col gap-3 mb-5">
        {/* User Card */}
        <div className="flex items-center justify-between bg-parchment-surface px-4 py-2.5 rounded-xl border border-marble-border shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gold-light border border-gold-burnished/30 flex items-center justify-center text-gold-burnished">
              <span className="material-symbols-outlined text-base">verified_user</span>
            </div>
            <div>
              <p className="text-[10px] text-warm-charcoal uppercase tracking-wider font-semibold">Lector Parroquial</p>
              <p className="text-xs font-bold font-display text-sepia-heading leading-tight">{activeReservation?.user_name || 'Socio Lector'}</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gold-light text-gold-burnished border border-gold-burnished/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span> Carnet al Día
          </span>
        </div>

        {/* Quick Stat Badges */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white rounded-xl p-3 flex flex-col justify-between border border-marble-border shadow-xs">
            <div className="flex items-center justify-between text-gold-burnished">
              <span className="material-symbols-outlined text-lg">mark_email_read</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-gold-light text-gold-burnished font-bold">Listo</span>
            </div>
            <div className="mt-1">
              <p className="text-xl font-bold font-display text-sepia-heading leading-tight">{reservations.length}</p>
              <p className="text-[10px] text-warm-charcoal font-medium">Reservas en Sede</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 flex flex-col justify-between border border-marble-border shadow-xs">
            <div className="flex items-center justify-between text-marian-blue">
              <span className="material-symbols-outlined text-lg">hourglass_top</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-marian-blue-light text-marian-blue font-bold">21 días</span>
            </div>
            <div className="mt-1">
              <p className="text-xl font-bold font-display text-sepia-heading leading-tight">1</p>
              <p className="text-[10px] text-warm-charcoal font-medium">Préstamo a Domicilio</p>
            </div>
          </div>

          <div className="col-span-2 bg-parchment-surface rounded-xl px-3.5 py-2 flex items-center justify-between border border-marble-border shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-warm-charcoal text-base shrink-0">church</span>
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-wider text-warm-charcoal font-semibold">Punto de Retiro</p>
                <p className="text-xs text-sepia-heading font-medium truncate">Sigmund Freud 201 · Temperley</p>
              </div>
            </div>
            <span className="text-[11px] text-gold-burnished font-bold shrink-0">Atrio Central</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PANORAMIC ATRIO & RETIRO BANNER                               */}
      {/* ============================================================ */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-parchment-surface via-parchment-card to-[#234e52]/10 border border-marble-border shadow-sm mb-8 p-6 sm:p-8 lg:p-9">
        <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-gold-burnished/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/4 -top-12 w-72 h-72 rounded-full bg-marian-blue/10 blur-3xl pointer-events-none"></div>

        {/* Right side masked image of Capilla Fachada */}
        <div className="absolute right-0 top-0 bottom-0 w-[380px] pointer-events-none select-none overflow-hidden hidden xl:block">
          <img
            src="/capilla-fachada.jpg"
            alt="Capilla Nuestra Señora de Lourdes"
            className="w-full h-full object-cover object-center opacity-80"
            style={{
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 95%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 95%)',
            }}
          />
          <div className="absolute bottom-3 right-5 px-3 py-1 rounded-full bg-sepia-heading/85 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
            <span className="text-[11px] text-parchment-surface font-display font-medium">
              Atrio Parroquial · Sigmund Freud 201
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-5 max-w-2xl xl:max-w-3xl">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-marble-border shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
                <span className="text-xs uppercase tracking-wider text-sepia-heading font-bold">
                  Pase Digital & Retiro en Sede • Temperley
                </span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-light/60 border border-gold-burnished/30 text-gold-burnished text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">event_repeat</span>
                Préstamos por 21 Días (Renovables)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-sepia-heading tracking-tight leading-tight">
              Mis Reservas & Retiro de Libros
            </h1>
            <p className="text-sm text-warm-charcoal max-w-xl leading-relaxed">
              Tus ejemplares reservados te esperan preparados en el atrio parroquial. Presentá tu nombre o carnet en secretaría para retirarlos.
            </p>
          </div>

          {/* 3 Step Guide Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-marble-border shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-gold-light text-gold-burnished flex items-center justify-center font-bold text-xs shrink-0 border border-gold-burnished/30">
                1
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-bold text-sepia-heading font-display">Apartá tu Libro</p>
                <p className="text-[11px] text-warm-charcoal leading-snug">Desde el catálogo general con un solo clic.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-marble-border shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-gold-light text-gold-burnished flex items-center justify-center font-bold text-xs shrink-0 border border-gold-burnished/30">
                2
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-bold text-sepia-heading font-display">Reserva 48 hs</p>
                <p className="text-[11px] text-warm-charcoal leading-snug">Queda apartado en el atrio de la capilla.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-marble-border shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-gold-light text-gold-burnished flex items-center justify-center font-bold text-xs shrink-0 border border-gold-burnished/30">
                3
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-bold text-sepia-heading font-display">Retirá y Leé</p>
                <p className="text-[11px] text-warm-charcoal leading-snug">21 días de lectura para disfrutar en familia.</p>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onGoToCatalog}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-burnished hover:bg-gold-accent text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span className="material-symbols-outlined text-base">auto_stories</span>
              Explorar Más Libros
            </button>
            <span className="text-xs text-warm-charcoal hidden sm:inline">
              Sigmund Freud 201 · Temperley
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-warm-charcoal">
          <span className="material-symbols-outlined text-4xl animate-spin text-gold-burnished mb-2">autorenew</span>
          <p className="text-xs">Cargando sus reservas...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-white border border-marble-border text-center flex flex-col items-center gap-3 max-w-lg mx-auto my-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-gold-light flex items-center justify-center text-gold-burnished">
            <span className="material-symbols-outlined text-3xl">bookmarks</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-display text-sepia-heading">
            No posee reservas activas actualmente
          </h3>
          <p className="text-xs text-warm-charcoal leading-relaxed">
            Elija cualquier ejemplar de nuestro catálogo (novelas, terror, cuentos, suspenso) y resérvelo para retirar en el horario que más le convenga.
          </p>
          <button
            onClick={onGoToCatalog}
            className="mt-2 px-6 py-2 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white text-xs font-bold shadow-xs transition-all"
          >
            Ir al Catálogo General
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
          {reservations.map((res) => {
            const book = res.book || {};
            const expiresDate = new Date(res.expires_at).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={res.id}
                className="rounded-2xl bg-white border border-marble-border shadow-xs p-4 sm:p-6 flex flex-col justify-between gap-4 relative overflow-hidden"
              >
                {/* Status Bar */}
                <div className="bg-gold-burnished -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 px-4 py-2 sm:px-6 sm:py-2.5 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span>¡Listo para Retirar!</span>
                  </div>
                  <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded font-mono font-bold tracking-wider">
                    {res.reservation_code}
                  </span>
                </div>

                <div className="flex gap-3.5 sm:gap-4 items-start pt-1">
                  <div className="relative w-20 h-28 sm:w-24 sm:h-36 rounded-lg overflow-hidden bg-parchment-surface border border-marble-border shadow-xs shrink-0">
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-sepia-ink/85 py-0.5 text-center text-[9px] text-parchment-surface font-semibold uppercase">
                      Reservado
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-gold-burnished font-bold truncate">
                      {book.genre || 'Literatura'}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold font-display text-sepia-heading leading-snug line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-warm-charcoal truncate">{book.author}</p>

                    <div className="mt-1 text-[11px] text-warm-charcoal flex flex-col gap-0.5">
                      <div>
                        Turno: <strong className="text-sepia-heading">{res.pickup_slot}</strong>
                      </div>
                      <div>
                        Retirar antes de: <strong className="text-terracotta">{expiresDate}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-marble-border flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onViewPass(res)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <span className="material-symbols-outlined text-base">qr_code</span>
                    Ver Pase de Retiro / QR
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Desea cancelar la reserva de "${book.title}"?`)) {
                        onCancelReservation(res.id);
                      }
                    }}
                    className="p-2 rounded-lg text-warm-charcoal hover:text-terracotta hover:bg-terracotta-light/40 border border-marble-border transition-colors"
                    title="Cancelar Reserva"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
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
