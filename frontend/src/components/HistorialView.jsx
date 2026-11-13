import React, { useState } from 'react';

export default function HistorialView({
  loans,
  loading,
  onRenewLoan,
  onGoToCatalog,
}) {
  const [mobileTab, setMobileTab] = useState('active'); // 'active' or 'returned'

  const activeLoans = loans.filter((l) => l.status === 'EN_CURSO');
  const pastLoans = loans.filter((l) => l.status === 'DEVUELTO');

  return (
    <div className="flex flex-col w-full pb-8">
      {/* ============================================================ */}
      {/* MOBILE SEGMENTED TOGGLE (from historial_mobile.html)         */}
      {/* ============================================================ */}
      <div className="lg:hidden flex flex-col gap-3 mb-5">
        <div className="flex items-center justify-between bg-parchment-surface px-4 py-2.5 rounded-xl border border-marble-border shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gold-light border border-gold-burnished/30 flex items-center justify-center text-gold-burnished">
              <span className="material-symbols-outlined text-base">history_edu</span>
            </div>
            <div>
              <p className="text-[10px] text-warm-charcoal uppercase tracking-wider font-semibold">Sello Parroquial</p>
              <p className="text-xs font-bold font-display text-sepia-heading leading-tight">Historial de Lectura & Prórrogas</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gold-light text-gold-burnished border border-gold-burnished/30">
            Activo
          </span>
        </div>

        {/* Segmented Filter Buttons */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-parchment-surface border border-marble-border shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileTab('active')}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'active'
                ? 'bg-gold-burnished text-white shadow-xs'
                : 'text-warm-charcoal hover:text-sepia-ink'
            }`}
          >
            <span className="material-symbols-outlined text-sm">hourglass_top</span>
            <span>En Préstamo ({activeLoans.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('returned')}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'returned'
                ? 'bg-gold-burnished text-white shadow-xs'
                : 'text-warm-charcoal hover:text-sepia-ink'
            }`}
          >
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            <span>Devueltos ({pastLoans.length})</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP HEADER BANNER                                         */}
      {/* ============================================================ */}
      <div className="hidden lg:flex items-center justify-between pb-6 mb-8 border-b border-marble-border flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gold-light border border-gold-burnished/30 flex items-center justify-center text-gold-burnished shadow-xs">
            <span className="material-symbols-outlined text-2xl">history_edu</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold font-display text-sepia-heading">
              Historial de Préstamos y Renovaciones
            </h2>
            <p className="text-xs text-warm-charcoal">
              Consulte sus ejemplares prestados a domicilio, plazos de devolución y extensiones.
            </p>
          </div>
        </div>

        <button
          onClick={onGoToCatalog}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-parchment-card hover:bg-white text-sepia-heading border border-marble-border text-xs font-semibold transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-base text-gold-burnished">auto_stories</span>
          Buscar Nuevo Libro
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-warm-charcoal">
          <span className="material-symbols-outlined text-3xl animate-spin text-gold-burnished mb-2">autorenew</span>
          <p className="text-xs">Consultando registros...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Active Loans Section (Desktop & Mobile when mobileTab === 'active') */}
          <div className={`flex flex-col gap-4 ${mobileTab === 'returned' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-burnished"></span>
                <h3 className="text-base sm:text-lg font-bold font-display text-sepia-heading">
                  Libros en Préstamo Activo ({activeLoans.length})
                </h3>
              </div>
            </div>

            {activeLoans.length === 0 ? (
              <div className="p-6 rounded-xl bg-white border border-marble-border text-center text-xs text-warm-charcoal">
                No tiene libros en préstamo actualmente.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeLoans.map((loan) => {
                  const book = loan.book || {};
                  const dueDate = new Date(loan.due_date);
                  const isExpiringSoon = (dueDate - new Date()) / (1000 * 60 * 60 * 24) <= 5;

                  return (
                    <div
                      key={loan.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-marble-border shadow-xs flex flex-col justify-between gap-4"
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-lg border border-marble-border shadow-2xs shrink-0"
                        />
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <span className="text-[10px] uppercase tracking-wider text-gold-burnished font-semibold truncate">
                            {book.genre}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold font-display text-sepia-heading leading-snug line-clamp-2">
                            {book.title}
                          </h4>
                          <p className="text-xs text-warm-charcoal truncate">{book.author}</p>

                          <div className="mt-1 text-[11px] flex flex-col gap-0.5 text-warm-charcoal">
                            <div>
                              Devolución:{' '}
                              <strong className={isExpiringSoon ? 'text-terracotta font-bold' : 'text-sepia-heading'}>
                                {dueDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                              </strong>
                            </div>
                            <div className="text-[10px] text-outline">
                              Prórrogas: {loan.renewals_count} de 3 usadas
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-marble-border flex items-center justify-between">
                        <span className="text-[11px] text-warm-charcoal">
                          {isExpiringSoon ? '⚠️ Por vencer' : '✅ En término'}
                        </span>

                        <button
                          type="button"
                          disabled={loan.renewals_count >= 3}
                          onClick={() => onRenewLoan(loan.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            loan.renewals_count < 3
                              ? 'bg-gold-light hover:bg-gold-burnished text-gold-burnished hover:text-white border border-gold-burnished/40'
                              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">update</span>
                          {loan.renewals_count < 3 ? 'Solicitar Prórroga +21 Días' : 'Límite alcanzado'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Loans Section (Desktop & Mobile when mobileTab === 'returned') */}
          <div className={`flex flex-col gap-4 ${mobileTab === 'active' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="flex items-center gap-2 px-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-outline"></span>
              <h3 className="text-base sm:text-lg font-bold font-display text-sepia-heading">
                Registro Histórico de Devoluciones ({pastLoans.length})
              </h3>
            </div>

            {pastLoans.length === 0 ? (
              <div className="p-6 rounded-xl bg-white border border-marble-border text-center text-xs text-warm-charcoal">
                Aún no posee préstamos completados en su historial.
              </div>
            ) : (
              <>
                {/* Mobile Cards for Past Loans */}
                <div className="lg:hidden flex flex-col gap-2.5">
                  {pastLoans.map((loan) => {
                    const book = loan.book || {};
                    return (
                      <div
                        key={loan.id}
                        className="bg-white rounded-xl p-3 border border-marble-border shadow-2xs flex gap-3 items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={book.cover_url}
                            alt={book.title}
                            className="w-11 h-15 object-cover rounded border border-marble-border shrink-0"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-xs text-sepia-heading truncate">{book.title}</span>
                            <span className="text-[11px] text-warm-charcoal truncate">{book.author}</span>
                            <span className="text-[9px] text-green-700 font-semibold mt-0.5">Devuelto en Término</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={onGoToCatalog}
                          className="px-2.5 py-1 rounded bg-gold-light text-gold-burnished text-[10px] font-bold border border-gold-burnished/30 shrink-0"
                        >
                          Re-reservar
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table for Past Loans */}
                <div className="hidden lg:block bg-white rounded-2xl border border-marble-border overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-parchment-surface border-b border-marble-border text-warm-charcoal uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-4">Libro & Autor</th>
                          <th className="p-4">Fecha de Retiro</th>
                          <th className="p-4">Fecha de Devolución</th>
                          <th className="p-4">Estado</th>
                          <th className="p-4 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-marble-border/60">
                        {pastLoans.map((loan) => {
                          const book = loan.book || {};
                          const loanDate = new Date(loan.loan_date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
                          const retDate = loan.returned_date
                            ? new Date(loan.returned_date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'Completado';

                          return (
                            <tr key={loan.id} className="hover:bg-parchment-card/60 transition-colors">
                              <td className="p-4 flex items-center gap-3">
                                <img
                                  src={book.cover_url}
                                  alt={book.title}
                                  className="w-9 h-12 object-cover rounded border border-marble-border shrink-0"
                                />
                                <div className="flex flex-col">
                                  <span className="font-bold text-sepia-heading text-sm">{book.title}</span>
                                  <span className="text-warm-charcoal text-xs">{book.author}</span>
                                </div>
                              </td>
                              <td className="p-4 text-warm-charcoal">{loanDate}</td>
                              <td className="p-4 text-warm-charcoal">{retDate}</td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200 font-semibold text-[11px]">
                                  Devuelto en Plazo
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={onGoToCatalog}
                                  className="text-gold-burnished hover:text-gold-accent font-semibold text-xs"
                                >
                                  Volver a Reservar
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
