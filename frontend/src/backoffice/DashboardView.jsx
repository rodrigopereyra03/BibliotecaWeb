import React, { useState } from 'react';

export default function DashboardView({
  stats,
  reservations,
  books,
  onDeliverReservation,
  onOpenAddBook,
  onOpenScanQR,
  onNavigateTo,
}) {
  const [filterPending, setFilterPending] = useState('ALL');

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Banner / Editorial Overview */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 mb-6 border-b border-marble-border">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-gold-burnished font-bold">
              Panel General & Métricas Operativas
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
            <span className="text-xs text-warm-charcoal">Control de Préstamos e Inventario</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-sepia-heading tracking-tight">
            Panel de Control & Préstamos de Libros
          </h2>
          <p className="text-xs sm:text-sm text-warm-charcoal mt-0.5">
            Monitoreo en tiempo real de préstamos, entregas en mostrador, catálogo y actividad de lectores de la parroquia.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenScanQR}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-marble-border text-sepia-heading font-bold text-xs shadow-xs hover:bg-gold-light/40 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-gold-burnished">qr_code_scanner</span>
            <span>Verificar Pase QR</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddBook}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>+ Registrar Nuevo Título</span>
          </button>
        </div>
      </section>

      {/* 4 Métricas Principales */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* KPI 1: Libros en Préstamo */}
        <div className="bg-white rounded-2xl p-5 border border-marble-border shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-3 -bottom-3 opacity-5 pointer-events-none text-gold-burnished">
            <span className="material-symbols-outlined text-[90px]">auto_stories</span>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] text-warm-charcoal uppercase tracking-wider font-semibold">Circulación Domiciliaria</span>
              <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-200">
                {stats?.on_time_rate || '96%'} a término
              </span>
            </div>
            <p className="text-3xl font-bold font-display text-sepia-heading mt-2 leading-none">
              {stats?.active_loans || 0}
            </p>
            <p className="text-xs text-warm-charcoal mt-1 font-medium">Libros en Préstamo</p>
          </div>
          <div className="mt-4 pt-2 border-t border-marble-border/60 flex items-center justify-between text-[11px] text-warm-charcoal">
            <span className="flex items-center gap-1 text-gold-burnished font-semibold">
              <span className="material-symbols-outlined text-sm">schedule</span> Préstamo por 21 días
            </span>
            <span className="font-mono text-outline">ACTIVO</span>
          </div>
        </div>

        {/* KPI 2: Retiros en Atrio */}
        <div className="bg-white rounded-2xl p-5 border border-marble-border shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-3 -bottom-3 opacity-5 pointer-events-none text-marian-blue">
            <span className="material-symbols-outlined text-[90px]">handshake</span>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] text-warm-charcoal uppercase tracking-wider font-semibold">Pases en Despacho</span>
              <span className="px-2 py-0.5 rounded-full bg-marian-blue-light text-marian-blue text-[10px] font-bold border border-marian-blue/20">
                Válido 48 hs
              </span>
            </div>
            <p className="text-3xl font-bold font-display text-marian-blue mt-2 leading-none">
              {reservations.length}
            </p>
            <p className="text-xs text-warm-charcoal mt-1 font-medium">Listos para Retiro</p>
          </div>
          <div className="mt-4 pt-2 border-t border-marble-border/60 flex items-center justify-between text-[11px] text-warm-charcoal">
            <span>Esperando en mostrador</span>
            <span className="font-mono text-gold-burnished font-bold">HOY ATRIO</span>
          </div>
        </div>

        {/* KPI 3: Libros e Inventario */}
        <div className="bg-white rounded-2xl p-5 border border-marble-border shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-3 -bottom-3 opacity-5 pointer-events-none text-gold-burnished">
            <span className="material-symbols-outlined text-[90px]">shelves</span>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] text-warm-charcoal uppercase tracking-wider font-semibold">Fondo Bibliográfico</span>
              <span className="px-2 py-0.5 rounded-full bg-parchment-surface text-warm-charcoal text-[10px] font-semibold border border-marble-border">
                Inventario Total
              </span>
            </div>
            <p className="text-3xl font-bold font-display text-sepia-heading mt-2 leading-none">
              {books.length}
            </p>
            <p className="text-xs text-warm-charcoal mt-1 font-medium">Títulos Catalogados</p>
          </div>
          <div className="mt-4 pt-2 border-t border-marble-border/60 flex items-center justify-between text-[11px] text-warm-charcoal">
            <span>{books.filter(b => b.format === 'physical' || b.format === 'both' || b.format === 'Físico' || b.format === 'Ambos' || !b.format).length} Físicos</span>
            <span>{books.filter(b => b.has_digital || b.format === 'digital' || b.format === 'both' || b.format === 'Digital' || b.format === 'Ambos' || Boolean(b.digital_url)).length} Digitales PDF</span>
          </div>
        </div>

        {/* KPI 4: Miembros Registrados */}
        <div className="bg-white rounded-2xl p-5 border border-marble-border shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-3 -bottom-3 opacity-5 pointer-events-none text-gold-burnished">
            <span className="material-symbols-outlined text-[90px]">group</span>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] text-warm-charcoal uppercase tracking-wider font-semibold">Comunidad Lectora</span>
              <span className="px-2 py-0.5 rounded-full bg-gold-light text-gold-burnished text-[10px] font-bold border border-gold-burnished/30">
                Padrón Activo
              </span>
            </div>
            <p className="text-3xl font-bold font-display text-sepia-heading mt-2 leading-none">
              {stats?.total_members || 0}
            </p>
            <p className="text-xs text-warm-charcoal mt-1 font-medium">Lectores Inscriptos</p>
          </div>
          <div className="mt-4 pt-2 border-t border-marble-border/60 flex items-center justify-between text-[11px] text-warm-charcoal">
            <span>Credenciales #GT emitidas</span>
            <span className="font-mono text-outline">100% VERIFICADO</span>
          </div>
        </div>
      </section>

      {/* Grid: Pending Pickups Table + Categories Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Turno de Retiro y Entregas Pendientes */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-marble-border shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-marble-border flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gold-light border border-gold-burnished/30 flex items-center justify-center text-gold-burnished">
                  <span className="material-symbols-outlined text-base">delivery_dining</span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-display text-sepia-heading">
                    Turno de Retiro y Entregas Pendientes
                  </h3>
                  <p className="text-[11px] text-warm-charcoal">
                    Pases QR generados por lectores esperando retiro en el atrio
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gold-light text-gold-burnished border border-gold-burnished/30">
                {reservations.length} en espera
              </span>
            </div>

            {reservations.length === 0 ? (
              <div className="p-8 text-center text-warm-charcoal text-xs">
                No hay pedidos de retiro pendientes en el atrio en este momento.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-parchment-surface border-b border-marble-border text-warm-charcoal uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Código Pase</th>
                      <th className="p-3.5">Ejemplar & Género</th>
                      <th className="p-3.5">Turno Seleccionado</th>
                      <th className="p-3.5">Estado</th>
                      <th className="p-3.5 text-right">Acción Mostrador</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-marble-border/60">
                    {reservations.map((res) => {
                      const b = res.book || {};
                      return (
                        <tr key={res.id} className="hover:bg-parchment-card/50 transition-colors">
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-gold-burnished bg-parchment-surface px-2 py-0.5 rounded border border-marble-border">
                              {res.reservation_code}
                            </span>
                          </td>
                          <td className="p-3.5 flex items-center gap-2.5">
                            <img
                              src={b.cover_url}
                              alt={b.title}
                              className="w-8 h-11 object-cover rounded border border-marble-border shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-sepia-heading truncate max-w-[180px]">{b.title}</span>
                              <span className="text-[10px] text-warm-charcoal truncate">{b.author}</span>
                            </div>
                          </td>
                          <td className="p-3.5 text-warm-charcoal">
                            <span className="font-semibold text-sepia-heading block">{res.pickup_slot}</span>
                            <span className="text-[10px] text-outline">{res.pickup_location}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200 font-bold text-[10px]">
                              Listo en Atrio
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => onDeliverReservation(res)}
                              className="px-3 py-1.5 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white font-bold text-[11px] shadow-xs transition-all inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">check</span>
                              <span>Entregar</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Category Distribution & Parish Info */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Distribution Card */}
          <div className="bg-white rounded-2xl p-5 border border-marble-border shadow-xs flex flex-col gap-3">
            <h3 className="text-sm font-bold font-display text-sepia-heading flex items-center gap-1.5">
              <span className="material-symbols-outlined text-gold-burnished text-base">pie_chart</span>
              Distribución de Libros por Género
            </h3>

            <div className="flex flex-col gap-2.5 pt-1 text-xs text-warm-charcoal">
              {[
                { name: 'Novelas & Ficción', count: books.filter(b => b.genre.includes('Novela')).length, total: books.length, color: 'bg-gold-burnished' },
                { name: 'Terror & Misterio', count: books.filter(b => b.genre.includes('Terror')).length, total: books.length, color: 'bg-terracotta' },
                { name: 'Cuentos & Fantasía', count: books.filter(b => b.genre.includes('Cuento')).length, total: books.length, color: 'bg-marian-blue' },
                { name: 'Suspenso & Policial', count: books.filter(b => b.genre.includes('Suspenso')).length, total: books.length, color: 'bg-amber-600' },
                { name: 'Historia & Biografías', count: books.filter(b => b.genre.includes('Historia')).length, total: books.length, color: 'bg-emerald-600' },
              ].map((cat) => {
                const percent = cat.total > 0 ? Math.round((cat.count / cat.total) * 100) : 0;
                return (
                  <div key={cat.name} className="flex flex-col gap-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-sepia-heading">{cat.name}</span>
                      <span>{cat.count} títulos ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-parchment-surface rounded-full overflow-hidden">
                      <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Parish Desk Notice Card */}
          <div className="bg-gradient-to-br from-gold-burnished via-gold-accent to-amber-700 text-white rounded-2xl p-5 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">church</span>
              <span className="text-xs uppercase font-bold tracking-wider">Atrio Parroquial Temperley</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              Atención presencial en mostrador para retiro y recepción de devoluciones. Plazo estándar: 21 días con prórroga web.
            </p>
            <div className="pt-2 border-t border-white/20 flex justify-between text-[11px] font-medium">
              <span>Misa Dominical: 8:30 - 14:00</span>
              <span>Lunes a Sábados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
