import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Target, TrendingDown, DollarSign, Calendar, Info } from 'lucide-react';

export function Finance() {
    const { goals, calculateTotals, config } = useDashboard();
    const { totalExpected, totalDebts } = calculateTotals();

    // Function to calculate working days (Mon-Fri) between two dates
    const getWorkingDays = (startDate, endDate) => {
        let count = 0;
        const curDate = new Date(startDate.getTime());
        while (curDate <= endDate) {
            const dayOfWeek = curDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
            curDate.setDate(curDate.getDate() + 1);
        }
        return count;
    };

    // Find the farthest deadline
    const dates = goals.map(g => new Date(g.deadline).getTime());
    const maxDate = new Date(Math.max(...dates));
    const today = new Date();

    // Diff in days for global Ads cost
    const totalDays = Math.ceil((maxDate - today) / (1000 * 60 * 60 * 24));
    const workingDays = getWorkingDays(today, maxDate);

    const estimatedAdsCost = Math.max(0, totalDays) * Number(config.adsPerDay);
    const estimatedTransportCost = Math.max(0, workingDays) * Number(config.transportPerDay);
    const totalVariableCosts = estimatedAdsCost + estimatedTransportCost;

    const globalTarget = totalDebts + totalVariableCosts;

    const totalMissing = Math.max(0, globalTarget - totalExpected);

    const invitesAvg = Math.ceil(totalMissing / config.ticketAvg);
    const invitesMin = Math.ceil(totalMissing / config.ticketMin);
    const invitesMax = Math.ceil(totalMissing / config.ticketMax);

    return (
        <div className="space-y-8">
            <header className="mb-2">
                <h1 className="text-4xl font-display font-semibold mb-2 text-white">Finanças & Metas</h1>
                <p className="text-[var(--text-secondary)]">
                    Previsão inteligente de fechamentos para alcançar {goals.length} objetivos.
                </p>
            </header>

            <div className="glass-panel p-6 border-blue-500/20 bg-blue-500/5">
                <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-xl font-display font-medium flex items-center gap-2">
                            <Target size={20} className="text-blue-400" />
                            Diagnóstico do Foco
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Considerando suas dívidas (R$ {totalDebts.toFixed(2)}) e custos até {maxDate.toLocaleDateString()} (R$ {totalVariableCosts.toFixed(2)}).
                        </p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-display font-bold text-white">R$ {totalMissing.toFixed(2).replace('.', ',')}</h2>
                        <span className="text-sm text-[var(--text-muted)]">Valor Pendente a Arrecadar</span>
                    </div>
                </div>
            </div>

            {/* Forecast Section */}
            <h2 className="text-2xl font-display font-medium pb-2 border-b border-white/10">Quantos convites faltam fechar?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel text-center hover:border-blue-500/50 transition-colors">
                    <div className="text-5xl font-display font-bold text-white mb-2">{invitesAvg}</div>
                    <div className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Média (R$ {config.ticketAvg})</div>
                    <p className="text-xs text-[var(--text-muted)] mt-2">Cenário Esperado</p>
                </div>

                <div className="glass-panel text-center hover:border-yellow-500/50 transition-colors opacity-80">
                    <div className="text-4xl font-display font-bold text-white mb-2">{invitesMin}</div>
                    <div className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Pessimista (R$ {config.ticketMin})</div>
                    <p className="text-xs text-[var(--text-muted)] mt-2">Só convites básicos</p>
                </div>

                <div className="glass-panel text-center hover:border-green-500/50 transition-colors opacity-80">
                    <div className="text-4xl font-display font-bold text-white mb-2">{invitesMax}</div>
                    <div className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Otimista (R$ {config.ticketMax})</div>
                    <p className="text-xs text-[var(--text-muted)] mt-2">Só convites premium</p>
                </div>
            </div>


            {/* Breakdown Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                    <h3 className="text-xl font-display font-medium flex items-center gap-2 text-white">
                        <Calendar size={20} className="text-[var(--text-muted)]" />
                        Dívidas & Objetivos
                    </h3>
                    <div className="space-y-3">
                        {goals.map(goal => (
                            <div key={goal.id} className="glass-panel !p-4 flex justify-between items-center group">
                                <div>
                                    <h4 className="font-medium text-white">{goal.name}</h4>
                                    <span className="text-xs text-[var(--text-muted)]">Prazo: {new Date(goal.deadline).toLocaleDateString()}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-display font-semibold text-white">R$ {goal.target.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-display font-medium flex items-center gap-2 text-white">
                        <TrendingDown size={20} className="text-red-400" />
                        Despesas Operacionais Fixas
                    </h3>
                    <div className="glass-panel space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 bg-white w-24 h-24 rounded-full -mr-10 -mt-10 pointer-events-none"></div>

                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                            <div>
                                <span className="block font-medium text-white">Anúncios (Diário)</span>
                                <span className="text-xs text-[var(--text-muted)]">R$ {config.adsPerDay.toFixed(2)} × {Math.max(0, totalDays)} dias</span>
                            </div>
                            <span className="font-display font-medium text-red-300">R$ {estimatedAdsCost.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                            <div>
                                <span className="block font-medium text-white">Condução (Seg a Sex)</span>
                                <span className="text-xs text-[var(--text-muted)]">R$ {config.transportPerDay.toFixed(2)} × {Math.max(0, workingDays)} dias</span>
                            </div>
                            <span className="font-display font-medium text-red-300">R$ {estimatedTransportCost.toFixed(2)}</span>
                        </div>

                        <div className="pt-2 text-xs flex gap-2 items-start text-[var(--text-secondary)]">
                            <Info size={14} className="shrink-0 mt-0.5" />
                            <p>Os custos operacionais são calculados da data de hoje até o vencimento da dívida mais distante ({maxDate.toLocaleDateString()}). Modifique esses valores na guia de Configurações.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
