import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { CheckCircle2, Circle, Calendar, ExternalLink } from 'lucide-react';

export function Tasks() {
    const { tasks, toggleTask } = useDashboard();

    const sortedTasks = [...tasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    const pendingTasks = sortedTasks.filter(t => !t.done);
    const completedTasks = sortedTasks.filter(t => t.done);

    return (
        <div className="space-y-8">
            <header className="mb-2">
                <h1 className="text-4xl font-display font-semibold mb-2 text-white">Tarefas Prioritárias</h1>
                <p className="text-[var(--text-secondary)]">
                    Foque no que importa. Complete essas {pendingTasks.length} tarefas pendentes para avançar.
                </p>
            </header>

            <div className="space-y-6">
                {/* Pending Tasks */}
                <div className="space-y-3">
                    <h2 className="text-xl font-display font-medium text-white mb-4">A Fazer</h2>
                    {pendingTasks.length === 0 ? (
                        <div className="glass-panel text-center py-8 text-[var(--text-muted)]">Nenhuma tarefa pendente!</div>
                    ) : (
                        pendingTasks.map(task => (
                            <div key={task.id} className="glass-panel !p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-[#3b82f6] hover:bg-white/5 transition-colors">
                                <div className="flex items-start gap-4 flex-1">
                                    <button onClick={() => toggleTask(task.id)} className="mt-1 text-[var(--text-muted)] hover:text-white transition-colors">
                                        <Circle size={24} />
                                    </button>
                                    <div>
                                        <h3 className="text-lg font-medium text-white mb-1">{task.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} /> Até {new Date(task.deadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {task.actionLink && (
                                    <div className="pl-12 md:pl-0">
                                        <a
                                            href={task.actionLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glass-button text-sm flex items-center gap-2 bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20 px-3 py-1.5"
                                        >
                                            Abrir WhatsApp <ExternalLink size={14} />
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                    <div className="space-y-3 pt-6 opacity-70">
                        <h2 className="text-xl font-display font-medium text-white mb-4">Concluídas</h2>
                        {completedTasks.map(task => (
                            <div key={task.id} className="glass-panel !p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-green-500 bg-white/5">
                                <div className="flex items-start gap-4 flex-1">
                                    <button onClick={() => toggleTask(task.id)} className="mt-1 text-green-400 hover:text-green-300 transition-colors">
                                        <CheckCircle2 size={24} />
                                    </button>
                                    <div>
                                        <h3 className="text-lg font-medium text-[var(--text-secondary)] line-through mb-1">{task.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} /> Até {new Date(task.deadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
