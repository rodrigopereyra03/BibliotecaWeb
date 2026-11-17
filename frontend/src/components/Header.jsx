import React from 'react';
import UserAvatar from './UserAvatar';

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
  onGoToProfile,
  onLogout,
}) {
  return (
    <header
      className={`fixed top-0 right-0 h-20 bg-parchment-base/90 backdrop-blur-xl border-b border-marble-border z-40 px-4 sm:px-8 shadow-xs transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'lg:left-72' : 'lg:left-20'
      } left-0`}
    >
      <div className="h-20 w-full flex items-center justify-between gap-4">
        {/* Left Side: Sidebar Toggle Button + Logo / Title */}
        <div className="flex items-center gap-3 min-w-max">
          {/* Toggle Sidebar Button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg bg-parchment-surface hover:bg-parchment-card text-sepia-ink border border-marble-border hover:border-gold-burnished/50 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
            title={sidebarOpen ? 'Colapsar menú (solo iconos)' : 'Expandir menú lateral'}
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
              Biblioteca Popular San Tito Brandsma
            </h1>
            <span className="text-[11px] text-warm-charcoal tracking-wide font-medium">
              Capilla Ntra. Sra. de Lourdes · Sigmund Freud 201, Temperley
            </span>
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

          {!user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onGoToLogin}
                className="px-3.5 py-1.5 rounded-lg bg-parchment-surface border border-marble-border text-warm-charcoal hover:text-sepia-heading hover:bg-white transition-all text-xs font-semibold cursor-pointer shadow-2xs"
              >
                Acceso
              </button>

              <button
                onClick={onGoToRegister}
                className="px-3.5 py-1.5 rounded-lg bg-gold-light border border-gold-burnished/40 text-gold-burnished hover:bg-gold-burnished hover:text-white transition-all text-xs font-semibold cursor-pointer shadow-2xs"
              >
                Inscribirme
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {user.role === 'admin' && onGoToBackoffice && (
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
              <div className="flex items-center gap-2.5 pl-2 border-l border-marble-border shrink-0">
                <button
                  type="button"
                  onClick={onGoToProfile}
                  title="Ver Mi Perfil y Credencial"
                  className="flex items-center gap-2.5 text-right hover:opacity-90 transition-opacity cursor-pointer group"
                >
                  <div className="flex flex-col text-right hidden sm:flex leading-tight">
                    <span className="text-xs font-semibold text-sepia-heading group-hover:text-gold-burnished transition-colors whitespace-nowrap">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-gold-burnished font-medium whitespace-nowrap">
                      {user.role === 'admin' ? 'Administrador' : `Credencial #${user.member_number}`}
                    </span>
                  </div>
                  <UserAvatar user={user} size="md" showRoleBadge />
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Cerrar Sesión"
                    className="p-1.5 rounded-lg text-warm-charcoal hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
