import React from 'react';

export default function Header({
  searchTerm,
  setSearchTerm,
  user,
  onGoToRegister,
  onGoToLogin,
  onOpenHours,
  sidebarOpen = true,
  onToggleSidebar,
  onGoToBackoffice,
}) {
  return (
    <header
      className={`fixed top-0 right-0 h-20 bg-parchment-base/90 backdrop-blur-xl border-b border-marble-border z-40 px-6 sm:px-8 shadow-xs transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'left-72' : 'left-0'
      }`}
    >
      <div className="h-20 w-full flex items-center justify-between gap-4">
        {/* Left Side: Sidebar Toggle Button + Logo / Title */}
        <div className="flex items-center gap-3 min-w-max">
          {/* Toggle Sidebar Button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg bg-parchment-surface hover:bg-parchment-card text-sepia-ink border border-marble-border hover:border-gold-burnished/50 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
            title={sidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
          >
            <span className="material-symbols-outlined text-xl text-gold-burnished">
              {sidebarOpen ? 'menu_open' : 'menu'}
            </span>
          </button>

          <div className="w-10 h-10 rounded-full bg-gold-light border border-gold-burnished/30 flex items-center justify-center shadow-xs text-gold-burnished shrink-0">
            <span className="material-symbols-outlined text-2xl">local_library</span>
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold font-display text-sepia-heading tracking-tight leading-tight">
              Capilla Ntra. Sra. de Lourdes
            </h1>
            <span className="text-[11px] text-warm-charcoal tracking-wide font-medium">
              Biblioteca Comunitaria · Sigmund Freud 201, Temperley
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden xl:flex items-center gap-4 flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-charcoal text-lg">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar novelas, terror, cuentos o autores..."
              className="w-full bg-parchment-card hover:bg-white rounded-lg py-2 pl-10 pr-12 text-sm text-sepia-ink placeholder:text-outline border border-marble-border focus:outline-none focus:ring-1 focus:ring-gold-burnished focus:border-gold-burnished transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-charcoal hover:text-sepia-ink text-xs p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Actions & User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenHours}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-parchment-surface border border-marble-border hover:bg-gold-light/40 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-gold-burnished animate-pulse shrink-0"></span>
            <span className="text-xs text-warm-charcoal whitespace-nowrap">
              Atención Hoy: <strong className="text-sepia-heading">8:30 AM – 2:00 PM</strong>
            </span>
          </button>

          <button
            onClick={onGoToLogin}
            className="px-3 py-1.5 rounded-lg bg-parchment-surface border border-marble-border text-warm-charcoal hover:text-sepia-heading hover:bg-white transition-all text-xs font-semibold"
          >
            Acceso
          </button>

          <button
            onClick={onGoToRegister}
            className="px-3 py-1.5 rounded-lg bg-gold-light border border-gold-burnished/40 text-gold-burnished hover:bg-gold-burnished hover:text-white transition-all text-xs font-semibold cursor-pointer"
          >
            Inscribir Lector
          </button>

          {onGoToBackoffice && (
            <button
              onClick={onGoToBackoffice}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-burnished hover:bg-gold-accent text-white transition-all text-xs font-semibold shadow-xs cursor-pointer"
              title="Panel de Administración y Control"
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              <span>Backoffice</span>
            </button>
          )}

          {/* User Badge */}
          <div
            onClick={onGoToLogin}
            className="flex items-center gap-2.5 pl-2 border-l border-marble-border shrink-0 cursor-pointer group"
            title="Haga clic para cambiar de cuenta o acceder"
          >
            <div className="flex flex-col text-right hidden sm:flex leading-tight">
              <span className="text-xs font-semibold text-sepia-heading group-hover:text-gold-burnished transition-colors whitespace-nowrap">
                {user ? user.name : 'Vecino Lector'}
              </span>
              <span className="text-[11px] text-gold-burnished font-medium whitespace-nowrap">
                {user ? `Credencial #${user.member_number}` : 'Lector Activo'}
              </span>
            </div>
            <img
              src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"}
              alt="Perfil"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-gold-burnished/40 group-hover:ring-gold-burnished shadow-xs shrink-0 transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
