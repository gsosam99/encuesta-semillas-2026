import React, { useState, useEffect, useMemo } from 'react';
import { AppMode, Lote, Stats, SubmissionData, StoredResponse } from './types';
import { PRODUCERS_DATA } from './data/producers';
import { DANAC_SEEDS } from './data/seeds';
import { TOKEN_TO_PRODUCER } from './utils/tokens';
import { supabaseInsert, supabaseFetchAll } from './services/supabase';
import Header from './components/layout/Header';
import Spinner from './components/ui/Spinner';
import NotFound from './components/ui/NotFound';
import ProducerForm from './components/form/ProducerForm';
import AdminPanel from './components/admin/AdminPanel';
import SubmittedView from './components/submitted/SubmittedView';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('loading');
  const [producerName, setProducerName] = useState<string>('');
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [customSeeds, setCustomSeeds] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [allResponses, setAllResponses] = useState<StoredResponse[]>([]);
  const [adminSearch, setAdminSearch] = useState<string>('');
  const [copied, setCopied] = useState<string>('');

  const loadAll = async (): Promise<void> => {
    const remote = await supabaseFetchAll();
    if (remote) setAllResponses(remote);
  };

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'admin') {
      loadAll().then(() => setMode('admin'));
    } else if (hash && TOKEN_TO_PRODUCER[hash]) {
      setProducerName(TOKEN_TO_PRODUCER[hash]);
      setMode('form');
    } else if (hash) {
      setMode('notfound');
    } else {
      setMode('admin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const copyLink = (token: string): void => {
    const base = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(`${base}#${token}`);
    setCopied(token);
    setTimeout(() => setCopied(''), 2000);
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
        {mode === 'notfound' && <NotFound />}

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

        {mode === 'admin' && (
          <AdminPanel
            allResponses={allResponses}
            adminSearch={adminSearch}
            onSearchChange={setAdminSearch}
            copied={copied}
            onCopyLink={copyLink}
            onRefresh={loadAll}
            onExportCSV={exportCSV}
          />
        )}
      </div>
    </div>
  );
};

export default App;
