import React from 'react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  activeReservationsCount = 0,
  onOpenHours,
  sidebarOpen = true,
  onToggleSidebar,
  onGoToBackoffice,
}) {
  const navItems = [
    { id: 'catalogo', label: 'Catálogo General', icon: 'auto_stories' },
    {
      id: 'reservas',
      label: 'Mis Reservas & Préstamos',
      icon: 'bookmark',
      badge: activeReservationsCount > 0 ? `${activeReservationsCount} Activas` : null,
    },
    { id: 'historial', label: 'Historial de Préstamos', icon: 'history_edu' },
    { id: 'noticias', label: 'Noticias & Cartelera', icon: 'newspaper' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full ${
        sidebarOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
      } bg-parchment-surface/95 backdrop-blur-2xl z-50 flex flex-col justify-between p-3 border-r border-marble-border shadow-[4px_0_24px_-4px_rgba(46,40,35,0.06)] transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-col gap-5">
        {/* Brand Header */}
        <div className={`px-2 pt-1 flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
          <div className="w-2.5 h-2.5 rounded-full bg-gold-burnished shadow-[0_0_8px_rgba(184,134,11,0.6)] shrink-0" title="Capilla Ntra. Sra. de Lourdes"></div>
          {sidebarOpen && (
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="text-xs uppercase tracking-wider text-warm-charcoal font-bold leading-tight truncate">
                Capilla Ntra. Sra. de Lourdes
              </span>
              <span className="text-[11px] uppercase tracking-wider text-gold-burnished font-semibold leading-tight truncate">
                Biblioteca Comunitaria
              </span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`flex items-center ${
                  sidebarOpen ? 'px-3.5 py-2.5 justify-between' : 'p-2.5 justify-center'
                } rounded-lg text-sm transition-all group text-left relative ${
                  isActive
                    ? 'bg-parchment-card text-sepia-ink font-semibold shadow-sm border border-marble-border/80'
                    : 'text-warm-charcoal hover:bg-parchment-card hover:text-sepia-ink'
                }`}
              >
                <div className={`flex items-center ${sidebarOpen ? 'gap-3 min-w-0' : 'justify-center'}`}>
                  <span
                    className={`material-symbols-outlined text-xl shrink-0 transition-colors ${
                      isActive ? 'text-gold-burnished' : 'text-outline group-hover:text-gold-burnished'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </div>
                {item.badge && (
                  sidebarOpen ? (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-gold-burnished text-white font-semibold shadow-xs shrink-0 ml-1">
                      {item.badge}
                    </span>
                  ) : (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-burnished"></span>
                  )
                )}
              </button>
            );
          })}

          <button
            onClick={onOpenHours}
            title="Horarios del Despacho"
            className={`flex items-center ${
              sidebarOpen ? 'px-3.5 py-2.5 justify-between' : 'p-2.5 justify-center'
            } rounded-lg text-sm text-warm-charcoal hover:bg-parchment-card hover:text-sepia-ink transition-all group text-left`}
          >
            <div className={`flex items-center ${sidebarOpen ? 'gap-3 min-w-0' : 'justify-center'}`}>
              <span className="material-symbols-outlined text-outline group-hover:text-gold-burnished text-xl shrink-0 transition-colors">
                church
              </span>
              {sidebarOpen && <span className="truncate">Horarios del Despacho</span>}
            </div>
          </button>

          <div className="my-1.5 border-t border-marble-border/70"></div>

          {/* Dedicated Login and Register Tabs */}
          <button
            onClick={() => setActiveTab('login')}
            title="Pantalla de Acceso / Login"
            className={`flex items-center ${
              sidebarOpen ? 'gap-3 px-3.5 py-2 text-left' : 'justify-center p-2'
            } rounded-lg text-xs transition-all ${
              activeTab === 'login'
                ? 'bg-gold-light text-gold-burnished font-bold border border-gold-burnished/30'
                : 'text-warm-charcoal hover:bg-parchment-card hover:text-sepia-ink'
            }`}
          >
            <span className="material-symbols-outlined text-base shrink-0">login</span>
            {sidebarOpen && <span className="truncate">Pantalla de Acceso / Login</span>}
          </button>

          <button
            onClick={() => setActiveTab('registro')}
            title="Pantalla de Registro"
            className={`flex items-center ${
              sidebarOpen ? 'gap-3 px-3.5 py-2 text-left' : 'justify-center p-2'
            } rounded-lg text-xs transition-all ${
              activeTab === 'registro'
                ? 'bg-gold-light text-gold-burnished font-bold border border-gold-burnished/30'
                : 'text-warm-charcoal hover:bg-parchment-card hover:text-sepia-ink'
            }`}
          >
            <span className="material-symbols-outlined text-base shrink-0">person_add</span>
            {sidebarOpen && <span className="truncate">Pantalla de Registro</span>}
          </button>

          <div className="my-1.5 border-t border-marble-border/70"></div>

          {/* Backoffice Admin Mode Link */}
          {onGoToBackoffice && (
            <button
              onClick={onGoToBackoffice}
              title="Modo Backoffice (Administración)"
              className={`flex items-center ${
                sidebarOpen ? 'gap-3 px-3.5 py-2.5 text-left' : 'justify-center p-2.5'
              } rounded-lg text-xs font-bold bg-gold-burnished hover:bg-gold-accent text-white transition-all shadow-xs cursor-pointer group`}
            >
              <span className="material-symbols-outlined text-base shrink-0 group-hover:rotate-45 transition-transform">
                admin_panel_settings
              </span>
              {sidebarOpen && <span className="truncate">⚙️ Modo Backoffice</span>}
            </button>
          )}
        </nav>
      </div>

      {/* Footer Info Box */}
      {sidebarOpen ? (
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-xl bg-parchment-card border border-marble-border shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-gold-burnished/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center gap-1.5 text-gold-burnished font-semibold">
              <span className="material-symbols-outlined text-base">meeting_room</span>
              <span className="text-xs uppercase tracking-wider font-bold">Atrio Parroquial</span>
            </div>
            <p className="text-xs text-warm-charcoal leading-relaxed">
              Mostrador de Biblioteca del Atrio · Disponible para retiro y devolución tras la Santa Misa o secretaría.
            </p>
            <div className="mt-1 text-[11px] font-medium text-gold-burnished">
              Préstamos por 21 días renovables
            </div>
          </div>

          <div className="px-2 py-1 flex items-center justify-between text-outline text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="uppercase tracking-wider text-warm-charcoal font-bold text-[10px]">
                SEDE TEMPERLEY
              </span>
              <span className="text-[11px] text-outline leading-tight">
                Sigmund Freud 201, Temperley
              </span>
            </div>
            <span className="material-symbols-outlined text-sm text-gold-burnished" title="Sede Verificada">
              verified
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-2 text-gold-burnished" title="Sede Temperley · Sigmund Freud 201">
          <span className="material-symbols-outlined text-lg">meeting_room</span>
        </div>
      )}
    </aside>
  );
}
