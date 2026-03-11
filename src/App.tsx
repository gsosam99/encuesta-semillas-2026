import React, { useState, useEffect, useMemo } from 'react';
import { AppMode, Lote, Stats, SubmissionData, StoredResponse } from './types';
import { PRODUCERS_DATA, lookupByCedula } from './data/producers';
import { DANAC_SEEDS } from './data/seeds';
import { supabaseInsert, supabaseFetchAll } from './services/supabase';
import Header from './components/layout/Header';
import Spinner from './components/ui/Spinner';
import LoginForm from './components/login/LoginForm';
import DashboardAuth from './components/admin/DashboardAuth';
import ProducerForm from './components/form/ProducerForm';
import AdminPanel from './components/admin/AdminPanel';
import SubmittedView from './components/submitted/SubmittedView';

const DASHBOARD_PIN = process.env.REACT_APP_DASHBOARD_PIN || 'admin2024';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('loading');
  const [producerName, setProducerName] = useState<string>('');
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [customSeeds, setCustomSeeds] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [allResponses, setAllResponses] = useState<StoredResponse[]>([]);
  const [adminSearch, setAdminSearch] = useState<string>('');

  // Login & dashboard auth state
  const [loginError, setLoginError] = useState<string | null>(null);
  const [dashboardAuth, setDashboardAuth] = useState<boolean>(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const loadAll = async (): Promise<void> => {
    const remote = await supabaseFetchAll();
    if (remote) setAllResponses(remote);
  };

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'dashboard') {
      loadAll().then(() => setMode('dashboard'));
    } else {
      setMode('login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Login handler ---
  const handleLogin = (cedula: string): void => {
    setLoginError(null);
    const result = lookupByCedula(cedula);
    if (result) {
      setProducerName(result.name);
      setMode('form');
    } else {
      setLoginError('Cédula no encontrada. Verifique e intente de nuevo.');
    }
  };

  // --- Dashboard auth handler ---
  const handleDashboardAuth = (pin: string): void => {
    setDashboardError(null);
    if (pin === DASHBOARD_PIN) {
      setDashboardAuth(true);
    } else {
      setDashboardError('Clave incorrecta. Intente de nuevo.');
    }
  };

  const lotes: Lote[] = useMemo(
    () => (producerName ? PRODUCERS_DATA[producerName] || [] : []),
    [producerName]
  );
  const totalHa: number = useMemo(
    () => lotes.reduce((s, l) => s + l.h, 0),
    [lotes]
  );

  const stats: Stats = useMemo(() => {
    let danacHa = 0,
      otrosHa = 0,
      assigned = 0;
    lotes.forEach((lot) => {
      const s = selections[String(lot.l)];
      if (s) {
        assigned++;
        if (DANAC_SEEDS.includes(s)) danacHa += lot.h;
        else otrosHa += lot.h;
      }
    });
    return {
      danacHa,
      otrosHa,
      danacPct: totalHa > 0 ? (danacHa / totalHa) * 100 : 0,
      assigned,
      total: lotes.length,
      allDone: assigned === lotes.length,
    };
  }, [selections, lotes, totalHa]);

  const canSubmit: boolean = stats.allDone && stats.danacPct >= 70;

  const handleSubmit = async (): Promise<void> => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    const data: SubmissionData = {
      lotes: lotes.map((l) => ({
        lote: String(l.l),
        finca: l.f,
        ha: l.h,
        semilla: selections[String(l.l)],
        customSeed: customSeeds[String(l.l)] || null,
        tipo: DANAC_SEEDS.includes(selections[String(l.l)]) ? 'DANAC' : 'Otros',
      })),
      totalHa,
      danacHa: stats.danacHa,
      danacPct: stats.danacPct,
      timestamp: new Date().toISOString(),
    };
    await supabaseInsert(producerName, data);
    setSubmitting(false);
    setMode('submitted');
  };

  const exportCSV = (): void => {
    let csv =
      '\uFEFF' +
      'Productor,Lote Muestreo,Finca,Superficie (Ha),Semilla,Tipo,Personalizada,% DANAC,Fecha\n';
    allResponses.forEach((r) => {
      const d = r.data;
      (d.lotes || []).forEach((lot) => {
        csv += `"${r.producer}","${lot.lote}","${lot.finca}",${lot.ha},"${lot.semilla}","${lot.tipo}","${lot.customSeed || ''}",${(d.danacPct || 0).toFixed(1)},"${d.timestamp || ''}"\n`;
      });
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' })
    );
    a.download = 'encuesta_semillas.csv';
    a.click();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg,#f0fdf4 0%,#fafbfc 50%,#fffbeb 100%)',
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <Header mode={mode} />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px 100px' }}>
        {mode === 'loading' && <Spinner />}

        {mode === 'login' && (
          <LoginForm onLogin={handleLogin} error={loginError} />
        )}

        {mode === 'form' && (
          <ProducerForm
            producerName={producerName}
            lotes={lotes}
            totalHa={totalHa}
            stats={stats}
            selections={selections}
            customSeeds={customSeeds}
            canSubmit={canSubmit}
            submitting={submitting}
            onSeedChange={(k, s) =>
              setSelections((p) => ({ ...p, [k]: s }))
            }
            onCustomChange={(k, v) =>
              setCustomSeeds((p) => ({ ...p, [k]: v }))
            }
            onSubmit={handleSubmit}
          />
        )}

        {mode === 'submitted' && (
          <SubmittedView
            producerName={producerName}
            lotes={lotes}
            totalHa={totalHa}
            danacPct={stats.danacPct}
            selections={selections}
            customSeeds={customSeeds}
          />
        )}

        {mode === 'dashboard' && !dashboardAuth && (
          <DashboardAuth
            onAuthenticated={handleDashboardAuth}
            error={dashboardError}
          />
        )}

        {mode === 'dashboard' && dashboardAuth && (
          <AdminPanel
            allResponses={allResponses}
            adminSearch={adminSearch}
            onSearchChange={setAdminSearch}
            onRefresh={loadAll}
            onExportCSV={exportCSV}
          />
        )}
      </div>
    </div>
  );
};

export default App;
