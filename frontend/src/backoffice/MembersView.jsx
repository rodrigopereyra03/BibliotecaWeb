import React, { useState } from 'react';

export default function MembersView({
  users = [],
  loans = [],
  reservations = [],
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(users[0] || null);

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const nameMatches = u.name && u.name.toLowerCase().includes(q);
    const emailMatches = u.email && u.email.toLowerCase().includes(q);
    const dniMatches = u.dni && u.dni.toLowerCase().includes(q);
    return nameMatches || emailMatches || dniMatches;
  });

  const activeSelected = selectedUser || filteredUsers[0] || users[0] || {
    id: 1,
    name: 'David Miller',
    email: 'david.miller@lourdes.org',
    dni: '32.184.920',
    phone: '+54 11 4455-6677',
    address: 'Sigmund Freud 201, Temperley',
    membership_number: '#GT-4821',
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Header */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 mb-6 border-b border-marble-border">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-gold-burnished font-bold">
              Registro de Socios y Lectores • Directorio Central
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-burnished"></span>
            <span className="text-xs text-warm-charcoal">Comunidad de Lectores</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-sepia-heading tracking-tight">
            Directorio de Miembros y Usuarios
          </h2>
          <p className="text-xs sm:text-sm text-warm-charcoal mt-0.5">
            Expedientes de socios, credenciales de lector, historial de retiros y estado de préstamos.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => alert('Exportando directorio de socios en formato CSV...')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white border border-marble-border hover:bg-gold-light/40 text-sepia-heading font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-gold-burnished">file_download</span>
            <span>Exportar Directorio (CSV)</span>
          </button>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              Total Miembros
            </span>
            <h4 className="text-2xl font-bold font-display text-sepia-heading mt-1">
              {Math.max(users.length, 215)}
            </h4>
            <span className="text-[11px] text-gold-burnished font-semibold">Socios Activos</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-light text-gold-burnished flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">groups</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              Perfiles Verificados
            </span>
            <h4 className="text-2xl font-bold font-display text-emerald-800 mt-1">
              184
            </h4>
            <span className="text-[11px] text-emerald-700 font-semibold">85% Al Día / En Regla</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">check_circle</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              Nuevos Registrados
            </span>
            <h4 className="text-2xl font-bold font-display text-gold-burnished mt-1">
              24
            </h4>
            <span className="text-[11px] text-warm-charcoal">+8 este mes</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-light text-gold-burnished flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">how_to_reg</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-marble-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider">
              Grupos Parroquiales
            </span>
            <h4 className="text-2xl font-bold font-display text-marian-blue mt-1">
              7
            </h4>
            <span className="text-[11px] text-marian-blue font-semibold">Comunidades de Lectura</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-marian-blue flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">domain</span>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-white p-4 rounded-2xl border border-marble-border shadow-xs mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre, correo, DNI o número de socio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-parchment-base rounded-lg border border-marble-border text-xs focus:outline-none focus:ring-1 focus:ring-gold-burnished"
          />
        </div>
        <span className="text-xs text-warm-charcoal">
          Mostrando {filteredUsers.length} de {users.length} miembros registrados
        </span>
      </section>

      {/* Directory Grid: Members List (Left 7 cols) + Dossier CRM (Right 5 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Members List */}
        <div className="xl:col-span-7 flex flex-col gap-3">
          {filteredUsers.map((member) => {
            const isSelected = activeSelected && activeSelected.id === member.id;
            const initials = member.name
              ? member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : 'FL';

            return (
              <div
                key={member.id}
                onClick={() => setSelectedUser(member)}
                className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer relative overflow-hidden group shadow-xs ${
                  isSelected
                    ? 'border-gold-burnished ring-1 ring-gold-burnished/30 bg-gold-light/10'
                    : 'border-marble-border hover:border-gold-burnished/40 hover:bg-gold-light/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gold-burnished text-white flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-xs">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold font-display text-sm text-sepia-heading group-hover:text-gold-burnished transition-colors">
                          {member.name}
                        </h4>
                        <span className="px-1.5 py-0.5 rounded font-mono text-[9px] bg-gold-light text-gold-burnished font-bold">
                          #GT-{member.id ? (4000 + member.id) : '4821'}
                        </span>
                        {member.dni && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-parchment-base text-warm-charcoal">
                            DNI {member.dni}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-warm-charcoal mt-1">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-outline">mail</span>
                          <span>{member.email}</span>
                        </span>
                        {member.phone && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs text-outline">call</span>
                            <span>{member.phone}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 shrink-0">
                    Al Día
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-marble-border flex items-center justify-between text-xs text-warm-charcoal">
                  <span>Capilla Ntra. Sra. de Lourdes · Temperley</span>
                  <button
                    type="button"
                    className="text-[11px] font-bold text-gold-burnished hover:text-gold-accent flex items-center gap-1"
                  >
                    <span>Ver Expediente</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Dossier / Credencial CRM Card */}
        {activeSelected && (
          <div className="xl:col-span-5 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-5 border border-marble-border shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-marble-border mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gold-burnished text-lg">badge</span>
                  <h4 className="font-bold font-display text-sm text-sepia-heading">
                    Expediente & Pase de Lector
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  ACTIVO
                </span>
              </div>

              {/* Liturgical Credential Mockup Card */}
              <div className="rounded-xl bg-gradient-to-br from-parchment-card via-white to-parchment-surface p-4 border border-marble-border shadow-xs relative overflow-hidden mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gold-light text-gold-burnished flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-base">church</span>
                    </div>
                    <div>
                      <h5 className="font-bold font-display text-xs text-sepia-heading">
                        Capilla Ntra. Sra. de Lourdes
                      </h5>
                      <span className="text-[9px] uppercase tracking-wider text-gold-burnished font-bold block">
                        Carnet de Socio y Lector
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gold-burnished/40 text-2xl">
                    verified
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-3 items-center my-2">
                  <div className="col-span-4 flex flex-col items-center">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-parchment-base border border-marble-border flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-gold-burnished">
                        person
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-warm-charcoal mt-1 font-bold">
                      VIGENCIA: 2026
                    </span>
                  </div>

                  <div className="col-span-8 flex flex-col justify-center">
                    <span className="text-[9px] uppercase tracking-wider text-warm-charcoal">
                      Socio Titular
                    </span>
                    <h4 className="font-bold font-display text-sm text-sepia-heading">
                      {activeSelected.name}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[10px]">
                      <div className="bg-white p-1 rounded border border-marble-border">
                        <span className="block text-[8px] text-warm-charcoal font-sans">FOLIO</span>
                        <strong className="text-sepia-heading">
                          #GT-{activeSelected.id ? (4000 + activeSelected.id) : '4821'}
                        </strong>
                      </div>
                      <div className="bg-white p-1 rounded border border-marble-border">
                        <span className="block text-[8px] text-warm-charcoal font-sans">DNI</span>
                        <strong className="text-sepia-heading">{activeSelected.dni || '32.184.920'}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-marble-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-gold-burnished text-lg">qr_code_2</span>
                    <span className="font-mono text-[9px] text-warm-charcoal">
                      CRM-LOURDES-{activeSelected.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Imprimiendo credencial física para ${activeSelected.name}...`)}
                    className="px-2.5 py-1 rounded bg-gold-burnished hover:bg-gold-accent text-white font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">print</span>
                    <span>Imprimir Credencial</span>
                  </button>
                </div>
              </div>

              {/* Patron Preferences and Contact */}
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-parchment-base rounded-xl border border-marble-border">
                  <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider block mb-1">
                    Contacto y Residencia
                  </span>
                  <p className="text-sepia-heading font-medium">{activeSelected.email}</p>
                  <p className="text-warm-charcoal">{activeSelected.phone || '+54 11 4455-6677'}</p>
                  <p className="text-warm-charcoal mt-0.5">{activeSelected.address || 'Sigmund Freud 201, Temperley'}</p>
                </div>

                <div className="p-3 bg-parchment-base rounded-xl border border-marble-border">
                  <span className="text-[10px] uppercase font-bold text-warm-charcoal tracking-wider block mb-1">
                    Estado de Custodia
                  </span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-warm-charcoal">Préstamos en regla:</span>
                    <strong className="text-emerald-700">Sin sanciones</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-warm-charcoal">Límite simultáneo:</span>
                    <strong className="text-sepia-heading">2 ejemplares</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Enviando notificación por correo a ${activeSelected.email}...`)}
                  className="w-full py-2 rounded-lg bg-gold-light hover:bg-gold-burnished hover:text-white text-gold-burnished font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">outgoing_mail</span>
                  <span>Enviar Recordatorio / Aviso</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
