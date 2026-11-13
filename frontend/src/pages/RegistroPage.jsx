import React, { useState } from 'react';

export default function RegistroPage({ onRegisterSuccess, onGoToLogin, onGoToCatalog }) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedGenres, setSelectedGenres] = useState(['Novelas & Ficción', 'Terror & Misterio']);
  const [password, setPassword] = useState('');
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
      });
    } catch (err) {
      setError(err.message || 'Error al completar la inscripción.');
      setLoading(false);
    }
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
                Capilla Ntra. Sra. de Lourdes
              </span>
              <span className="text-[11px] text-warm-charcoal uppercase tracking-wider mt-1">
                Biblioteca Comunitaria • Sigmund Freud 201, Temperley
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={onGoToLogin}
              className="text-warm-charcoal hover:text-sepia-heading transition-colors"
            >
              Iniciar Sesión
            </button>
            <span className="text-gold-burnished border-b-2 border-gold-burnished pb-1">
              Registro de Lector
            </span>
            <button
              onClick={onGoToCatalog}
              className="px-3 py-1.5 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white transition-all shadow-xs"
            >
              Ver Catálogo
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full pt-28 pb-16 px-6 lg:px-12 max-w-6xl mx-auto flex-1">
        {/* Pastoral Header Banner */}
        <div className="mb-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-marble-border text-gold-burnished text-xs tracking-widest uppercase mb-2 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
              Cédula de Lector Comunitario
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold font-display text-sepia-heading tracking-tight mt-1">
              Inscripción en el Registro de Lectores & Vecinos
            </h1>
            <p className="text-sm text-warm-charcoal mt-2 max-w-2xl leading-relaxed">
              Acceso libre a todos nuestros libros físicos y digitales: cuentos, novelas, terror, suspenso, adaptaciones cinematográficas, historia y literatura universal.
            </p>
          </div>
          <div className="h-px w-full bg-marble-border mt-6"></div>
        </div>

        {/* Main Grid: Form + Aside Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {error && (
              <div className="p-4 rounded-xl bg-terracotta-light border border-terracotta/20 text-terracotta text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* SECCIÓN I: Datos Personales */}
              <div className="bg-white rounded-2xl p-6 border border-marble-border shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-gold-light text-gold-burnished text-xs flex items-center justify-center font-bold">
                    I
                  </span>
                  <div>
                    <h2 className="text-base font-bold font-display text-sepia-heading">
                      Datos Personales del Lector
                    </h2>
                    <p className="text-[11px] text-warm-charcoal">
                      Identidad para el registro de préstamos y retiro
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-xs font-semibold text-sepia-heading flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-gold-burnished">badge</span>
                      Nombre y Apellido completos *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Ej. Roberto Gómez o Carolina Bianchi"
                      className="w-full bg-parchment-base text-sepia-ink px-3.5 py-2 rounded-lg text-sm border border-marble-border focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-burnished transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-sepia-heading flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-gold-burnished">mail</span>
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="lector@ejemplo.com"
                      className="w-full bg-parchment-base text-sepia-ink px-3.5 py-2 rounded-lg text-sm border border-marble-border focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-burnished transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-sepia-heading flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-gold-burnished">call</span>
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+54 11 1234-5678"
                      className="w-full bg-parchment-base text-sepia-ink px-3.5 py-2 rounded-lg text-sm border border-marble-border focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-burnished transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-xs font-semibold text-sepia-heading flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-gold-burnished">home</span>
                      Domicilio o Barrio en Temperley
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ej. Barrio San José / Temperley Este"
                      className="w-full bg-parchment-base text-sepia-ink px-3.5 py-2 rounded-lg text-sm border border-marble-border focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-burnished transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN II: Preferencias de Lectura */}
              <div className="bg-white rounded-2xl p-6 border border-marble-border shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-gold-light text-gold-burnished text-xs flex items-center justify-center font-bold">
                    II
                  </span>
                  <div>
                    <h2 className="text-base font-bold font-display text-sepia-heading">
                      Intereses & Géneros Literarios
                    </h2>
                    <p className="text-[11px] text-warm-charcoal">
                      Seleccione los géneros que más le interesa leer
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {genresList.map((genre) => {
                    const isSelected = selectedGenres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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

              {/* SECCIÓN III: Clave de Acceso */}
              <div className="bg-white rounded-2xl p-6 border border-marble-border shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-gold-light text-gold-burnished text-xs flex items-center justify-center font-bold">
                    III
                  </span>
                  <div>
                    <h2 className="text-base font-bold font-display text-sepia-heading">
                      Contraseña para Reserva Telemática
                    </h2>
                    <p className="text-[11px] text-warm-charcoal">
                      Clave personal para reservar ejemplares desde la web
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-sepia-heading">Crear Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-parchment-base text-sepia-ink px-3.5 py-2 rounded-lg text-sm border border-marble-border focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-burnished transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gold-burnished hover:bg-gold-accent text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">how_to_reg</span>
                <span>{loading ? 'Generando Credencial...' : 'Completar Registro & Obtener Credencial'}</span>
              </button>
            </form>
          </div>

          {/* Aside Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-white border border-marble-border shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 text-gold-burnished">
                <span className="material-symbols-outlined text-xl">card_membership</span>
                <span className="text-xs uppercase font-bold tracking-wider">
                  Beneficios del Lector
                </span>
              </div>
              <h3 className="text-lg font-bold font-display text-sepia-heading">
                ¿Qué incluye su credencial?
              </h3>

              <div className="flex flex-col gap-3 text-xs text-warm-charcoal leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-gold-burnished text-base shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>
                    <strong>Préstamos por 21 días:</strong> Llévese hasta 2 novelas o cuentos simultáneos a su hogar con renovación en línea.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-gold-burnished text-base shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>
                    <strong>Pase Digital QR:</strong> Muestre su teléfono en el atrio parroquial y retire en segundos.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-gold-burnished text-base shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>
                    <strong>Club de Lectura:</strong> Acceso a los debates y mateadas de los jueves a las 18:30 hs.
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-marble-border text-center flex flex-col gap-2">
                <span className="text-xs text-warm-charcoal">¿Ya posee credencial de lector?</span>
                <button
                  type="button"
                  onClick={onGoToLogin}
                  className="w-full py-2 px-4 rounded-lg bg-parchment-surface hover:bg-gold-light text-sepia-heading border border-marble-border text-xs font-bold transition-all"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
