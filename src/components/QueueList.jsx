import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Plus, Trash2, Edit2, Play, CheckCircle } from 'lucide-react';

export function QueueList() {
    const { queue, addQueueItem, updateQueueItem, deleteQueueItem } = useDashboard();
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ customer: '', price: '', status: 'PRODUCTION', note: '' });

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newItem.customer || !newItem.price) return;
        addQueueItem({
            customer: newItem.customer,
            price: Number(newItem.price),
            status: newItem.status,
            note: newItem.note,
            date: new Date().toISOString().split('T')[0]
        });
        setNewItem({ customer: '', price: '', status: 'PRODUCTION', note: '' });
        setIsAdding(false);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PRODUCTION':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1"><Play size={12} /> Produção</span>;
            case 'PENDING_PAYMENT':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center gap-1"><CheckCircle size={12} /> Aguardando Pgto</span>;
            case 'PAID':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-1"><CheckCircle size={12} /> Pago</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[var(--text-secondary)] font-medium">Itens Atuais</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="glass-button text-sm py-2 px-4"
                >
                    <Plus size={16} /> Adicionar Pedido
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAdd} className="glass-panel mb-6 animate-fade-in space-y-4 border-white/20">
                    <h4 className="font-display font-medium text-lg mb-2 text-white">Novo Pedido</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Nome do Cliente / Convite"
                            className="glass-input"
                            value={newItem.customer}
                            onChange={(e) => setNewItem({ ...newItem, customer: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Valor Estimado/Real (R$)"
                            className="glass-input"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            required
                        />
                        <select
                            className="glass-input bg-[#121212] appearance-none"
                            value={newItem.status}
                            onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                        >
                            <option value="PRODUCTION">Em Produção (Fila)</option>
                            <option value="PENDING_PAYMENT">Pronto, Aguardando Pagamento</option>
                            <option value="PAID">Finalizado & Pago</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Observação (ex: Previsão amanhã)"
                            className="glass-input"
                            value={newItem.note}
                            onChange={(e) => setNewItem({ ...newItem, note: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Cancelar</button>
                        <button type="submit" className="glass-button bg-white text-black hover:bg-white/90 !border-white text-sm">Salvar Pedido</button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {queue.length === 0 ? (
                    <div className="glass-panel text-center py-8 text-[var(--text-muted)]">Nenhum pedido na fila.</div>
                ) : (
                    queue.map(item => (
                        <div key={item.id} className="glass-panel !p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-medium text-white">{item.customer}</h4>
                                    {getStatusBadge(item.status)}
                                </div>
                                <div className="text-sm text-[var(--text-muted)] flex items-center gap-2">
                                    <span>Adicionado: {item.date}</span>
                                    {item.note && <span className="border-l border-white/10 pl-2">{item.note}</span>}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="block text-sm text-[var(--text-muted)]">Valor</span>
                                    <span className="font-display font-medium text-lg text-white">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                                </div>
                                <div className="flex flex-col gap-1 border-l border-white/10 pl-4">
                                    <select
                                        title="Mudar Status"
                                        className="bg-transparent border border-white/10 text-xs rounded p-1 text-white cursor-pointer outline-none hover:border-white/30"
                                        value={item.status}
                                        onChange={(e) => updateQueueItem(item.id, { status: e.target.value })}
                                    >
                                        <option className="bg-[#121212]" value="PRODUCTION">Produção</option>
                                        <option className="bg-[#121212]" value="PENDING_PAYMENT">Aguardando Pgto</option>
                                        <option className="bg-[#121212]" value="PAID">Pago</option>
                                    </select>
                                    <button
                                        onClick={() => deleteQueueItem(item.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors text-xs text-left px-1 py-1 flex items-center gap-1"
                                    >
                                        <Trash2 size={12} /> Remover
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
