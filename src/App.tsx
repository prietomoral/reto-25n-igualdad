import React, { useState, useEffect } from 'react';
import { Bike, Heart, Award, RotateCcw, Plus, Trophy, Sparkles, UserCheck, Gauge, Timer, Flag, School } from 'lucide-react';

const GOAL_METERS = 1000;
const DURATION_MINUTES = 2;

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

  // Estados para la barra acumulativa de Meta Final 25N
  const [cumulativeMeters, setCumulativeMeters] = useState(0);
  const [cumulativeGoal, setCumulativeGoal] = useState(5000);
  const [showGrandPrizeCelebration, setShowGrandPrizeCelebration] = useState(false);

  const percentage = Math.min(100, Math.max(0, (currentMeters / GOAL_METERS) * 100));
  const isGoalReached = currentMeters >= GOAL_METERS;

  const cumulativePercentage = Math.min(100, Math.max(0, (cumulativeMeters / cumulativeGoal) * 100));
  const isGrandPrizeReached = cumulativeMeters >= cumulativeGoal && cumulativeGoal > 0;

  // Cálculo de velocidad media en 2 minutos: (metros / 1000) * (60 / 2) = km/h
  const currentSpeedKmh = ((currentMeters / 1000) * (60 / DURATION_MINUTES)).toFixed(1);

  useEffect(() => {
    if (isGoalReached && currentMeters > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowCelebration(false);
    }
  }, [isGoalReached, currentMeters]);

  useEffect(() => {
    if (isGrandPrizeReached) {
      setShowGrandPrizeCelebration(true);
      const timer = setTimeout(() => setShowGrandPrizeCelebration(false), 6500);
      return () => clearTimeout(timer);
    } else {
      setShowGrandPrizeCelebration(false);
    }
  }, [isGrandPrizeReached]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMeters = parseFloat(metersInput);
    if (isNaN(parsedMeters) || parsedMeters < 0) return;

    const nameToUse = participantName.trim() || `Ciclista #${history.length + 1}`;
    const speed = ((parsedMeters / 1000) * (60 / DURATION_MINUTES)).toFixed(1);

    setCurrentMeters(parsedMeters);
    setActiveParticipant(nameToUse);
    setCumulativeMeters((prev) => prev + parsedMeters);

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
    setCumulativeMeters((prev) => prev + amount);
    if (!activeParticipant) setActiveParticipant('Test en rodillo');
  };

  const handleResetIndividual = () => {
    setCurrentMeters(0);
    setActiveParticipant('');
    setMetersInput('');
    setShowCelebration(false);
  };

  const handleIncreaseCumulativeGoal = () => {
    setCumulativeGoal((prev) => prev + 1000);
  };

  const handleResetAll = () => {
    handleResetIndividual();
    setCumulativeMeters(0);
    setCumulativeGoal(5000);
    setHistory([]);
    setShowGrandPrizeCelebration(false);
  };

  const totalEventKm = (cumulativeMeters / 1000).toFixed(2);
  const fillY = 92 - (percentage / 100) * 82;

  // Etapas simbólicas del 25N en la subida hacia la meta colectiva
  const stageMilestones = [
    { ratio: 1, label: 'META 25N · LIBERTAD', isFinish: true },
    { ratio: 0.75, label: 'SORORIDAD', isFinish: false },
    { ratio: 0.5, label: 'IGUALDAD', isFinish: false },
    { ratio: 0.25, label: 'RESPETO', isFinish: false },
    { ratio: 0, label: 'SALIDA · NI UNA MENOS', isFinish: false },
  ];

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

      {/* Confeti deportivo */}
      {(showCelebration || showGrandPrizeCelebration) && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(showGrandPrizeCelebration ? 65 : 35)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce rounded-sm opacity-90"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 14 + 6}px`,
                height: `${Math.random() * 9 + 4}px`,
                backgroundColor: ['#a78bfa', '#7c3aed', '#34d399', '#fbbf24', '#ffffff'][i % 5],
                animationDuration: `${Math.random() * 1.4 + 0.7}s`,
                animationDelay: `${Math.random() * 0.4}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Barra Superior Institucional del Centro Educativo */}
      <div className="relative z-10 bg-gradient-to-r from-violet-950 via-purple-900 to-violet-950 border-b border-violet-300/20">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-extrabold tracking-wide text-white uppercase">
            <School className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>IESO Sierra la Mesta</span>
            <span className="text-violet-400">·</span>
            <span className="text-violet-200 font-bold">Santa Amalia</span>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-violet-200/90 hidden sm:inline">
            Actividad Conmemorativa · 25 de Noviembre
          </span>
        </div>
      </div>

      {/* Cabecera Institucional y Deportiva 25N */}
      <header className="relative z-10 border-b border-violet-400/20 bg-[#160f2e]/90 backdrop-blur-xl shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
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
                Distancia Pelotón · Meta 25N
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black font-mono text-white">
                  {cumulativeMeters.toLocaleString()} <span className="text-xs font-sans font-semibold text-violet-300">/ {cumulativeGoal.toLocaleString()} m</span>
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  ({totalEventKm} km)
                </span>
              </div>
            </div>
            <div className={`p-2 rounded-lg border ${isGrandPrizeReached ? 'bg-amber-400/20 border-amber-400/50 animate-pulse' : 'bg-violet-500/20 border-violet-400/30'}`}>
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Columna Izquierda (4 cols): Consola de Control */}
        <section className="lg:col-span-4 bg-[#181132]/90 backdrop-blur-xl border border-violet-400/25 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-violet-400/15">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-violet-600/30 border border-violet-400/40">
                  <Bike className="w-6 h-6 text-violet-300" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold uppercase tracking-wide text-white">
                    Control de Etapa · 2 Min
                  </h2>
                  <p className="text-xs text-violet-300 flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5" /> Lectura sensor Bluetooth
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-violet-200 mb-1.5">
                  Nombre, Curso o Número de Dorsal
                </label>
                <input
                  type="text"
                  placeholder="Ej. Laura G. (3º ESO) · Dorsal 14"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0718] border border-violet-400/25 text-white placeholder-violet-400/40 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-violet-200 mb-1.5">
                  Metros completados en 2 minutos (120 s)
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
                Registrar Etapa (2 min)
              </button>
            </form>
          </div>

          {/* Controles rápidos y gestión del reto */}
          <div className="mt-6 pt-5 border-t border-violet-400/15 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-violet-300">Simulación rápida (+ individual y meta):</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[250, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAdd(val)}
                    className="py-2.5 px-2 rounded-xl bg-[#0b0718] hover:bg-violet-900/50 border border-violet-400/20 text-xs font-mono font-bold text-violet-100 flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" /> {val}m
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-violet-400/10 text-xs">
              <button
                type="button"
                onClick={handleIncreaseCumulativeGoal}
                className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/35 text-amber-300 font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Subir meta (+1.000m)
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetIndividual}
                  className="flex items-center gap-1 text-violet-300 hover:text-white transition cursor-pointer font-semibold"
                  title="Pone a cero solo el corazón individual"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Corazón
                </button>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="flex items-center gap-1 text-rose-300/80 hover:text-rose-200 transition cursor-pointer font-semibold"
                  title="Reinicia todo el evento"
                >
                  Todo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Columna Central (4 cols): Corazón Individual (Reto 1.000 m) */}
        <section className="lg:col-span-4 flex flex-col items-center justify-between bg-[#181132]/85 backdrop-blur-xl border border-violet-400/25 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
          
          <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-violet-400/15">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-200 bg-violet-950 border border-violet-400/30 px-2.5 py-1.5 rounded-lg">
                <PurpleRibbon className="w-3.5 h-4" />
                2 min · 1.000 m
              </span>

              {activeParticipant && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 text-xs font-bold truncate max-w-[120px]">
                  <UserCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{activeParticipant}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-[#0b0718] px-3 py-1.5 rounded-lg border border-violet-400/20">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black font-mono text-white">{currentSpeedKmh} km/h</span>
            </div>
          </div>

          <div className="relative w-full flex items-center justify-center my-5">
            <svg
              viewBox="0 0 200 200"
              className="w-60 h-60 sm:w-64 sm:h-64 absolute opacity-20 pointer-events-none animate-spin"
              style={{ animationDuration: isGoalReached ? '4s' : '18s' }}
            >
              <circle cx="100" cy="100" r="92" fill="none" stroke="#a78bfa" strokeWidth="5" strokeDasharray="12 6" />
              <circle cx="100" cy="100" r="84" fill="none" stroke="#c4b5fd" strokeWidth="2" />
              <circle cx="100" cy="100" r="14" fill="none" stroke="#a78bfa" strokeWidth="4" />
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

            <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center z-10">
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

                <path
                  d="M50 88.9C48.5 88.9 10 64.2 10 34.5C10 20.4 21.2 10 34.2 10C41.8 10 47.4 13.7 50 18.2C52.6 13.7 58.2 10 65.8 10C78.8 10 90 20.4 90 34.5C90 64.2 51.5 88.9 50 88.9Z"
                  fill="#0b0718"
                  stroke="rgba(167, 139, 250, 0.45)"
                  strokeWidth="2.5"
                />

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

                <path
                  d="M50 88.9C48.5 88.9 10 64.2 10 34.5C10 20.4 21.2 10 34.2 10C41.8 10 47.4 13.7 50 18.2C52.6 13.7 58.2 10 65.8 10C78.8 10 90 20.4 90 34.5C90 64.2 51.5 88.9 50 88.9Z"
                  fill="none"
                  stroke={isGoalReached ? '#34d399' : 'rgba(196, 181, 253, 0.65)'}
                  strokeWidth={isGoalReached ? '3.2' : '2'}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black font-mono tracking-tight text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                  {Math.round(percentage)}%
                </span>
                <span className="text-xs font-mono font-bold text-violet-200 bg-black/60 px-2 py-0.5 rounded-md mt-1 border border-white/10">
                  {currentMeters.toLocaleString()} / {GOAL_METERS} m
                </span>
              </div>
            </div>
          </div>

          {/* Perfil de Etapa Individual */}
          <div className="w-full bg-[#0b0718] border border-violet-400/20 rounded-xl p-3 mb-3">
            <div className="flex justify-between text-[10px] font-mono font-bold text-violet-300 mb-2">
              <span>SALIDA (0m)</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Flag className="w-3 h-3" /> META 2 MIN (1.000m)
              </span>
            </div>
            <div className="relative h-2.5 bg-violet-950 rounded-full overflow-visible border border-violet-500/25">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
              <div
                className="absolute -top-3.5 -translate-x-1/2 bg-violet-600 text-white p-1 rounded-full border-2 border-white shadow-md transition-all duration-700"
                style={{ left: `${percentage}%` }}
              >
                <Bike className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="text-center">
            {isGoalReached ? (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>¡Reto completado! Sumado a la meta 25N</span>
              </div>
            ) : (
              <p className="text-xs text-violet-200">
                {currentMeters === 0
                  ? 'En línea de salida. Registra los metros de los 2 minutos.'
                  : `Faltan ${Math.max(0, GOAL_METERS - currentMeters)} m para llenar el corazón individual.`}
              </p>
            )}
          </div>
        </section>

        {/* Columna Derecha (4 cols): ESCALADA CICLISTA HACIA LA META DEL 25N */}
        <section
          className={`lg:col-span-4 flex flex-col items-center justify-between rounded-2xl p-6 backdrop-blur-xl border shadow-2xl transition-all duration-500 ${
            isGrandPrizeReached
              ? 'bg-gradient-to-b from-amber-950/60 via-[#181132] to-[#181132] border-amber-400/60 shadow-amber-500/20'
              : 'bg-[#181132]/90 border-violet-400/25'
          }`}
        >
          {/* Arco de Meta Ciclista 25N */}
          <div className="w-full pb-3 border-b border-violet-400/15">
            <div className="flex items-center justify-between bg-gradient-to-r from-violet-950 via-purple-900/80 to-violet-950 border border-violet-400/35 rounded-xl px-3.5 py-2 shadow-inner">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-300 block leading-none">
                    Gran Meta Colectiva · IESO Sierra la Mesta
                  </span>
                  <span className="text-xs sm:text-sm font-black text-white">
                    Pedaleando por la Eliminación de la Violencia
                  </span>
                </div>
              </div>
              <PurpleRibbon className="w-5 h-6 shrink-0" />
            </div>
          </div>

          {/* Carretera Vertical de Escalada + Cotas 25N */}
          <div className="my-5 flex items-center justify-center gap-4 w-full">
            
            {/* Carril / Carretera Vertical con Bicicleta Escaladora */}
            <div className="relative w-16 sm:w-20 h-64 sm:h-72 bg-[#0b0718] rounded-2xl border-2 border-violet-400/40 p-1.5 flex flex-col justify-end overflow-visible shadow-inner">
              
              {/* Pancarta superior de Meta en la barra */}
              <div className="absolute -top-3.5 inset-x-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider text-center py-0.5 rounded-md shadow-md border border-white flex items-center justify-center gap-1 z-30">
                <Flag className="w-2.5 h-2.5 fill-slate-950" /> META
              </div>

              {/* Línea discontinua central tipo carretera */}
              <div className="absolute inset-y-2 left-1/2 -translate-x-1/2 border-l-2 border-dashed border-white/15 z-10 pointer-events-none" />

              {/* Relleno de progreso conquistado */}
              <div
                className={`w-full rounded-xl transition-all duration-1000 ease-out relative overflow-hidden ${
                  isGrandPrizeReached
                    ? 'bg-gradient-to-t from-violet-700 via-amber-500 to-yellow-300'
                    : 'bg-gradient-to-t from-violet-900 via-violet-600 to-emerald-400'
                }`}
                style={{ height: `${cumulativePercentage}%` }}
              >
                {cumulativePercentage > 0 && cumulativePercentage < 100 && (
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-white shadow-[0_0_8px_#fff]" />
                )}
              </div>

              {/* Ciclista subiendo por la carretera según el porcentaje acumulado */}
              <div
                className="absolute left-1/2 -translate-x-1/2 translate-y-1/2 z-30 transition-all duration-1000 ease-out"
                style={{ bottom: `${cumulativePercentage}%` }}
              >
                <div
                  className={`p-1.5 rounded-full border-2 shadow-lg flex items-center justify-center ${
                    isGrandPrizeReached
                      ? 'bg-amber-400 border-white text-slate-950 scale-110'
                      : 'bg-violet-600 border-emerald-300 text-white'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                </div>
              </div>

              {/* Porcentaje en la base */}
              <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none z-20">
                <span className="text-[11px] font-black font-mono text-white bg-black/70 px-1.5 py-0.5 rounded border border-white/15">
                  {Math.round(cumulativePercentage)}%
                </span>
              </div>
            </div>

            {/* Hitos y Cotas de Concienciación 25N a la derecha de la barra */}
            <div className="h-64 sm:h-72 flex flex-col justify-between py-0.5 flex-1">
              {stageMilestones.map((milestone, index) => {
                const metersAtPoint = Math.round(cumulativeGoal * milestone.ratio);
                const reached = cumulativeMeters >= metersAtPoint && (milestone.ratio === 0 ? true : cumulativeMeters > 0);
                return (
                  <div key={index} className="flex items-center gap-2">
                    <span
                      className={`w-3 h-0.5 shrink-0 ${
                        milestone.isFinish
                          ? 'bg-emerald-400'
                          : reached
                          ? 'bg-violet-400'
                          : 'bg-violet-500/30'
                      }`}
                    />
                    <div className="leading-tight">
                      <span
                        className={`text-xs font-mono font-black block ${
                          milestone.isFinish
                            ? 'text-emerald-400 flex items-center gap-1'
                            : reached
                            ? 'text-white'
                            : 'text-violet-300/70'
                        }`}
                      >
                        {metersAtPoint.toLocaleString()} m
                        {milestone.isFinish && <Trophy className="w-3.5 h-3.5 text-amber-400 inline" />}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider block ${
                          milestone.isFinish
                            ? 'text-amber-300'
                            : reached
                            ? 'text-violet-200'
                            : 'text-violet-400/50'
                        }`}
                      >
                        {milestone.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Marcador numérico y botón para ampliar meta +1.000m */}
          <div className="w-full text-center space-y-2.5">
            <div className="bg-[#0b0718] border border-violet-400/20 rounded-xl p-2.5">
              <span className="text-[10px] uppercase tracking-widest text-violet-300 block font-bold">
                Metros Pedaleados hacia la Meta
              </span>
              <span className="text-xl font-black font-mono text-white">
                {cumulativeMeters.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-violet-300"> / {cumulativeGoal.toLocaleString()} m</span>
            </div>

            {isGrandPrizeReached ? (
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-200 text-xs font-extrabold flex items-center justify-center gap-1.5 animate-pulse">
                  <Trophy className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>¡META 25N CONQUISTADA! PREMIO FINAL</span>
                </div>
                <button
                  type="button"
                  onClick={handleIncreaseCumulativeGoal}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  Nueva etapa +1.000 m ({(cumulativeGoal + 1000).toLocaleString()}m)
                </button>
              </div>
            ) : (
              <p className="text-xs text-violet-200">
                Faltan <strong className="text-emerald-400 font-mono">{(cumulativeGoal - cumulativeMeters).toLocaleString()} m</strong> pedaleando para alcanzar la meta del 25N.
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
                Registro del Pelotón · IESO Sierra la Mesta ({history.length} participantes)
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