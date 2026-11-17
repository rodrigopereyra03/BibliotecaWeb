import React from 'react';

/**
 * Reusable user avatar with clean, dignified silhouette fallback.
 * Eliminates random external/fake person photos.
 */
export default function UserAvatar({
  user,
  name,
  size = 'md',
  className = '',
  showRoleBadge = false,
}) {
  const displayName = user?.name || name || 'Lector';
  const avatarUrl = user?.avatar_url;
  const isFakeStock = avatarUrl && (
    avatarUrl.includes('unsplash.com') ||
    avatarUrl.includes('randomuser.me') ||
    avatarUrl.includes('thispersondoesnotexist')
  );

  const sizeMap = {
    xs: {
      box: 'w-6 h-6',
      icon: 'text-sm',
      svg: 'w-3.5 h-3.5',
    },
    sm: {
      box: 'w-7 h-7',
      icon: 'text-base',
      svg: 'w-4 h-4',
    },
    md: {
      box: 'w-9 h-9',
      icon: 'text-xl',
      svg: 'w-5 h-5',
    },
    lg: {
      box: 'w-12 h-12',
      icon: 'text-2xl',
      svg: 'w-7 h-7',
    },
    xl: {
      box: 'w-20 h-20',
      icon: 'text-4xl',
      svg: 'w-11 h-11',
    },
    '2xl': {
      box: 'w-24 h-24',
      icon: 'text-5xl',
      svg: 'w-14 h-14',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  if (avatarUrl && !isFakeStock) {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <img
          src={avatarUrl}
          alt={displayName}
          className={`${currentSize.box} rounded-full object-cover ring-2 ring-gold-burnished/40 shadow-xs`}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Silhouette representation (crisp vector)
  return (
    <div
      className={`relative shrink-0 select-none ${className}`}
      title={displayName}
    >
      <div
        className={`${currentSize.box} rounded-full bg-gradient-to-b from-[#FAF7F2] to-[#F0EAE1] border border-gold-burnished/50 flex items-center justify-center text-gold-burnished shadow-xs overflow-hidden`}
      >
        <svg
          className={`${currentSize.svg} fill-current text-gold-burnished/80`}
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
      {showRoleBadge && user?.role === 'admin' && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gold-burnished text-white flex items-center justify-center text-[9px] shadow-xs"
          title="Administrador"
        >
          ★
        </span>
      )}
    </div>
  );
}
