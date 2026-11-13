import React, { useState } from 'react';

export default function LoginPage({ onLoginSuccess, onGoToRegister, onGoToCatalog }) {
  const [identificador, setIdentificador] = useState('david.miller@vecinos.org');
  const [password, setPassword] = useState('••••••••••••');
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      name: 'David Miller',
      email: identificador.includes('@') ? identificador : 'david.miller@vecinos.org',
      member_number: 'GT-4821',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: 'lector',
    });
  };

  return (
    <div className="bg-parchment-base min-h-screen text-sepia-ink flex flex-col justify-between">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-parchment-surface/90 backdrop-blur-xl border-b border-marble-border shadow-xs">
        <div className="h-20 w-full px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold-light border border-gold-burnished/30 flex items-center justify-center text-gold-burnished shadow-xs">
              <span className="material-symbols-outlined text-2xl">auto_stories</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold font-display text-sepia-heading leading-none">
                Biblioteca Comunitaria
              </span>
              <span className="text-[11px] text-warm-charcoal uppercase tracking-wider mt-1">
                Capilla Ntra. Sra. de Lourdes • Temperley
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-gold-burnished border-b-2 border-gold-burnished pb-1">
              Acceso & Login
            </span>
            <button
              onClick={onGoToRegister}
              className="text-warm-charcoal hover:text-sepia-heading transition-colors"
            >
              Registro
            </button>
            <button
              onClick={onGoToCatalog}
              className="px-3 py-1.5 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white transition-all shadow-xs"
            >
              Ver Catálogo Sin Cuenta
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full pt-28 pb-16 px-6 lg:px-12 max-w-6xl mx-auto flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          {/* Left Column: Visual & Info */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 pr-0 lg:pr-4">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white border border-marble-border text-gold-burnished shadow-2xs">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                menu_book
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold">
                Préstamos • Lectura • Comunidad
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl lg:text-4xl font-bold font-display text-sepia-heading leading-tight">
                Lectura, Cultura y Encuentro.
              </h2>
              <p className="text-sm text-warm-charcoal leading-relaxed">
                Catálogo abierto a toda la comunidad: novelas, cuentos, terror, suspenso, policiaco, adaptaciones, historia y literatura universal.
              </p>
            </div>

            {/* Illustration Card */}
            <div className="relative rounded-2xl overflow-hidden bg-parchment-card border border-marble-border shadow-md group">
              <div
                className="w-full h-48 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1507842229451-77236167c293?auto=format&fit=crop&w=800&q=80")',
                }}
              ></div>
              <div className="p-4 bg-white flex items-center justify-between border-t border-marble-border">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-sepia-heading">Fondo Bibliográfico Abierto</span>
                  <span className="text-[11px] text-warm-charcoal">Colección General • Biblioteca Comunitaria</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gold-burnished flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-base">verified</span>
                </div>
              </div>
            </div>

            {/* Parish Location info */}
            <div className="p-4 rounded-xl bg-white border border-marble-border text-sepia-ink flex items-start gap-3 shadow-xs">
              <span className="material-symbols-outlined text-gold-burnished text-xl shrink-0 mt-0.5">
                location_on
              </span>
              <div className="flex flex-col text-xs">
                <span className="font-bold text-sepia-heading">Sede & Horarios de Atención</span>
                <span className="text-warm-charcoal mt-0.5">Sigmund Freud 201, Temperley, Pcia. de Buenos Aires.</span>
                <span className="text-warm-charcoal mt-0.5 font-medium">Horario de retiro: Lunes a Sábados y domingos tras la misa.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-lg bg-white rounded-2xl border border-marble-border shadow-xl p-8 sm:p-10 relative">
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-gold-burnished via-gold-accent to-gold-burnished"></div>

              <div className="flex flex-col items-center text-center space-y-2 mb-6">
                <div className="w-14 h-14 rounded-full bg-gold-light border border-gold-burnished/30 text-gold-burnished flex items-center justify-center shadow-xs mb-1">
                  <span className="material-symbols-outlined text-3xl">local_library</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-warm-charcoal font-semibold">
                  Capilla Ntra. Sra. de Lourdes • Temperley
                </span>
                <h1 className="text-2xl font-bold font-display text-sepia-heading">
                  Acceso a la Biblioteca Comunitaria
                </h1>
                <p className="text-xs text-warm-charcoal">
                  Portal de Lectores, Socios y Vecinos de la Comunidad
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-sepia-heading">
                    Correo Electrónico o N° de Socio / Lector Registrado
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-warm-charcoal text-lg pointer-events-none">
                      badge
                    </span>
                    <input
                      type="text"
                      value={identificador}
                      onChange={(e) => setIdentificador(e.target.value)}
                      placeholder="ej. lector@comunidad.org o GT-4821"
                      className="w-full bg-parchment-base pl-10 pr-4 py-2.5 rounded-lg text-sm text-sepia-ink placeholder:text-outline border border-marble-border focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-burnished transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-sepia-heading">
                      Contraseña de Acceso
                    </label>
                    <a href="#olvido" onClick={(e) => { e.preventDefault(); alert('Consulte en el mostrador del atrio para restablecer su clave.'); }} className="text-[11px] text-gold-burnished hover:underline">
                      ¿Olvidó sus credenciales?
                    </a>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-warm-charcoal text-lg pointer-events-none">
                      key
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-parchment-base pl-10 pr-10 py-2.5 rounded-lg text-sm text-sepia-ink border border-marble-border focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-burnished transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 rounded text-gold-burnished accent-amber-700"
                    />
                    <span className="text-xs text-warm-charcoal">Recordar en este equipo de lectura</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">
                    local_library
                  </span>
                  <span>Ingresar a la Biblioteca & Catálogo</span>
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-marble-border text-center flex flex-col gap-2">
                <span className="text-xs text-warm-charcoal">
                  ¿Aún no posee credencial de lector vecinal?
                </span>
                <button
                  type="button"
                  onClick={onGoToRegister}
                  className="text-xs font-bold text-gold-burnished hover:text-gold-accent transition-colors underline"
                >
                  Inscríbase como nuevo lector aquí
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
