import React from 'react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  activeReservationsCount = 0,
  onOpenHours,
  sidebarOpen = true,
  onToggleSidebar,
  onGoToBackoffice,
  banner,
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
      } bg-parchment-surface/95 backdrop-blur-2xl z-50 flex flex-col justify-between p-3 border-r border-marble-border shadow-[4px_0_24px_-4px_rgba(46,40,35,0.06)] transition-all duration-300 ease-in-out overflow-y-auto`}
    >
      <div className="flex flex-col gap-5">
        {/* Brand Header */}
        <div className={`px-2 pt-1 flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
          <div className="w-2.5 h-2.5 rounded-full bg-gold-burnished shadow-[0_0_8px_rgba(184,134,11,0.6)] shrink-0" title="Biblioteca Popular San Tito Brandsma"></div>
          {sidebarOpen && (
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="text-xs uppercase tracking-wider text-sepia-heading font-bold leading-tight truncate">
                Bibl. San Tito Brandsma
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gold-burnished font-semibold leading-tight truncate">
                Capilla Ntra. Sra. de Lourdes
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

      {/* Footer Vertical Banner Tótem */}
      {sidebarOpen ? (
        <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-marble-border/60">
          <div
            onClick={onOpenHours}
            className="group relative rounded-2xl overflow-hidden shadow-sm border border-marble-border/80 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-gold-burnished/50"
            title="Haga clic para ver los horarios del despacho"
          >
            {/* Background photo of chapel */}
            <div className="relative h-44 w-full overflow-hidden bg-stone-900">
              <img
                src={banner?.image_url || '/capilla-fachada.jpg'}
                alt="Capilla Ntra. Sra. de Lourdes"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent"></div>

              {/* Banner Text Content */}
              <div className="absolute bottom-2.5 left-3 right-3 text-white z-10 flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wider text-gold-accent font-bold">
                  {banner?.tagline || 'Atrio Parroquial'}
                </span>
                <h4 className="text-sm font-bold font-display text-white leading-tight">
                  {banner?.title || 'Retiro y Devolución de Libros'}
                </h4>
                <p className="text-[11px] text-stone-200 line-clamp-2 leading-snug mt-0.5">
                  {banner?.description || 'Vení a buscar tus ejemplares tras la jornada comunitaria o en secretaría.'}
                </p>
              </div>
            </div>

            {/* Click to open hours bar */}
            <div className="p-2.5 bg-white flex items-center justify-between border-t border-marble-border/60 text-xs">
              <div className="flex items-center gap-1.5 text-gold-burnished font-semibold">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>{banner?.button_text || 'Ver Horarios de Despacho'}</span>
              </div>
              <span className="material-symbols-outlined text-sm text-warm-charcoal group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>

          <div className="px-1.5 py-0.5 flex items-center justify-between text-outline text-[11px]">
            <div className="flex items-center gap-1 text-warm-charcoal">
              <span className="material-symbols-outlined text-xs text-gold-burnished">location_on</span>
              <span className="font-medium">Sigmund Freud 201, Temperley</span>
            </div>
            <span className="material-symbols-outlined text-xs text-gold-burnished" title="Sede Oficial">
              verified
            </span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenHours}
          className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gold-light/40 transition-colors text-gold-burnished cursor-pointer"
          title="Atrio Parroquial · Ver Horarios de Despacho"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-gold-burnished/40 relative shadow-2xs">
            <img src="/capilla-fachada.jpg" alt="Capilla" className="w-full h-full object-cover" />
          </div>
          <span className="material-symbols-outlined text-sm">schedule</span>
        </button>
      )}
    </aside>
  );
}
