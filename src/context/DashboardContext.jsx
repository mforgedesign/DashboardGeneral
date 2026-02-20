import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

const initialConfig = {
    adsPerDay: 30, // applied every day
    transportPerDay: 10.60, // applied Monday to Friday
    ticketMin: 60,
    ticketMax: 130,
    ticketAvg: 85,
};

const initialQueue = [
    { id: 1, customer: "Baile de Máscaras", status: "PENDING_PAYMENT", price: 65, date: "2026-02-21", note: "Pronto e entregue" },
    { id: 2, customer: "(Antes Alice) Tiana", status: "PRODUCTION", price: 130, date: "2026-02-21", note: "" },
    { id: 3, customer: "Baile Inverno", status: "PRODUCTION", price: 40, date: "2026-02-21", note: "" },
    { id: 4, customer: "(Van Gogh) Dívida", status: "PENDING_PAYMENT", price: 65, date: "2026-02-21", note: "Pronto e entregue" },
    { id: 5, customer: "Astronauta", status: "PRODUCTION", price: 65, date: "2026-02-21", note: "" },
    { id: 6, customer: "Bela e a Fera", status: "PRODUCTION", price: 65, date: "2026-02-21", note: "" },
    { id: 7, customer: "Azul Vestido Prata", status: "PRODUCTION", price: 85, date: "2026-02-21", note: "" },
    { id: 8, customer: "Azul Serenity", status: "PRODUCTION", price: 90, date: "2026-02-21", note: "" },
];

const initialGoals = [
    { id: 1, name: "Pagar Pai", target: 1600, deadline: "2026-02-28", currentAmount: 0 },
    { id: 2, name: "Dívida Picpay", target: 440.49, deadline: "2026-04-04", currentAmount: 0 },
    { id: 3, name: "Mercado Pago", target: 140.91, deadline: "2026-03-11", currentAmount: 0 },
];

const initialTasks = [
    { id: 1, title: "Preparar nova proposta da Pigilott Festas", deadline: "2026-02-22", done: false, actionLink: "https://wa.me/5511991675106?text=Olá" },
    { id: 2, title: "Preparar nova proposta para a Ana Parque Florestal", deadline: "2026-02-22", done: false, actionLink: "https://wa.me/5511950375263?text=Olá" },
    { id: 3, title: "Preparar o bot de atendimento automatizado e validado", deadline: "2026-02-23", done: false, actionLink: null },
    { id: 4, title: "Preparar e validar pipeline de criação de convites", deadline: "2026-02-28", done: false, actionLink: null },
    { id: 5, title: "Readaptar site e convites para a nova pipeline", deadline: "2026-03-07", done: false, actionLink: null },
];

export function DashboardProvider({ children }) {
    // Load initial state from local storage or use defaults
    const loadState = (key, defaultVal) => {
        const saved = localStorage.getItem(`mforge_${key}`);
        return saved ? JSON.parse(saved) : defaultVal;
    };

    const [config, setConfig] = useState(() => loadState('config', initialConfig));
    const [queue, setQueue] = useState(() => loadState('queue', initialQueue));
    const [goals, setGoals] = useState(() => loadState('goals', initialGoals));
    const [tasks, setTasks] = useState(() => loadState('tasks', initialTasks));
    const [wallet, setWallet] = useState(() => loadState('wallet', { balance: 0 }));

    // Save to local storage on change
    useEffect(() => localStorage.setItem('mforge_config', JSON.stringify(config)), [config]);
    useEffect(() => localStorage.setItem('mforge_queue', JSON.stringify(queue)), [queue]);
    useEffect(() => localStorage.setItem('mforge_goals', JSON.stringify(goals)), [goals]);
    useEffect(() => localStorage.setItem('mforge_tasks', JSON.stringify(tasks)), [tasks]);
    useEffect(() => localStorage.setItem('mforge_wallet', JSON.stringify(wallet)), [wallet]);

    // Actions
    const updateConfig = (newConfig) => setConfig(prev => ({ ...prev, ...newConfig }));

    const addQueueItem = (item) => setQueue([...queue, { ...item, id: Date.now() }]);
    const updateQueueItem = (id, updates) => setQueue(queue.map(q => q.id === id ? { ...q, ...updates } : q));
    const deleteQueueItem = (id) => setQueue(queue.filter(q => q.id !== id));

    const updateGoal = (id, updates) => setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));

    const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));

    // Calculations
    const calculateTotals = () => {
        // Total production values scheduled for "tomorrow" or matching conditions
        const totalExpected = queue
            .filter(q => q.status === "PRODUCTION" || q.status === "PENDING_PAYMENT")
            .reduce((sum, item) => sum + (Number(item.price) || 0), 0);

        // Sum of all goals target
        const totalDebts = goals.reduce((sum, g) => sum + g.target, 0);

        return { totalExpected, totalDebts };
    };

    return (
        <DashboardContext.Provider value={{
            config, updateConfig,
            queue, addQueueItem, updateQueueItem, deleteQueueItem,
            goals, updateGoal,
            tasks, toggleTask,
            wallet, setWallet,
            calculateTotals
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export const useDashboard = () => useContext(DashboardContext);
