import React, { useState, useEffect } from 'react';
import { Bike, Heart, Award, RotateCcw, Plus, Trophy, Sparkles, UserCheck, Gauge, Timer, Flag } from 'lucide-react';

const GOAL_METERS = 1000;

interface RecordItem {
  id: number;
  name: string;
  meters: number;
  speedKmh: string;
  percentage: number;
  completed: boolean;
  time: string;
}

function PurpleRibbon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 80" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 74L32 46L48 74"
        stroke="url(#ribbonGrad)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 46C20 34 14 25 14 17C14 9.5 21 5 32 5C43 5 50 9.5 50 17C50 25 44 34 32 46Z"
        stroke="url(#ribbonGrad)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="ribbonGrad" x1="14" y1="5" x2="50" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function App() {
  const [participantName, setParticipantName] = useState('');
  const [metersInput, setMetersInput] = useState('');
  const [currentMeters, setCurrentMeters] = useState(0);
  const [activeParticipant, setActiveParticipant] = useState('');
  const [history, setHistory] = useState<RecordItem[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const percentage = Math.min(100, Math.max(0, (currentMeters / GOAL_METERS) * 100));
  const isGoalReached = currentMeters >= GOAL_METERS;

  // Cálculo de velocidad media en 1 minuto: (metros / 1000) * 60 = km/h
  const currentSpeedKmh = ((currentMeters / 1000) * 60).toFixed(1);

  useEffect(() => {
    if (isGoalReached && currentMeters > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 5500);
      return () => clearTimeout(timer);
    } else {
      setShowCelebration(false);
    }
  }, [isGoalReached, currentMeters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMeters = parseFloat(metersInput);
    if (isNaN(parsedMeters) || parsedMeters < 0) return;

    const nameToUse = participantName.trim() || `Ciclista #${history.length + 1}`;
    const speed = ((parsedMeters / 1000) * 60).toFixed(1);

    setCurrentMeters(parsedMeters);
    setActiveParticipant(nameToUse);

    const newRecord: RecordItem = {
      id: Date.now(),
      name: nameToUse,
      meters: parsedMeters,
      speedKmh: speed,
      percentage: Math.min(100, Math.round((parsedMeters / GOAL_METERS) * 100)),
      completed: parsedMeters >= GOAL_METERS,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHistory([newRecord, ...history]);
    setMetersInput('');
    setParticipantName('');
  };

  const handleQuickAdd = (amount: number) => {
    const nextMeters = Math.min(1500, currentMeters + amount);
    setCurrentMeters(nextMeters);
    if (!activeParticipant) setActiveParticipant('Test en rodillo');
  };

  const handleReset = () => {
    setCurrentMeters(0);
    setActiveParticipant('');
    setMetersInput('');
    setShowCelebration(false);
  };

  const totalEventMeters = history.reduce((acc, item) => acc + item.meters, 0);
  const totalEventKm = (totalEventMeters / 1000).toFixed(2);
  const fillY = 92 - (percentage / 100) * 82;

  return (
    <div className="min-h-screen bg-[#0f0a1f] text-white font-sans selection:bg-violet-500 selection:text-white overflow-x-hidden relative">
      
      {/* Fondo técnico tipo malla ciclista / carretera */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 0%, #3b0764 0%, transparent 65%), linear-gradient(to right, rgba(139, 92, 246, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.08) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 40px 40px, 40px 40px'
        }}
      />

      {/* Confeti deportivo violeta, blanco y verde meta */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce rounded-sm opacity-90"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 12 + 6}px`,
                height: `${Math.random() * 8 + 4}px`,
                backgroundColor: ['#a78bfa', '#7c3aed', '#34d399', '#ffffff', '#fbbf24'][i % 5],
                animationDuration: `${Math.random() * 1.4 + 0.7}s`,
                animationDelay: `${Math.random() * 0.4}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Cabecera Institucional y Deportiva 25N */}
      <header className="relative z-10 border-b border-violet-400/20 bg-[#160f2e]/90 backdrop-blur-xl shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Dorsal / Placa 25N */}
            <div className="flex items-center gap-2.5 bg-violet-950 border-2 border-violet-400/50 px-3.5 py-2 rounded-xl shadow-md">
              <PurpleRibbon className="w-6 h-7" />
              <div className="leading-none">
                <span className="text-[9px] uppercase tracking-widest text-violet-300 block font-bold">DORSAL</span>
                <span className="text-2xl font-black tracking-tighter text-white">25N</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-violet-300 block mb-0.5">
                Día Internacional de la Eliminación de la Violencia contra la Mujer
              </span>
              <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Fuerza en las piernas, pasión en el corazón</span>
                <Heart className="w-5 h-5 text-violet-400 fill-violet-400 inline shrink-0" />
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Bike className="w-5 h-5" /> Pedaleando por la igualdad
                </span>
              </h1>
            </div>
          </div>

          {/* Telemetría Acumulada del Pelotón */}
          <div className="flex items-center gap-4 bg-violet-950/90 px-4 py-2.5 rounded-xl border border-violet-400/30 shadow-lg">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-violet-300 block font-bold">
                Distancia Pelotón
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black font-mono text-white">
                  {totalEventMeters.toLocaleString()} <span className="text-xs font-sans font-semibold text-violet-300">m</span>
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  ({totalEventKm} km)
                </span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-violet-500/20 border border-violet-400/30">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Columna Izquierda: Consola de Control / Ciclocomputador */}
        <section className="lg:col-span-5 bg-[#181132]/90 backdrop-blur-xl border border-violet-400/25 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-violet-400/15">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-600/30 border border-violet-400/40">
                <Bike className="w-6 h-6 text-violet-300" />
              </div>
              <div>
                <h2 className="text-base font-extrabold uppercase tracking-wide text-white">
                  Control de Etapa · 1 Min
                </h2>
                <p className="text-xs text-violet-300 flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" /> Lectura sensor Bluetooth bici estática
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-violet-200 mb-1.5">
                Nombre o Número de Dorsal
              </label>
              <input
                type="text"
                placeholder="Ej. Laura G. · Dorsal 14"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0718] border border-violet-400/25 text-white placeholder-violet-400/40 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-violet-200 mb-1.5">
                Metros completados en 60 segundos
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="5000"
                  step="1"
                  required
                  placeholder="0 - 1000"
                  value={metersInput}
                  onChange={(e) => setMetersInput(e.target.value)}
                  className="w-full px-4 py-4 pr-24 rounded-xl bg-[#0b0718] border border-violet-400/35 text-3xl font-black font-mono text-white placeholder-violet-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold uppercase tracking-wider text-violet-200 bg-violet-900/80 border border-violet-500/30 px-2.5 py-1.5 rounded-lg">
                  metros
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-base uppercase tracking-wider shadow-lg shadow-violet-900/50 active:scale-[0.98] transition flex items-center justify-center gap-2.5 cursor-pointer border border-violet-300/25"
            >
              <Bike className="w-5 h-5" />
              Registrar Sprint
            </button>
          </form>

          {/* Controles rápidos de rodillo */}
          <div className="mt-6 pt-5 border-t border-violet-400/15">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-violet-300">Simulación de distancia:</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs flex items-center gap-1 text-violet-300 hover:text-white transition cursor-pointer font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Poner a cero
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[250, 500, 1000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAdd(val)}
                  className="py-2.5 px-3 rounded-xl bg-[#0b0718] hover:bg-violet-900/50 border border-violet-400/20 text-xs font-mono font-bold text-violet-100 flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" /> {val}m
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Columna Central: Panel Ciclista y Corazón de Energía */}
        <section className="lg:col-span-7 flex flex-col items-center justify-between bg-[#181132]/85 backdrop-blur-xl border border-violet-400/25 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          
          {/* Barra superior de telemetría del participante */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-violet-400/15">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-200 bg-violet-950 border border-violet-400/30 px-3 py-1.5 rounded-lg">
                <PurpleRibbon className="w-3.5 h-4" />
                Meta: 1.000 m
              </span>

              {activeParticipant && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 text-xs sm:text-sm font-bold">
                  <UserCheck className="w-4 h-4" />
                  <span>{activeParticipant}</span>
                </div>
              )}
            </div>

            {/* Velocímetro calculado */}
            <div className="flex items-center gap-2 bg-[#0b0718] px-3.5 py-1.5 rounded-lg border border-violet-400/20">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-violet-300 font-semibold">Ritmo:</span>
              <span className="text-sm font-black font-mono text-white">{currentSpeedKmh} km/h</span>
            </div>
          </div>

          {/* Zona Central: Rueda de Bicicleta + Corazón + Regla de Cotas */}
          <div className="relative w-full flex items-center justify-center my-6">
            
            {/* Rueda de bicicleta giratoria decorativa detrás del corazón */}
            <svg
              viewBox="0 0 200 200"
              className="w-72 h-72 sm:w-80 sm:h-80 absolute opacity-20 pointer-events-none animate-spin"
              style={{ animationDuration: isGoalReached ? '4s' : '18s' }}
            >
              {/* Neumático y llanta */}
              <circle cx="100" cy="100" r="92" fill="none" stroke="#a78bfa" strokeWidth="5" strokeDasharray="12 6" />
              <circle cx="100" cy="100" r="84" fill="none" stroke="#c4b5fd" strokeWidth="2" />
              <circle cx="100" cy="100" r="14" fill="none" stroke="#a78bfa" strokeWidth="4" />
              {/* Radios */}
              {[...Array(12)].map((_, idx) => {
                const angle = (idx * 30 * Math.PI) / 180;
                return (
                  <line
                    key={idx}
                    x1={100 + 14 * Math.cos(angle)}
                    y1={100 + 14 * Math.sin(angle)}
                    x2={100 + 84 * Math.cos(angle)}
                    y2={100 + 84 * Math.sin(angle)}
                    stroke="#ddd6fe"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>

            {/* Corazón SVG con relleno violeta */}
            <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center z-10">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_12px_28px_rgba(124,58,237,0.55)] overflow-visible">
                <defs>
                  <clipPath id="heartClip">
                    <path d="M50 88.9C48.5 88.9 10 64.2 10 34.5C10 20.4 21.2 10 34.2 10C41.8 10 47.4 13.7 50 18.2C52.6 13.7 58.2 10 65.8 10C78.8 10 90 20.4 90 34.5C90 64.2 51.5 88.9 50 88.9Z" />
                  </clipPath>

                  <linearGradient id="violetEnergyGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#4c1d95" />
                    <stop offset="55%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>

                {/* Base oscura del corazón */}
                <path
                  d="M50 88.9C48.5 88.9 10 64.2 10 34.5C10 20.4 21.2 10 34.2 10C41.8 10 47.4 13.7 50 18.2C52.6 13.7 58.2 10 65.8 10C78.8 10 90 20.4 90 34.5C90 64.2 51.5 88.9 50 88.9Z"
                  fill="#0b0718"
                  stroke="rgba(167, 139, 250, 0.45)"
                  strokeWidth="2.5"
                />

                {/* Nivel de relleno */}
                <g clipPath="url(#heartClip)">
                  <rect
                    x="0"
                    y={fillY}
                    width="100"
                    height="100"
                    fill="url(#violetEnergyGradient)"
                    style={{ transition: 'y 0.9s cubic-bezier(0.22, 1, 0.36, 1)' }}
                  />
                  {percentage > 0 && percentage < 100 && (
                    <rect
                      x="0"
                      y={fillY}
                      width="100"
                      height="2"
                      fill="#34d399"
                      style={{ transition: 'y 0.9s cubic-bezier(0.22, 1, 0.36, 1)' }}
                    />
                  )}
                </g>

                {/* Contorno exterior */}
                <path
                  d="M50 88.9C48.5 88.9 10 64.2 10 34.5C10 20.4 21.2 10 34.2 10C41.8 10 47.4 13.7 50 18.2C52.6 13.7 58.2 10 65.8 10C78.8 10 90 20.4 90 34.5C90 64.2 51.5 88.9 50 88.9Z"
                  fill="none"
                  stroke={isGoalReached ? '#34d399' : 'rgba(196, 181, 253, 0.65)'}
                  strokeWidth={isGoalReached ? '3.2' : '2'}
                />
              </svg>

              {/* Lectura digital central */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                  {Math.round(percentage)}%
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-violet-200 bg-black/50 px-2.5 py-0.5 rounded-md mt-1 border border-white/10">
                  {currentMeters.toLocaleString()} / {GOAL_METERS} m
                </span>
              </div>
            </div>

            {/* Escala vertical de cotas ciclistas a la derecha */}
            <div className="hidden sm:flex flex-col justify-between h-52 ml-4 text-[11px] font-mono text-violet-300 border-l-2 border-violet-500/30 pl-2.5 py-1">
              <span className="text-emerald-400 font-bold">1000m · META</span>
              <span>750m</span>
              <span>500m</span>
              <span>250m</span>
              <span>0m · SALIDA</span>
            </div>
          </div>

          {/* Perfil de Etapa: Bicicleta avanzando hacia la meta */}
          <div className="w-full bg-[#0b0718] border border-violet-400/20 rounded-xl p-3.5 mb-3">
            <div className="flex justify-between text-[11px] font-mono font-bold text-violet-300 mb-2">
              <span>SALIDA (0m)</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5" /> META (1.000m)
              </span>
            </div>
            <div className="relative h-3 bg-violet-950 rounded-full overflow-visible border border-violet-500/25">
              {/* Carretera completada */}
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
              {/* Icono de la bici avanzando */}
              <div
                className="absolute -top-3.5 -translate-x-1/2 bg-violet-600 text-white p-1.5 rounded-full border-2 border-white shadow-md transition-all duration-700"
                style={{ left: `${percentage}%` }}
              >
                <Bike className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Mensaje de estado */}
          <div className="text-center">
            {isGoalReached ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-bold text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>¡Meta superada! Fuerza en las piernas, pasión en el corazón</span>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-violet-200">
                {currentMeters === 0
                  ? 'Listo en línea de salida. Introduce los metros recorridos para iniciar.'
                  : `Faltan ${Math.max(0, GOAL_METERS - currentMeters)} metros para cruzar la meta del 25N.`}
              </p>
            )}
          </div>
        </section>

        {/* Tabla de Tiempos / Clasificación de Participantes */}
        {history.length > 0 && (
          <section className="lg:col-span-12 bg-[#181132]/85 backdrop-blur-xl border border-violet-400/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider flex items-center gap-2 text-white">
                <Award className="w-5 h-5 text-violet-400" />
                Registro del Pelotón ({history.length} participantes)
              </h3>
              <span className="text-xs text-violet-300 hidden sm:inline">
                Pulsa sobre un ciclista para ver su marca en el marcador
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentMeters(item.meters);
                    setActiveParticipant(item.name);
                  }}
                  className="p-3.5 rounded-xl bg-[#0b0718] hover:bg-violet-950/70 border border-violet-400/20 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-sm text-white group-hover:text-violet-300 transition truncate flex items-center gap-1.5">
                      <Bike className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      {item.name}
                    </p>
                    <p className="text-xs font-mono text-violet-300 mt-0.5">
                      {item.meters}m · {item.speedKmh} km/h
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black shrink-0 ${
                      item.completed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-violet-500/20 text-violet-200 border border-violet-400/25'
                    }`}
                  >
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}