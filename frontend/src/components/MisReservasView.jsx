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
      {/* DESKTOP HEADER BANNER                                         */}
      {/* ============================================================ */}
      <div className="hidden lg:flex items-center justify-between pb-6 mb-8 border-b border-marble-border flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gold-light border border-gold-burnished/30 flex items-center justify-center text-gold-burnished shadow-xs">
            <span className="material-symbols-outlined text-2xl">bookmark</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold font-display text-sepia-heading">
              Mis Reservas & Pases de Retiro
            </h2>
            <p className="text-xs text-warm-charcoal">
              Consulte sus ejemplares reservados listos para retirar en el mostrador del atrio.
            </p>
          </div>
        </div>

        <button
          onClick={onGoToCatalog}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-parchment-card hover:bg-white text-sepia-heading border border-marble-border text-xs font-semibold transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-base text-gold-burnished">auto_stories</span>
          Explorar Más Libros
        </button>
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
