import React, { useState } from 'react';
import { api } from '../api';
import { useToast } from '../context/ToastContext';

export default function LoginPage({ onLoginSuccess, onGoToRegister, onGoToCatalog, banner }) {
  const toast = useToast();
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identificador.trim() || !password.trim()) {
      setError('Por favor ingrese su correo/credencial y su contraseña.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const user = await api.login({
        identificador: identificador.trim(),
        password: password.trim(),
      });
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-parchment-base text-sepia-ink selection:bg-gold-burnished selection:text-white">
      {/* ============================================================ */}
      {/* LEFT COLUMN: 50% EDITORIAL BANNER (Capilla Ntra. Sra. de Lourdes) */}
      {/* ============================================================ */}
      <div className="relative w-full lg:w-1/2 min-h-[380px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden order-1 lg:order-1">
        {/* Full-bleed background photo of the chapel */}
        <img
          src={banner?.image_url || '/capilla-fachada.jpg'}
          alt="Capilla Nuestra Señora de Lourdes - Temperley"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Editorial gradient and texture overlays for contrast and elegance */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/55 to-stone-900/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,134,11,0.25)_0%,transparent_60%)]"></div>

        {/* Center / Bottom Editorial Copy */}
        <div className="relative z-10 flex flex-col gap-4 max-w-xl my-auto pt-10 pb-6 lg:py-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-burnished/90 text-white w-max shadow-sm backdrop-blur-sm">
            <span className="material-symbols-outlined text-sm">auto_stories</span>
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {banner?.badge_text || 'Biblioteca Popular San Tito Brandsma'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold font-display text-white tracking-tight leading-tight drop-shadow-md">
            {banner?.title || 'Biblioteca Popular San Tito Brandsma'}
          </h1>

          <p className="text-xs sm:text-sm text-stone-200/95 italic font-display border-l-2 border-gold-accent pl-3.5 leading-relaxed">
            "{banner?.quote ? banner.quote.replace(/^"|"$/g, '') : 'La lectura, la reflexión y la verdad como faro abierto para toda nuestra comunidad y familias de Temperley.'}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-xs">
              <span className="material-symbols-outlined text-gold-accent text-xl shrink-0">
                book_online
              </span>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold">Préstamos a Domicilio</span>
                <span className="text-[10px] text-stone-300">21 días renovables gratis</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-xs">
              <span className="material-symbols-outlined text-gold-accent text-xl shrink-0">
                storefront
              </span>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold">Retiro en el Atrio</span>
                <span className="text-[10px] text-stone-300">Tras la misa o secretaría</span>
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
      {/* RIGHT COLUMN: 50% CLEAN LOGIN WORKSPACE (NO SITE HEADER) */}
      {/* ============================================================ */}
      <div className="relative w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-[#fdfbf7] order-2 lg:order-2">
        {/* Top Minimalist Navigation (No bulky header) */}
        <div className="flex items-center justify-between w-full">
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
            onClick={onGoToRegister}
            className="text-xs font-bold text-gold-burnished hover:text-gold-accent transition-colors px-3 py-1.5 rounded-lg bg-gold-light/60 hover:bg-gold-light border border-gold-burnished/20 cursor-pointer"
          >
            Inscribirme como Lector
          </button>
        </div>

        {/* Centered Login Card Form */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gold-light border border-gold-burnished/30 text-gold-burnished flex items-center justify-center shadow-xs mb-3">
              <span className="material-symbols-outlined text-3xl">auto_stories</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-warm-charcoal font-bold">
              Portal de Lectores & Socios
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-sepia-heading mt-1">
              Acceso a la Biblioteca
            </h2>
            <p className="text-xs sm:text-sm text-warm-charcoal mt-1.5 max-w-sm">
              Ingresá con tu correo electrónico o credencial de socio para gestionar tus préstamos y reservas.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-sepia-heading">
                Correo Electrónico o N° de Lector
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-warm-charcoal text-lg pointer-events-none">
                  badge
                </span>
                <input
                  type="text"
                  required
                  value={identificador}
                  onChange={(e) => setIdentificador(e.target.value)}
                  placeholder="ej. lector@comunidad.org o GT-4821"
                  className="w-full bg-white pl-10 pr-4 py-2.5 rounded-xl text-sm text-sepia-ink placeholder:text-outline border border-marble-border focus:outline-none focus:ring-2 focus:ring-gold-burnished/40 focus:border-gold-burnished shadow-xs transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-sepia-heading">
                  Contraseña de Acceso
                </label>
                <button
                  type="button"
                  onClick={() => toast.info('Para restablecer su clave, acérquese a secretaría parroquial o consulte al bibliotecario en Sigmund Freud 201.', 'Recuperación de Clave')}
                  className="text-[11px] text-gold-burnished hover:text-gold-accent hover:underline cursor-pointer"
                >
                  ¿Olvidó su clave?
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-warm-charcoal text-lg pointer-events-none">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white pl-10 pr-10 py-2.5 rounded-xl text-sm text-sepia-ink border border-marble-border focus:outline-none focus:ring-2 focus:ring-gold-burnished/40 focus:border-gold-burnished shadow-xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-warm-charcoal hover:text-sepia-heading p-1"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded text-gold-burnished accent-gold-burnished"
                />
                <span className="text-xs text-warm-charcoal">Recordar credenciales en este equipo</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl bg-gold-burnished hover:bg-gold-accent text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer hover:shadow-lg active:scale-[0.99] disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
                login
              </span>
              <span>{loading ? 'Verificando...' : 'Ingresar a la Biblioteca & Catálogo'}</span>
            </button>
          </form>

          {/* Quick catalog exploration button */}
          <div className="mt-4 pt-4 border-t border-marble-border/70 flex flex-col gap-3 text-center">
            <button
              type="button"
              onClick={onGoToCatalog}
              className="w-full py-2.5 px-4 rounded-xl bg-parchment-surface hover:bg-parchment-card text-sepia-heading text-xs font-semibold border border-marble-border transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-gold-burnished">
                explore
              </span>
              <span>Explorar Catálogo Público Sin Iniciar Sesión</span>
            </button>

            <div className="text-xs text-warm-charcoal flex items-center justify-center gap-1">
              <span>¿No tenés carnet de lector vecinal?</span>
              <button
                type="button"
                onClick={onGoToRegister}
                className="font-bold text-gold-burnished hover:text-gold-accent underline cursor-pointer"
              >
                Inscribite gratis aquí
              </button>
            </div>
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
