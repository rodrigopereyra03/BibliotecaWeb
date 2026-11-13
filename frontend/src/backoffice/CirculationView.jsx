import React, { useState } from 'react';

export default function CirculationView({
  reservations = [],
  loans = [],
  books = [],
  onDeliverReservation,
  onReturnLoan,
}) {
  const [searchCode, setSearchCode] = useState('RES-LOURDES-0001');
  const [selectedRes, setSelectedRes] = useState(reservations[0] || null);
  const [successMessage, setSuccessMessage] = useState('');
  const [simulatingCamera, setSimulatingCamera] = useState(false);

  // Find reservation by code or ID
  const handleLookup = (e) => {
    if (e) e.preventDefault();
    const clean = searchCode.trim().toLowerCase();
    const found = reservations.find((r) => {
      const codeMatches = r.reservation_code && r.reservation_code.toLowerCase().includes(clean);
      const idMatches = r.id && r.id.toString() === clean;
      const titleMatches = r.book_title && r.book_title.toLowerCase().includes(clean);
      const userMatches = r.user_name && r.user_name.toLowerCase().includes(clean);
      return codeMatches || idMatches || titleMatches || userMatches;
    });

    if (found) {
      setSelectedRes(found);
      setSuccessMessage(`¡Orden encontrada: ${found.reservation_code}!`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      alert(`No se encontró ninguna reserva pendiente con el criterio: "${searchCode}"`);
    }
  };

  const handleDeliver = async (res) => {
    if (!res) return;
    try {
      await onDeliverReservation({
        reservation_id: res.id,
        book_id: res.book_id,
        user_id: res.user_id,
      });
      setSuccessMessage(`¡Ejemplar entregado con éxito a ${res.user_name}! Préstamo activado por 21 días.`);
      setSelectedRes(null);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (e) {
      console.error(e);
      alert('Error al confirmar la entrega.');
    }
  };

  const handleReturn = async (loan) => {
    if (!window.confirm(`¿Confirmar recepción y devolución del libro "${loan.book_title}"?`)) {
      return;
    }
    try {
      await onReturnLoan({
        loan_id: loan.id,
        book_id: loan.book_id,
      });
      setSuccessMessage(`¡Devolución asentada! Ejemplar restituido al catálogo.`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (e) {
      console.error(e);
      alert('Error al registrar devolución.');
    }
  };

  const activeLoans = loans.filter((l) => l.status === 'activo' || l.status === 'prorrogado');
  const activeSelected = selectedRes || reservations[0] || null;

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Header */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 mb-6 border-b border-marble-border">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-gold-burnished font-bold">
              Despacho & Circulación en Mostrador
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
            <span className="text-xs text-warm-charcoal">Control de Préstamos y Entregas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-sepia-heading tracking-tight">
            Gestión de Circulación & Entregas
          </h2>
          <p className="text-xs sm:text-sm text-warm-charcoal mt-0.5">
            Validación de pases QR, entrega de libros reservados y registro de devoluciones físicas.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSimulatingCamera(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">photo_camera</span>
            <span>Simular Escaneo de Cámara</span>
          </button>
        </div>
      </section>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-emerald-700 hover:text-emerald-900">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              En Cola de Retiro
            </span>
            <h4 className="text-2xl font-bold font-display text-gold-burnished mt-1">
              {reservations.length}
            </h4>
            <span className="text-[11px] text-warm-charcoal">Esperando entrega física</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-light text-gold-burnished flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              Préstamos Activos
            </span>
            <h4 className="text-2xl font-bold font-display text-marian-blue mt-1">
              {activeLoans.length}
            </h4>
            <span className="text-[11px] text-marian-blue font-semibold">En plazo reglamentario</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-marian-blue flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">sync_alt</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              Tasa de Retorno
            </span>
            <h4 className="text-2xl font-bold font-display text-emerald-800 mt-1">
              100%
            </h4>
            <span className="text-[11px] text-emerald-700 font-semibold">Comunidad al día</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">verified</span>
          </div>
        </div>
      </section>

      {/* Lookup Workbench Grid: Scanner Box (Left 5 cols) + Validation Card (Right 7 cols) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        {/* Scanner & Manual Lookup Box */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-marble-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-gold-burnished text-lg">barcode_reader</span>
                <h3 className="font-bold font-display text-sm text-sepia-heading">
                  Escanear o Ingresar ID de Reserva
                </h3>
              </div>
              <span className="text-[10px] bg-parchment-base px-2 py-0.5 rounded text-gold-burnished font-mono font-bold">
                Lector USB / Manual
              </span>
            </div>
            <p className="text-xs text-warm-charcoal mb-4">
              Presente el pase QR del lector o ingrese el código alfanumérico para despachar el libro.
            </p>

            <form onSubmit={handleLookup} className="flex flex-col gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">
                  tag
                </span>
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Ej. RES-LOURDES-0001 o nombre del lector"
                  className="w-full pl-9 pr-3 py-2.5 bg-parchment-base rounded-lg border border-marble-border text-xs font-mono font-medium focus:ring-1 focus:ring-gold-burnished text-sepia-heading"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-gold-burnished hover:bg-gold-accent text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>Buscar y Validar Orden</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick suggestions from pending queue */}
          {reservations.length > 0 && (
            <div className="mt-5 pt-4 border-t border-marble-border">
              <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider block mb-2">
                Pases Pendientes en Mostrador:
              </span>
              <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                {reservations.map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => {
                      setSelectedRes(res);
                      setSearchCode(res.reservation_code || '');
                    }}
                    className={`text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                      activeSelected && activeSelected.id === res.id
                        ? 'bg-gold-light/40 border-gold-burnished/50 text-sepia-heading'
                        : 'bg-parchment-base border-marble-border text-warm-charcoal hover:bg-gold-light/20'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <p className="font-bold text-sepia-heading truncate">{res.book_title}</p>
                      <p className="text-[10px] text-warm-charcoal">{res.user_name} · {res.reservation_code}</p>
                    </div>
                    <span className="material-symbols-outlined text-gold-burnished text-sm shrink-0">
                      arrow_forward
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Validation Result Slip */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-marble-border shadow-xs">
          {activeSelected ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-marble-border mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-xl">
                    verified_user
                  </span>
                  <span className="font-bold font-display text-sm text-sepia-heading">
                    Verificado y Listo para Entrega
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] bg-gold-light text-gold-burnished px-2 py-0.5 rounded font-bold">
                    {activeSelected.reservation_code || 'RES-LOURDES-0001'}
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                    Válido
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-4 flex flex-col items-center text-center p-3 bg-parchment-base rounded-xl border border-marble-border">
                  <img
                    src={
                      activeSelected.cover_image ||
                      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={activeSelected.book_title}
                    className="w-24 h-32 object-cover rounded-lg shadow-xs border border-marble-border mb-2"
                  />
                  <span className="text-[10px] uppercase font-bold text-warm-charcoal">
                    Ubicación en Estantería
                  </span>
                  <span className="font-bold text-xs text-sepia-heading mt-0.5">
                    {activeSelected.shelf_location || 'Estantería 2A'}
                  </span>
                </div>

                <div className="sm:col-span-8 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
                      Título a Entregar
                    </span>
                    <h4 className="font-bold font-display text-base text-sepia-heading mt-0.5">
                      {activeSelected.book_title}
                    </h4>
                    <p className="text-xs text-warm-charcoal">{activeSelected.author}</p>

                    <div className="mt-3 p-3 bg-parchment-surface rounded-xl border border-marble-border">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gold-burnished text-white font-bold text-xs flex items-center justify-center">
                          {activeSelected.user_name ? activeSelected.user_name.substring(0, 2).toUpperCase() : 'DM'}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-sepia-heading">
                            {activeSelected.user_name || 'David Miller'}
                          </p>
                          <p className="text-[10px] text-warm-charcoal">
                            Socio Registrado · Sede Central Lourdes
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-warm-charcoal">
                      <div className="p-2 bg-parchment-base rounded-lg border border-marble-border">
                        <span className="block text-[9px] uppercase font-bold text-warm-charcoal">
                          Plazo Préstamo
                        </span>
                        <strong className="text-sepia-heading">21 Días Corridos</strong>
                      </div>
                      <div className="p-2 bg-parchment-base rounded-lg border border-marble-border">
                        <span className="block text-[9px] uppercase font-bold text-warm-charcoal">
                          Punto de Retiro
                        </span>
                        <strong className="text-sepia-heading">Mesa Mostrador Sede</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-marble-border flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeliver(activeSelected)}
                      className="w-full py-2.5 px-4 bg-gold-burnished hover:bg-gold-accent text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>Confirmar Entrega Física (Activar Préstamo)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center text-warm-charcoal">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">
                receipt_long
              </span>
              <p className="text-xs font-bold text-sepia-heading">Ninguna reserva seleccionada</p>
              <p className="text-[11px] max-w-xs mt-1">
                Ingrese un código de reserva a la izquierda o seleccione un pase de la cola de espera para inspeccionarlo.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Active Circulations Table (Préstamos Activos y Devoluciones) */}
      <section className="bg-white rounded-2xl border border-marble-border shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 bg-parchment-surface border-b border-marble-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-marian-blue text-lg">sync_alt</span>
            <h3 className="font-bold font-display text-sm text-sepia-heading">
              Circulación Activa & Registro de Entregas ({loans.length})
            </h3>
          </div>
          <span className="text-[11px] text-warm-charcoal">
            Control de devoluciones y ejemplares en circulación
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-parchment-base/80 text-warm-charcoal uppercase tracking-wider text-[10px] border-b border-marble-border">
                <th className="py-3 px-4">Tomo / Libro</th>
                <th className="py-3 px-4">Lector Asignado</th>
                <th className="py-3 px-4">Fecha Préstamo</th>
                <th className="py-3 px-4">Vencimiento</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-marble-border text-sepia-heading">
              {loans.map((loan) => {
                const isReturned = loan.status === 'devuelto';
                return (
                  <tr key={loan.id} className="hover:bg-gold-light/20 transition-colors">
                    <td className="py-3 px-4 align-middle">
                      <p className="font-bold text-sepia-heading">{loan.book_title}</p>
                      <p className="text-[11px] text-warm-charcoal">{loan.author}</p>
                    </td>

                    <td className="py-3 px-4 align-middle font-medium">
                      {loan.user_name || 'David Miller'}
                    </td>

                    <td className="py-3 px-4 align-middle text-warm-charcoal">
                      {loan.loan_date ? new Date(loan.loan_date).toLocaleDateString() : 'Hoy'}
                    </td>

                    <td className="py-3 px-4 align-middle">
                      <span className="font-bold text-sepia-heading">
                        {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'En 21 días'}
                      </span>
                    </td>

                    <td className="py-3 px-4 align-middle">
                      {isReturned ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          Devuelto
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          En Plazo
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 align-middle text-right">
                      {!isReturned && (
                        <button
                          type="button"
                          onClick={() => handleReturn(loan)}
                          className="px-3 py-1.5 rounded-lg bg-parchment-base hover:bg-gold-burnished hover:text-white border border-marble-border text-sepia-heading font-bold text-xs transition-colors cursor-pointer"
                        >
                          Registrar Devolución
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal: Simular Escaneo de Cámara */}
      {simulatingCamera && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-marble-border text-center">
            <h4 className="font-bold font-display text-base text-sepia-heading">
              Escáner de Cámara Simulado
            </h4>
            <p className="text-xs text-warm-charcoal mt-1">
              Apunte la cámara al pase QR del lector.
            </p>
            <div className="relative w-full h-48 bg-slate-900 rounded-xl my-4 overflow-hidden flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-6xl text-gold-burnished animate-pulse">
                qr_code_scanner
              </span>
              <div className="absolute inset-4 border-2 border-gold-burnished/60 rounded-lg pointer-events-none"></div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSimulatingCamera(false)}
                className="flex-1 py-2 rounded-lg bg-parchment-base text-warm-charcoal font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setSimulatingCamera(false);
                  if (reservations.length > 0) {
                    setSelectedRes(reservations[0]);
                    setSearchCode(reservations[0].reservation_code || '');
                    setSuccessMessage(`¡Pase escaneado correctamente: ${reservations[0].reservation_code}!`);
                  }
                }}
                className="flex-1 py-2 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white font-bold text-xs"
              >
                Capturar Pase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
