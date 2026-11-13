import React from 'react';

export default function MobileBottomNav({ activeTab, setActiveTab, activeReservationsCount = 0 }) {
  const tabs = [
    { id: 'catalogo', label: 'Catálogo', icon: 'auto_stories' },
    {
      id: 'reservas',
      label: 'Mis Reservas',
      icon: 'confirmation_number',
      badge: activeReservationsCount > 0 ? activeReservationsCount : null,
    },
    { id: 'historial', label: 'Historial', icon: 'history' },
    { id: 'noticias', label: 'Noticias', icon: 'campaign' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-parchment-surface/95 backdrop-blur-xl border-t border-marble-border shadow-[0_-2px_12px_rgba(31,28,24,0.08)] pb-safe">
      <div className="h-16 px-4 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-all ${
                isActive ? 'text-gold-burnished font-bold scale-105' : 'text-warm-charcoal hover:text-sepia-ink'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">{tab.icon}</span>
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-terracotta text-white font-bold text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
