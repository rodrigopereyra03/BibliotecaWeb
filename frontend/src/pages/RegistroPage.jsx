import React, { useState } from 'react';

export default function RegistroPage({ onRegisterSuccess, onGoToLogin, onGoToCatalog }) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedGenres, setSelectedGenres] = useState(['Novelas & Ficción', 'Terror & Misterio']);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const genresList = [
    'Novelas & Ficción',
    'Terror & Misterio',
    'Cuentos & Fantasía',
    'Suspenso & Policial',
    'Cuentos & Infantil',
    'Historia & Biografías',
  ];

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullname || !email) {
      setError('Por favor complete su nombre y correo electrónico.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onRegisterSuccess({
        name: fullname,
        email: email,
        phone: phone || '+54 11 0000-0000',
        address: address,
      });
    } catch (err) {
      setError(err.message || 'Error al completar la inscripción.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-parchment-base text-sepia-ink selection:bg-gold-burnished selection:text-white">
      {/* ============================================================ */}
      {/* LEFT COLUMN: 50% EDITORIAL BANNER (Nuestra Señora de Lourdes) */}
      {/* ============================================================ */}
      <div className="relative w-full lg:w-1/2 min-h-[380px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden order-1 lg:order-1">
        {/* Full-bleed background photo of Our Lady of Lourdes */}
        <img
          src="/virgen-lourdes.jpg"
          alt="Nuestra Señora de Lourdes - Capilla de Temperley"
          className="absolute inset-0 w-full h-full object-cover object-top scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Editorial gradient and texture overlays for contrast and elegance */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/50 to-stone-900/35"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(30,58,95,0.35)_0%,transparent_60%)]"></div>

        {/* Center / Bottom Editorial Copy */}
        <div className="relative z-10 flex flex-col gap-4 max-w-xl my-auto pt-10 pb-6 lg:py-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marian-blue/90 text-white w-max shadow-sm backdrop-blur-sm">
            <span className="material-symbols-outlined text-sm">how_to_reg</span>
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Inscripción de Nuevos Lectores
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold font-display text-white tracking-tight leading-tight drop-shadow-md">
            Bajo el amparo de la Virgen, sumate a nuestra biblioteca.
          </h1>

          <p className="text-xs sm:text-sm text-stone-200/95 italic font-display border-l-2 border-gold-accent pl-3.5 leading-relaxed">
            "Yo soy la Inmaculada Concepción — Un espacio de fe, encuentro comunitario y lectura para todo Temperley."
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-xs">
              <span className="material-symbols-outlined text-gold-accent text-xl shrink-0">
                auto_stories
              </span>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold">Préstamos por 21 Días</span>
                <span className="text-[10px] text-stone-300">Hasta 2 libros simultáneos</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-xs">
              <span className="material-symbols-outlined text-gold-accent text-xl shrink-0">
                qr_code_2
              </span>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold">Pase Digital QR</span>
                <span className="text-[10px] text-stone-300">Retiro ágil en el atrio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Footer Location Bar */}
        <div className="relative z-10 flex items-center justify-between text-stone-300 text-[11px] pt-4 border-t border-white/15">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-gold-accent text-sm">location_on</span>
            <span>Sigmund Freud 201, Temperley</span>
          </div>
          <span className="text-stone-400">Diócesis de Lomas de Zamora</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT COLUMN: 50% CLEAN REGISTER WORKSPACE (NO SITE HEADER) */}
      {/* ============================================================ */}
      <div className="relative w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[#fdfbf7] order-2 lg:order-2 overflow-y-auto">
        {/* Top Minimalist Navigation (No bulky header) */}
        <div className="flex items-center justify-between w-full mb-6">
          <button
            type="button"
            onClick={onGoToCatalog}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-warm-charcoal hover:text-sepia-heading transition-colors group px-3 py-1.5 rounded-lg hover:bg-parchment-surface border border-transparent hover:border-marble-border cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span>Volver al Catálogo</span>
          </button>

          <button
            type="button"
            onClick={onGoToLogin}
            className="text-xs font-bold text-gold-burnished hover:text-gold-accent transition-colors px-3 py-1.5 rounded-lg bg-gold-light/60 hover:bg-gold-light border border-gold-burnished/20 cursor-pointer"
          >
            Ya tengo cuenta • Iniciar Sesión
          </button>
        </div>

        {/* Centered Register Form */}
        <div className="w-full max-w-lg mx-auto my-auto py-4">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gold-light border border-gold-burnished/30 text-gold-burnished flex items-center justify-center shadow-xs mb-3">
              <span className="material-symbols-outlined text-3xl">badge</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-warm-charcoal font-bold">
              Cédula de Lector Comunitario
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-sepia-heading mt-1">
              Inscripción de Lector Vecinal
            </h2>
            <p className="text-xs sm:text-sm text-warm-charcoal mt-1.5 max-w-sm">
              Completá tus datos para generar tu carnet y comenzar a pedir libros prestados para llevarte a tu casa.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-terracotta-light border border-terracotta/20 text-terracotta text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* SECCIÓN I: Datos Personales */}
            <div className="bg-white rounded-2xl p-5 border border-marble-border shadow-2xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-marble-border">
                <span className="w-6 h-6 rounded-full bg-gold-light text-gold-burnished text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span className="text-xs font-bold text-sepia-heading">Datos del Lector</span>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-sepia-heading">
                  Nombre y Apellido completos *
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-warm-charcoal text-base pointer-events-none">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Ej. Carolina Bianchi"
                    className="w-full bg-parchment-base pl-9 pr-3.5 py-2 rounded-xl text-xs sm:text-sm text-sepia-ink border border-marble-border focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-burnished/40 focus:border-gold-burnished transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-sepia-heading">
                    Correo Electrónico *
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-warm-charcoal text-base pointer-events-none">
                      mail
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vecino@ejemplo.com"
                      className="w-full bg-parchment-base pl-9 pr-3.5 py-2 rounded-xl text-xs sm:text-sm text-sepia-ink border border-marble-border focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-burnished/40 focus:border-gold-burnished transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-sepia-heading">
                    Teléfono / WhatsApp *
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-warm-charcoal text-base pointer-events-none">
                      call
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+54 11 0000-0000"
                      className="w-full bg-parchment-base pl-9 pr-3.5 py-2 rounded-xl text-xs sm:text-sm text-sepia-ink border border-marble-border focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-burnished/40 focus:border-gold-burnished transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-sepia-heading">
                  Barrio o Domicilio en Temperley
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-warm-charcoal text-base pointer-events-none">
                    home
                  </span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej. Temperley Este / Barrio San José"
                    className="w-full bg-parchment-base pl-9 pr-3.5 py-2 rounded-xl text-xs sm:text-sm text-sepia-ink border border-marble-border focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-burnished/40 focus:border-gold-burnished transition-all"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN II: Preferencias Literarias */}
            <div className="bg-white rounded-2xl p-5 border border-marble-border shadow-2xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-marble-border">
                <span className="w-6 h-6 rounded-full bg-gold-light text-gold-burnished text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span className="text-xs font-bold text-sepia-heading">
                  ¿Qué géneros te gusta leer?
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {genresList.map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gold-burnished text-white shadow-xs'
                          : 'bg-parchment-base text-warm-charcoal border border-marble-border hover:bg-gold-light/40'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN III: Contraseña */}
            <div className="bg-white rounded-2xl p-5 border border-marble-border shadow-2xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-marble-border">
                <span className="w-6 h-6 rounded-full bg-gold-light text-gold-burnished text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span className="text-xs font-bold text-sepia-heading">
                  Contraseña para la Web
                </span>
              </div>

              <div className="space-y-1">
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-warm-charcoal text-base pointer-events-none">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-parchment-base pl-9 pr-10 py-2 rounded-xl text-xs sm:text-sm text-sepia-ink border border-marble-border focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-burnished/40 focus:border-gold-burnished transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-warm-charcoal hover:text-sepia-heading p-1"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    <span className="material-symbols-outlined text-base">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gold-burnished hover:bg-gold-accent text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer hover:shadow-lg active:scale-[0.99] disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
                how_to_reg
              </span>
              <span>
                {loading ? 'Generando Credencial...' : 'Completar Registro & Obtener Credencial'}
              </span>
            </button>
          </form>

          {/* Quick catalog link */}
          <div className="mt-4 pt-3 text-center">
            <button
              type="button"
              onClick={onGoToCatalog}
              className="text-xs text-warm-charcoal hover:text-sepia-heading underline"
            >
              Consultar catálogo público sin registrarme
            </button>
          </div>
        </div>

        {/* Bottom fine print */}
        <div className="text-center text-[11px] text-warm-charcoal/70 pt-4">
          Capilla Nuestra Señora de Lourdes • Sigmund Freud 201, Temperley
        </div>
      </div>
    </div>
  );
}
