import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Save, RefreshCw } from 'lucide-react';

export function Settings() {
    const { config, updateConfig } = useDashboard();
    const [formData, setFormData] = useState({
        adsPerDay: config.adsPerDay,
        transportPerDay: config.transportPerDay,
        ticketMin: config.ticketMin,
        ticketAvg: config.ticketAvg,
        ticketMax: config.ticketMax,
    });

    const [saved, setSaved] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateConfig({
            adsPerDay: Number(formData.adsPerDay),
            transportPerDay: Number(formData.transportPerDay),
            ticketMin: Number(formData.ticketMin),
            ticketAvg: Number(formData.ticketAvg),
            ticketMax: Number(formData.ticketMax),
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleReset = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <header className="mb-2">
                <h1 className="text-4xl font-display font-semibold mb-2 text-white">Configurações Base</h1>
                <p className="text-[var(--text-secondary)]">
                    Ajuste os valores dos cálculos preditivos do Magic Dashboard.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glass-panel space-y-6">
                    <h2 className="text-xl font-display font-medium border-b border-white/10 pb-2">Despesas Operacionais Fixas</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Gasto com Anúncios por Dia (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="glass-input text-lg"
                                value={formData.adsPerDay}
                                onChange={(e) => setFormData({ ...formData, adsPerDay: e.target.value })}
                            />
                            <p className="text-xs text-[var(--text-muted)]">Calculado para todos os dias até a meta.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Gasto com Condução (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="glass-input text-lg"
                                value={formData.transportPerDay}
                                onChange={(e) => setFormData({ ...formData, transportPerDay: e.target.value })}
                            />
                            <p className="text-xs text-[var(--text-muted)]">Calculado apenas de Segunda a Sexta.</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel space-y-6">
                    <h2 className="text-xl font-display font-medium border-b border-white/10 pb-2">Estimativa de Tickets (Preços de Convites)</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Ticket Pessimista (R$)</label>
                            <input
                                type="number"
                                step="1"
                                className="glass-input text-lg text-red-100"
                                value={formData.ticketMin}
                                onChange={(e) => setFormData({ ...formData, ticketMin: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Ticket Médio (R$)</label>
                            <input
                                type="number"
                                step="1"
                                className="glass-input text-lg text-blue-100"
                                value={formData.ticketAvg}
                                onChange={(e) => setFormData({ ...formData, ticketAvg: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Ticket Otimista (R$)</label>
                            <input
                                type="number"
                                step="1"
                                className="glass-input text-lg text-green-100"
                                value={formData.ticketMax}
                                onChange={(e) => setFormData({ ...formData, ticketMax: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button type="submit" className="glass-button bg-white text-black hover:bg-white/90">
                        <Save size={18} /> {saved ? 'Salvo!' : 'Salvar Alterações'}
                    </button>

                    {saved && <span className="text-sm text-green-400 animate-fade-in">Alterações aplicadas nas previsões.</span>}
                </div>
            </form>

            <div className="pt-12 border-t border-white/10">
                <h3 className="text-lg font-display text-red-400 mb-2">Zona de Perigo</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">Isso irá apagar todos os dados salvos no seu painel, incluindo a fila de produção e configurações.</p>
                <button onClick={handleReset} className="glass-button border-red-500/30 text-red-400 hover:bg-red-500/10">
                    <RefreshCw size={18} /> Resetar Todo o Dashboard
                </button>
            </div>
        </div>
    );
}
