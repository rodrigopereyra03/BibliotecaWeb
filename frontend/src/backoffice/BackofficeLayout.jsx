import React, { useState } from 'react';

export default function BackofficeLayout({
  activeView,
  setActiveView,
  onExitBackoffice,
  booksCount = 0,
  pendingCount = 0,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Panel y Analítica', icon: 'analytics' },
    {
      id: 'inventory',
      label: 'Catálogo e Inventario',
      icon: 'menu_book',
      badge: booksCount > 0 ? `${booksCount} Activos` : null,
    },
    {
      id: 'circulation',
      label: 'Circulación y Entregas',
      icon: 'qr_code_scanner',
      badge: pendingCount > 0 ? `${pendingCount} En Cola` : null,
      badgeColor: 'bg-terracotta text-white',
    },
    { id: 'members', label: 'Miembros y Perfiles', icon: 'group' },
    { id: 'communications', label: 'Comunicaciones y Anuncios', icon: 'campaign' },
    { id: 'settings', label: 'Configuración y Despacho', icon: 'settings' },
  ];

  return (
    <div className="bg-parchment-base min-h-screen text-sepia-ink flex flex-col antialiased">
      {/* Desktop Sidebar (Fixed Left) */}
      <aside
        className={`fixed left-0 top-0 h-full ${
          desktopSidebarOpen ? 'w-72' : 'w-20'
        } bg-parchment-surface border-r border-marble-border shadow-xs z-50 hidden lg:flex flex-col justify-between transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col">
          {/* Header Brand */}
          <div className={`p-4 flex items-center ${desktopSidebarOpen ? 'gap-3' : 'justify-center'} bg-white/70 border-b border-marble-border`}>
            <div className="w-10 h-10 rounded-lg bg-gold-light border border-gold-burnished/30 text-gold-burnished flex items-center justify-center shrink-0 shadow-xs" title="Centro de Gestión">
              <span className="material-symbols-outlined text-2xl">local_library</span>
            </div>
            {desktopSidebarOpen && (
              <div className="flex flex-col min-w-0 overflow-hidden">
                <h2 className="text-sm font-bold font-display text-sepia-heading leading-tight truncate">
                  Centro de Gestión
                </h2>
                <span className="text-[10px] uppercase tracking-wider text-gold-burnished font-bold truncate">
                  Biblioteca & Archivo Parroquial
                </span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 p-3">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  title={item.label}
                  className={`flex items-center ${
                    desktopSidebarOpen ? 'px-3.5 py-2.5 justify-between' : 'p-2.5 justify-center'
                  } rounded-lg text-xs transition-all group text-left relative ${
                    isActive
                      ? 'bg-gold-burnished text-white font-bold shadow-xs'
                      : 'text-warm-charcoal hover:bg-white hover:text-sepia-heading'
                  }`}
                >
                  <div className={`flex items-center ${desktopSidebarOpen ? 'gap-3 min-w-0' : 'justify-center'}`}>
                    <span
                      className={`material-symbols-outlined text-xl shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-outline group-hover:text-gold-burnished'
                      }`}
                    >
                      {item.icon}
                    </span>
                    {desktopSidebarOpen && <span className="truncate">{item.label}</span>}
                  </div>
                  {item.badge && (
                    desktopSidebarOpen ? (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold shrink-0 ml-1 ${
                          item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-parchment-card text-warm-charcoal')
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-terracotta"></span>
                    )
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer: Return to Public Portal */}
        <div className={`p-4 bg-white/60 border-t border-marble-border flex flex-col ${desktopSidebarOpen ? 'gap-3' : 'items-center gap-2'}`}>
          <button
            onClick={onExitBackoffice}
            title="Volver al Portal de Lectores"
            className={`flex items-center ${desktopSidebarOpen ? 'gap-2 text-left' : 'justify-center p-1'} text-xs font-bold text-gold-burnished hover:text-gold-accent transition-colors`}
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            {desktopSidebarOpen && <span>← Portal de Lectores</span>}
          </button>
          {desktopSidebarOpen ? (
            <div className="flex items-start gap-2 text-warm-charcoal text-[11px]">
              <span className="material-symbols-outlined text-sm text-gold-burnished mt-0.5">church</span>
              <div>
                <p className="font-bold text-sepia-heading">Sede Temperley</p>
                <p className="text-outline text-[10px]">Sigmund Freud 201</p>
              </div>
            </div>
          ) : (
            <span className="material-symbols-outlined text-sm text-gold-burnished" title="Sede Temperley · Sigmund Freud 201">
              church
            </span>
          )}
        </div>
      </aside>

      {/* Main Content Container with Left Offset */}
      <div
        className={`${
          desktopSidebarOpen ? 'lg:pl-72' : 'lg:pl-20'
        } flex flex-col min-h-screen transition-all duration-300 ease-in-out`}
      >
        {/* Top Header Bar */}
        <header
          className={`fixed top-0 ${
            desktopSidebarOpen ? 'lg:left-72' : 'lg:left-20'
          } left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-b border-marble-border z-40 flex items-center justify-between px-4 sm:px-8 shadow-xs transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Desktop Sidebar Collapse Toggle */}
            <button
              type="button"
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              className="hidden lg:flex p-2 rounded-lg bg-parchment-surface hover:bg-parchment-card text-sepia-ink border border-marble-border hover:border-gold-burnished/50 transition-all items-center justify-center shrink-0 cursor-pointer shadow-2xs mr-1"
              title={desktopSidebarOpen ? 'Colapsar menú (solo iconos)' : 'Expandir menú lateral'}
            >
              <span className="material-symbols-outlined text-xl text-gold-burnished">
                {desktopSidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-warm-charcoal hover:text-sepia-ink rounded-lg"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>

            <div className="flex flex-col min-w-0">
              <h1 className="text-sm sm:text-base font-bold font-display text-sepia-heading truncate leading-tight">
                Sistema de Gestión Bibliotecaria
              </h1>
              <span className="text-[10px] sm:text-[11px] text-warm-charcoal truncate">
                Capilla Ntra. Sra. de Lourdes • Backoffice Administrativo
              </span>
            </div>

            <div className="hidden xl:flex items-center gap-1.5 bg-parchment-surface border border-marble-border px-3 py-1 rounded-full text-xs text-warm-charcoal">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
              <span>Base de Datos PostgreSQL Conectada</span>
            </div>
          </div>

          {/* Right Profile & Return Shortcut */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onExitBackoffice}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-parchment-surface hover:bg-gold-light/40 border border-marble-border text-xs font-semibold text-warm-charcoal hover:text-sepia-heading transition-all"
            >
              <span className="material-symbols-outlined text-base text-gold-burnished">home</span>
              <span>Ver Web Pública</span>
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-marble-border">
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-xs font-bold text-sepia-heading">Administrador</p>
                <span className="text-[10px] text-gold-burnished font-semibold">Operaciones & Atrio</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gold-burnished text-white flex items-center justify-center font-bold text-xs shadow-xs">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Slide Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative w-72 bg-parchment-surface h-full shadow-2xl z-10 flex flex-col justify-between p-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-marble-border mb-3">
                  <span className="font-bold font-display text-sepia-heading text-sm">Menú de Gestión</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-warm-charcoal">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                        activeView === item.id ? 'bg-gold-burnished text-white font-bold' : 'text-warm-charcoal'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onExitBackoffice();
                }}
                className="w-full py-2 px-3 rounded-lg bg-gold-light text-gold-burnished text-xs font-bold border border-gold-burnished/30"
              >
                ← Volver a Web Pública
              </button>
            </div>
          </div>
        )}

        {/* Main Body View */}
        <main className="w-full pt-20 px-4 sm:px-8 pb-12 flex-1 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}
