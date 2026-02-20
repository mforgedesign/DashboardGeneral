import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Settings, TrendingUp, AlertTriangle } from 'lucide-react';
import { QueueList } from '../components/QueueList';

export function Dashboard() {
    const { calculateTotals, queue } = useDashboard();
    const { totalExpected } = calculateTotals();

    // Calculate insights
    const pendingCount = queue.filter(q => q.status === 'PENDING_PAYMENT').length;
    const productionCount = queue.filter(q => q.status === 'PRODUCTION').length;

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-semibold mb-2 text-white">Dashboard Geral</h1>
                    <p className="text-[var(--text-secondary)]">Acompanhe sua fila de produção e valores a receber.</p>
                </div>
            </header>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[var(--text-secondary)] font-medium">Total Previsto (Fila + Pendentes)</h3>
                        <div className="bg-white/10 p-2 rounded-lg">
                            <TrendingUp size={20} className="text-green-400" />
                        </div>
                    </div>
                    <p className="font-display font-semibold text-4xl text-white">
                        R$ {totalExpected.toFixed(2).replace('.', ',')}
                    </p>
                </div>

                <div className="glass-panel relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[var(--text-secondary)] font-medium">Na Fila de Produção</h3>
                        <div className="bg-white/10 p-2 rounded-lg">
                            <Settings size={20} className="text-blue-400" />
                        </div>
                    </div>
                    <p className="font-display font-semibold text-4xl text-white">
                        {productionCount} <span className="text-xl text-[var(--text-secondary)] font-normal">convites</span>
                    </p>
                </div>

                <div className="glass-panel relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[var(--text-secondary)] font-medium">Aguardando Pagamento</h3>
                        <div className="bg-white/10 p-2 rounded-lg">
                            <AlertTriangle size={20} className="text-yellow-400" />
                        </div>
                    </div>
                    <p className="font-display font-semibold text-4xl text-white">
                        {pendingCount} <span className="text-xl text-[var(--text-secondary)] font-normal">convites</span>
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-display font-medium text-white">Fila de Produção e Entregas</h2>
                    </div>
                    <QueueList />
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-display font-medium text-white">Avisos Rápidos</h2>
                    <div className="glass-panel">
                        <p className="text-[var(--text-secondary)] text-sm mb-4">
                            O total previsto calcula todos os pedidos <strong>Aguardando Pagamento</strong> e <strong>Em Produção</strong>.
                            Ao concluir o pagamento, altere o status para <strong>Pago</strong> para que os valores caiam no seu caixa ou nas metas ativas.
                        </p>
                        <div className="text-xs text-[var(--text-muted)]">
                            Última sincronização: Agora mesmo (Local Storage)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
