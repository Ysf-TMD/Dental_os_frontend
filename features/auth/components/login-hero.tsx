"use client";

import { useEffect, useState } from "react";

export function LoginHero() {
  // Animated counters
  const [counters, setCounters] = useState({
    appointments: 0,
    patients: 0,
    revenue: 0,
    treatments: 0,
  });

  useEffect(() => {
    const targetValues = {
      appointments: 12,
      patients: 1247,
      revenue: 45.2,
      treatments: 89,
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const animateCounters = () => {
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setCounters({
          appointments: Math.round(targetValues.appointments * progress),
          patients: Math.round(targetValues.patients * progress),
          revenue: parseFloat((targetValues.revenue * progress).toFixed(1)),
          treatments: Math.round(targetValues.treatments * progress),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);
    };

    // Start animation when component mounts
    const timeout = setTimeout(animateCounters, 500);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      {/* Black gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "var(--gradient-mesh)" }} />
      <div className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -right-10 bottom-0 size-56 rounded-full bg-accent/25 blur-3xl" />
      
      <div className="relative flex flex-col justify-center h-full px-12 py-16">
        <div className="max-w-md mx-auto space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className="size-16 rounded-2xl grid place-items-center shadow-[var(--shadow-glow)]"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              <svg className="size-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-display)] text-white">
                DentalOS
              </h1>
              <p className="text-sm text-white/60">Plateforme de gestion dentaire moderne</p>
            </div>
          </div>

          {/* Professional cards with animated counters */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">Rendez-vous</span>
                </div>
                <div className="text-2xl font-bold text-white">{counters.appointments}</div>
                <div className="text-xs text-white/60">Aujourd'hui</div>
                <p className="text-xs text-white/50 mt-2">Optimisez votre planning avec notre système intelligent de prise de rendez-vous.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">Patients</span>
                </div>
                <div className="text-2xl font-bold text-white">{counters.patients.toLocaleString()}</div>
                <div className="text-xs text-white/60">Total</div>
                <p className="text-xs text-white/50 mt-2">Suivi complet des dossiers patients et historique médical détaillé.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">Revenus</span>
                </div>
                <div className="text-2xl font-bold text-white">{counters.revenue}K</div>
                <div className="text-xs text-white/60">Ce mois</div>
                <p className="text-xs text-white/50 mt-2">Gestion automatique des factures et suivi des paiements en temps réel.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <svg className="size-4 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">Traitements</span>
                </div>
                <div className="text-2xl font-bold text-white">{counters.treatments}</div>
                <div className="text-xs text-white/60">En cours</div>
                <p className="text-xs text-white/50 mt-2">Planification des traitements et suivi des protocoles dentaires personnalisés.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
