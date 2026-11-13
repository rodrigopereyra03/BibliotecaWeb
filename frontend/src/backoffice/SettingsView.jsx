import React, { useState } from 'react';

export default function SettingsView() {
  const [loanDays, setLoanDays] = useState(21);
  const [maxRenewals, setMaxRenewals] = useState(3);
  const [maxBooks, setMaxBooks] = useState(2);
  const [reserveHours, setReserveHours] = useState(48);
  const [address, setAddress] = useState('Sigmund Freud 201, Temperley, Pcia. de Buenos Aires');
  const [deskHours, setDeskHours] = useState('Martes a Sábados: 16:30 a 19:30 hs · Domingos post-misa');
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage('¡Configuraciones y parámetros guardados correctamente!');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Header */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 mb-6 border-b border-marble-border">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-gold-burnished font-bold">
              Administración & Políticas Operativas
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
            <span className="text-xs text-warm-charcoal">Parámetros del Despacho</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-sepia-heading tracking-tight">
            Configuración y Políticas de Préstamo
          </h2>
          <p className="text-xs sm:text-sm text-warm-charcoal mt-0.5">
            Definición centralizada de reglas de préstamo, horarios de atención parroquial y límites de circulación.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            <span>Guardar Parámetros</span>
          </button>
        </div>
      </section>

      {/* Notification Toast */}
      {savedMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">verified</span>
            <span>{savedMessage}</span>
          </div>
          <button onClick={() => setSavedMessage('')} className="text-emerald-700 hover:text-emerald-900">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Loan Rules (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-5 border border-marble-border shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-marble-border mb-4">
              <span className="material-symbols-outlined text-gold-burnished text-lg">policy</span>
              <h3 className="font-bold font-display text-sm text-sepia-heading">
                Reglas de Préstamo y Circulación
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-sepia-heading mb-1">
                  Duración Estándar del Préstamo (Días Corridos)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="7"
                    max="60"
                    value={loanDays}
                    onChange={(e) => setLoanDays(e.target.value)}
                    className="w-32 px-3 py-2 bg-parchment-base rounded-lg border border-marble-border text-xs font-bold text-sepia-heading focus:ring-1 focus:ring-gold-burnished"
                  />
                  <span className="text-warm-charcoal">
                    Por defecto 21 días (conforme a los lineamientos aprobados).
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-sepia-heading mb-1">
                  Cantidad Máxima de Renovaciones / Prórrogas
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={maxRenewals}
                    onChange={(e) => setMaxRenewals(e.target.value)}
                    className="w-32 px-3 py-2 bg-parchment-base rounded-lg border border-marble-border text-xs font-bold text-sepia-heading focus:ring-1 focus:ring-gold-burnished"
                  />
                  <span className="text-warm-charcoal">
                    Hasta 3 prórrogas consecutivas si el libro no tiene reservas en cola.
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-sepia-heading mb-1">
                  Límite de Ejemplares Simultáneos por Lector
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={maxBooks}
                    onChange={(e) => setMaxBooks(e.target.value)}
                    className="w-32 px-3 py-2 bg-parchment-base rounded-lg border border-marble-border text-xs font-bold text-sepia-heading focus:ring-1 focus:ring-gold-burnished"
                  />
                  <span className="text-warm-charcoal">
                    Permite hasta 2 libros físicos al mismo tiempo por lector o socio.
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-sepia-heading mb-1">
                  Ventana de Retiro tras Reserva (Horas)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="12"
                    max="120"
                    value={reserveHours}
                    onChange={(e) => setReserveHours(e.target.value)}
                    className="w-32 px-3 py-2 bg-parchment-base rounded-lg border border-marble-border text-xs font-bold text-sepia-heading focus:ring-1 focus:ring-gold-burnished"
                  />
                  <span className="text-warm-charcoal">
                    Tiempo que se reserva el ejemplar antes de volver al catálogo público.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-marble-border shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-marble-border mb-4">
              <span className="material-symbols-outlined text-gold-burnished text-lg">schedule</span>
              <h3 className="font-bold font-display text-sm text-sepia-heading">
                Atención Parroquial & Mesa de Entrada
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-sepia-heading mb-1">
                  Horarios de Atención de la Biblioteca
                </label>
                <input
                  type="text"
                  value={deskHours}
                  onChange={(e) => setDeskHours(e.target.value)}
                  className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border text-xs text-sepia-heading focus:ring-1 focus:ring-gold-burnished"
                />
              </div>

              <div>
                <label className="block font-bold text-sepia-heading mb-1">
                  Ubicación Física de la Parroquia
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-parchment-base rounded-lg border border-marble-border text-xs text-sepia-heading focus:ring-1 focus:ring-gold-burnished"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Summary (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-5 border border-marble-border shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-marble-border mb-3">
              <span className="material-symbols-outlined text-gold-burnished text-lg">church</span>
              <h4 className="font-bold font-display text-sm text-sepia-heading">
                Sede Central Lourdes
              </h4>
            </div>

            <div className="p-3 bg-parchment-base rounded-xl border border-marble-border text-xs text-warm-charcoal mb-4">
              <p className="font-bold text-sepia-heading">Capilla Nuestra Señora de Lourdes</p>
              <p className="text-[11px] mt-0.5">Diócesis de Lomas de Zamora · Temperley</p>
              <p className="text-[11px] text-gold-burnished font-semibold mt-1">
                Fondo Abierto a Todo el Barrio (Novelas, Historia, Terror, Clásicos, Teología)
              </p>
            </div>

            <div className="space-y-2 text-xs text-warm-charcoal">
              <div className="flex justify-between py-1 border-b border-marble-border">
                <span>Modo de Sistema:</span>
                <span className="font-bold text-emerald-700">Monolito Go + React</span>
              </div>
              <div className="flex justify-between py-1 border-b border-marble-border">
                <span>Base de Datos:</span>
                <span className="font-bold text-sepia-heading">PostgreSQL (Neon Cloud)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-marble-border">
                <span>Validación de Pases:</span>
                <span className="font-bold text-sepia-heading">Códigos QR Dinámicos</span>
              </div>
            </div>

            <div className="mt-5">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Aplicar y Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
