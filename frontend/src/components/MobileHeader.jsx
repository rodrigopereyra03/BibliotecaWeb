import React from 'react';
import UserAvatar from './UserAvatar';

export default function MobileHeader({ user, onGoToLogin, onOpenHours, onGoToBackoffice, onGoToProfile }) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-parchment-base/95 backdrop-blur-xl border-b border-marble-border shadow-xs pt-safe">
      <div className="h-16 px-4 flex items-center justify-between gap-3">
        {/* Left: Parish Brand & Badge */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-full bg-gold-light border border-gold-burnished/30 flex items-center justify-center shrink-0 text-gold-burnished shadow-xs">
            <span className="material-symbols-outlined text-xl">local_library</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-bold font-display text-sepia-heading truncate leading-tight">
              Bibl. San Tito Brandsma
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-warm-charcoal truncate font-semibold">
              Capilla Ntra. Sra. de Lourdes · Temperley
            </p>
          </div>
        </div>

        {/* Right: Hours Info + Backoffice + Profile Button */}
        <div className="flex items-center gap-2 shrink-0">
          {user && user.role === 'admin' && onGoToBackoffice && (
            <button
              type="button"
              onClick={onGoToBackoffice}
              className="w-8 h-8 rounded-full bg-gold-light border border-gold-burnished/40 flex items-center justify-center text-gold-burnished hover:bg-gold-burnished hover:text-white transition-colors"
              title="Modo Backoffice"
            >
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenHours}
            className="w-8 h-8 rounded-full bg-parchment-surface border border-marble-border flex items-center justify-center text-warm-charcoal hover:text-sepia-ink transition-colors"
            title="Horarios de la Biblioteca"
          >
            <span className="material-symbols-outlined text-lg">church</span>
          </button>

          <button
            type="button"
            onClick={user ? onGoToProfile : onGoToLogin}
            className="flex items-center justify-center p-0.5 rounded-full ring-2 ring-gold-burnished/40 active:scale-95 transition-transform"
            title={user ? 'Mi Perfil y Credencial' : 'Iniciar Sesión'}
          >
            <UserAvatar user={user} size="sm" showRoleBadge />
          </button>
        </div>
      </div>
    </header>
  );
}
