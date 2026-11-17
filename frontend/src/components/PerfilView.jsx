import React, { useState, useEffect } from 'react';
import UserAvatar from './UserAvatar';
import { api } from '../api';

export default function PerfilView({
  user,
  onUpdateUser,
  onGoToCatalog,
  loansCount = 0,
  activeReservationsCount = 0,
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="py-16 px-4 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-gold-light/40 border border-gold-burnished/40 flex items-center justify-center text-gold-burnished mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl">account_circle</span>
        </div>
        <h2 className="text-2xl font-bold font-display text-sepia-heading mb-2">
          Sesión no iniciada
        </h2>
        <p className="text-sm text-warm-charcoal mb-6">
          Inicie sesión o regístrese como nuevo lector de la Capilla Ntra. Sra. de Lourdes para acceder a su perfil y credencial.
        </p>
        <button
          onClick={onGoToCatalog}
          className="px-5 py-2.5 rounded-xl bg-gold-burnished text-white font-semibold hover:bg-gold-burnished/90 transition-colors shadow-xs"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const userId = user.id || user.user_id;
  const memberCode = user.member_number || (userId ? `GT-${4000 + Number(userId)}` : 'GT-4001');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('El nombre y apellido no pueden estar vacíos.');
      return;
    }

    if (showPasswordFields && formData.newPassword) {
      if (formData.newPassword.length < 4) {
        setErrorMessage('La contraseña debe tener al menos 4 caracteres.');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden.');
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        user_id: Number(userId),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      };
      if (showPasswordFields && formData.newPassword.trim()) {
        payload.password = formData.newPassword.trim();
      }

      const updated = await api.updateProfile(payload);
      if (onUpdateUser) {
        onUpdateUser(updated);
      }
      setSuccessMessage('¡Datos de perfil actualizados exitosamente!');
      if (showPasswordFields) {
        setFormData((prev) => ({ ...prev, newPassword: '', confirmPassword: '' }));
        setShowPasswordFields(false);
      }
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      setErrorMessage(err.message || 'Error al actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-marble-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-gold-burnished font-semibold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-sm">badge</span>
            <span>Portal de Lectores · Capilla Ntra. Sra. de Lourdes</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-sepia-heading">
            Mi Perfil y Credencial de Lector
          </h1>
          <p className="text-sm text-warm-charcoal mt-1">
            Gestione sus datos de contacto en Temperley, consulte su carnet digital y revise su estado en la biblioteca.
          </p>
        </div>

        <button
          onClick={onGoToCatalog}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-parchment-surface border border-marble-border text-xs font-semibold text-warm-charcoal hover:text-sepia-heading hover:bg-parchment-card transition-colors shrink-0 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Volver al Catálogo</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 shadow-xs">
          <span className="material-symbols-outlined text-emerald-600 text-xl">check_circle</span>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3 shadow-xs">
          <span className="material-symbols-outlined text-red-600 text-xl">error</span>
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Form (Left 7) + Credential & Summary (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-marble-border shadow-xs p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-marble-border/70">
            <UserAvatar user={user} size="xl" showRoleBadge />
            <div>
              <h2 className="text-xl font-bold font-display text-sepia-heading">
                {user.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded font-mono text-xs bg-gold-light text-gold-burnished font-bold border border-gold-burnished/30">
                  Credencial #{memberCode}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  Socio Activo
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-sepia-heading uppercase tracking-wider mb-1.5">
                Nombre y Apellido <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-parchment-base/40 rounded-xl border border-marble-border text-sm text-sepia-ink focus:outline-none focus:ring-2 focus:ring-gold-burnished/50 focus:bg-white transition-all font-medium"
                  placeholder="Ej: Marcos Gómez"
                />
              </div>
            </div>

            {/* Email (Read only) */}
            <div>
              <label className="block text-xs font-bold text-sepia-heading uppercase tracking-wider mb-1.5">
                Correo Electrónico (Identificador de Socio)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                  mail
                </span>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-10 pr-4 py-2.5 bg-parchment-card/70 rounded-xl border border-marble-border text-sm text-warm-charcoal/80 cursor-not-allowed font-medium select-none"
                />
              </div>
              <p className="text-[11px] text-warm-charcoal mt-1">
                El correo está vinculado a su cuenta y notificaciones de préstamos en la biblioteca.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-sepia-heading uppercase tracking-wider mb-1.5">
                Teléfono / WhatsApp de Contacto
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                  call
                </span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-parchment-base/40 rounded-xl border border-marble-border text-sm text-sepia-ink focus:outline-none focus:ring-2 focus:ring-gold-burnished/50 focus:bg-white transition-all font-medium"
                  placeholder="Ej: +54 11 5555-4444"
                />
              </div>
            </div>

            {/* Address in Temperley */}
            <div>
              <label className="block text-xs font-bold text-sepia-heading uppercase tracking-wider mb-1.5">
                Domicilio de Residencia (Temperley / Lomas de Zamora)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                  home_pin
                </span>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-parchment-base/40 rounded-xl border border-marble-border text-sm text-sepia-ink focus:outline-none focus:ring-2 focus:ring-gold-burnished/50 focus:bg-white transition-all font-medium"
                  placeholder="Ej: Freud 201, Temperley"
                />
              </div>
              <p className="text-[11px] text-warm-charcoal mt-1">
                Requerido para la custodia comunitaria de los ejemplares en préstamo.
              </p>
            </div>

            {/* Optional Password Change */}
            <div className="pt-2">
              {!showPasswordFields ? (
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-burnished hover:text-gold-burnished/80 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">lock_reset</span>
                  <span>¿Desea cambiar su contraseña?</span>
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-parchment-base/60 border border-marble-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sepia-heading">Cambio de Contraseña</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordFields(false);
                        setFormData((prev) => ({ ...prev, newPassword: '', confirmPassword: '' }));
                      }}
                      className="text-[11px] text-warm-charcoal hover:text-red-700"
                    >
                      Cancelar
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-warm-charcoal mb-1">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="Mínimo 4 caracteres"
                      className="w-full px-3 py-2 bg-white rounded-lg border border-marble-border text-xs focus:outline-none focus:ring-1 focus:ring-gold-burnished"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-warm-charcoal mb-1">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Repita la nueva contraseña"
                      className="w-full px-3 py-2 bg-white rounded-lg border border-marble-border text-xs focus:outline-none focus:ring-1 focus:ring-gold-burnished"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-marble-border/70 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-burnished text-white font-semibold text-sm hover:bg-gold-burnished/90 active:scale-98 transition-all shadow-sm cursor-pointer disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">save</span>
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Digital Reader Credential & Status Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Liturgical Reader Pass Mockup */}
          <div className="rounded-2xl bg-gradient-to-br from-parchment-card via-white to-parchment-surface border-2 border-gold-burnished/40 p-6 shadow-md relative overflow-hidden">
            {/* Top decorative badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-light text-gold-burnished flex items-center justify-center font-bold shadow-xs">
                  <span className="material-symbols-outlined text-2xl">church</span>
                </div>
                <div>
                  <h3 className="font-bold font-display text-sm text-sepia-heading leading-tight">
                    Capilla Ntra. Sra. de Lourdes
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider text-gold-burnished font-bold block">
                    Carnet de Socio y Lector
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-gold-burnished text-2xl" title="Credencial Verificada">
                verified
              </span>
            </div>

            {/* Pass Content: Silhouette + Details */}
            <div className="bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-marble-border/90 flex gap-4 items-center my-3">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-16 h-20 rounded-lg bg-gradient-to-b from-[#FAF7F2] to-[#F0EAE1] border border-gold-burnished/50 flex items-center justify-center text-gold-burnished shadow-xs">
                  <svg className="w-9 h-9 fill-current text-gold-burnished/80" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <span className="font-mono text-[9px] text-warm-charcoal mt-1 font-bold">
                  {memberCode}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-warm-charcoal font-semibold block">
                  Socio Titular
                </span>
                <h4 className="font-bold font-display text-base text-sepia-heading truncate">
                  {user.name}
                </h4>

                <div className="mt-2 pt-2 border-t border-marble-border/60 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-outline block">Sede</span>
                    <span className="font-semibold text-sepia-heading truncate block">Temperley</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-outline block">Vigencia</span>
                    <span className="font-semibold text-emerald-700">2026 · Al Día</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parish Info Footer */}
            <div className="pt-2 text-[10px] text-warm-charcoal flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-gold-burnished">pin_drop</span>
                <span>Sigmund Freud 201 · Temperley</span>
              </span>
              <span className="font-mono text-[9px] text-outline font-semibold">
                CRM-LOURDES-{userId}
              </span>
            </div>
          </div>

          {/* Activity & Rules Card */}
          <div className="bg-white rounded-2xl border border-marble-border shadow-xs p-6 space-y-4">
            <h4 className="font-bold font-display text-sm text-sepia-heading flex items-center gap-2">
              <span className="material-symbols-outlined text-gold-burnished text-lg">auto_stories</span>
              <span>Estado de Préstamos y Custodia</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-parchment-base/60 border border-marble-border/70 text-center">
                <span className="text-2xl font-bold font-display text-sepia-heading block">
                  {activeReservationsCount}
                </span>
                <span className="text-[11px] text-warm-charcoal font-medium">Reservas Activas</span>
              </div>
              <div className="p-3 rounded-xl bg-parchment-base/60 border border-marble-border/70 text-center">
                <span className="text-2xl font-bold font-display text-sepia-heading block">
                  {loansCount}
                </span>
                <span className="text-[11px] text-warm-charcoal font-medium">Historial / En Curso</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="material-symbols-outlined text-base text-emerald-700">verified_user</span>
                <span>Reglamento Comunitario</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Cada socio lector puede retirar hasta 2 libros en simultáneo por 21 días corridos para su lectura domiciliaria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
