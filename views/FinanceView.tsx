
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, ArrowUpRight, ArrowDownLeft, Trash2, Target, CalendarClock, 
  CreditCard, ChevronRight, Calculator, Wallet, Receipt, History, AlertCircle
} from 'lucide-react';
import { Transaction, DueItem } from '../types';

const FinanceView: React.FC = () => {
  const { 
    transactions, setTransactions, 
    dues, setDues,
    savingsGoals, setSavingsGoals, 
    emis, setEmis, 
    subscriptions, setSubscriptions, t 
  } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'dues' | 'savings' | 'emi'>('overview');
  const [showAddModal, setShowAddModal] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const income = transactions.filter(tr => tr.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expense = transactions.filter(tr => tr.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const totalBalance = income - expense;

  const totalPayable = dues.filter(d => d.type === 'payable' && d.status === 'pending').reduce((a, b) => a + b.amount, 0);
  const totalReceivable = dues.filter(d => d.type === 'receivable' && d.status === 'pending').reduce((a, b) => a + b.amount, 0);

  const deleteItem = (id: string, list: any[], setList: Function) => {
    if (confirm('Are you sure?')) setList(list.filter(item => item.id !== id));
  };

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Premium Balance Card */}
      <div className="p-8 rounded-[48px] bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="flex justify-between items-start mb-8">
           <div>
             <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Current Balance</p>
             <h2 className="text-4xl font-black">${totalBalance.toFixed(2)}</h2>
           </div>
           <div className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl">
             <Wallet size={24} />
           </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 bg-white/10 backdrop-blur-md rounded-[32px] border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-wider text-indigo-100 mb-1">Income</p>
              <p className="text-lg font-black">+${income}</p>
           </div>
           <div className="p-4 bg-white/10 backdrop-blur-md rounded-[32px] border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-wider text-indigo-100 mb-1">Expense</p>
              <p className="text-lg font-black">-${expense}</p>
           </div>
        </div>
      </div>

      {/* Dues Summary */}
      <div className="flex gap-4">
         <div className="flex-1 p-5 rounded-[36px] bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20">
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Dena (Payable)</p>
            <p className="text-xl font-black dark:text-rose-400">${totalPayable}</p>
         </div>
         <div className="flex-1 p-5 rounded-[36px] bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Paona (Receivable)</p>
            <p className="text-xl font-black dark:text-emerald-400">${totalReceivable}</p>
         </div>
      </div>

      {/* Quick Entry List */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xs font-black dark:text-white uppercase tracking-widest">Recent Activity</h3>
          <button onClick={() => setShowAddModal('transaction')} className="text-indigo-500 text-[10px] font-black uppercase tracking-widest">+ New Entry</button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 5).map(tx => (
            <div key={tx.id} className="p-4 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                   {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                </div>
                <div>
                   <p className="text-sm font-black dark:text-white">{tx.category}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase">{tx.period || 'daily'} • {new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className={`font-black ${tx.type === 'income' ? 'text-emerald-500' : 'dark:text-white'}`}>
                {tx.type === 'income' ? '+' : '-'}${tx.amount}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderDues = () => (
    <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
      <div className="flex justify-between items-center px-2">
         <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{t('dues')}</h2>
         <button onClick={() => setShowAddModal('due')} className="p-3 bg-indigo-500 text-white rounded-2xl"><Plus size={20} /></button>
      </div>

      <div className="space-y-4">
        {dues.map(due => (
          <div key={due.id} className={`p-6 rounded-[40px] border shadow-sm transition-all ${due.status === 'cleared' ? 'opacity-40' : ''} bg-white dark:bg-slate-900 ${due.type === 'payable' ? 'border-rose-100 dark:border-rose-900/30' : 'border-emerald-100 dark:border-emerald-900/30'}`}>
             <div className="flex justify-between items-center mb-4">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{due.type === 'payable' ? 'I Owe' : 'Owes Me'}</p>
                   <p className="text-lg font-black dark:text-white">{due.name}</p>
                </div>
                <div className={`p-3 rounded-2xl ${due.type === 'payable' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                   {due.type === 'payable' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
             </div>
             <div className="flex items-center justify-between">
                <p className={`text-2xl font-black ${due.type === 'payable' ? 'text-rose-500' : 'text-emerald-500'}`}>${due.amount}</p>
                <div className="flex gap-2">
                   <button 
                     onClick={() => setDues(dues.map(d => d.id === due.id ? {...d, status: d.status === 'cleared' ? 'pending' : 'cleared'} : d))}
                     className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${due.status === 'cleared' ? 'bg-slate-100 text-slate-500' : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}`}
                   >
                     {due.status === 'cleared' ? 'Undo' : 'Mark Cleared'}
                   </button>
                   <button onClick={() => deleteItem(due.id, dues, setDues)} className="p-2 text-rose-500"><Trash2 size={18} /></button>
                </div>
             </div>
          </div>
        ))}
        {dues.length === 0 && (
          <div className="text-center py-20 opacity-30">
            <AlertCircle size={48} className="mx-auto mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">No outstanding dues</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-24">
      <div className="flex items-center justify-between px-1">
         <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{t('finance_hub')}</h2>
         <Calculator size={20} className="text-slate-400" />
      </div>
      
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
        {[
          { id: 'overview', label: t('summary'), icon: Receipt },
          { id: 'dues', label: t('dues'), icon: History },
          { id: 'savings', label: t('goals'), icon: Target },
          { id: 'emi', label: 'EMI', icon: CalendarClock },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[24px] transition-all ${
              activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-indigo-500'
            }`}
          >
            <tab.icon size={16} />
            <span className="text-[9px] font-black uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'dues' && renderDues()}
      {activeTab === 'savings' && (
        <div className="animate-in slide-in-from-right-10 duration-500">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-xl font-black dark:text-white">Savings Goals</h3>
            <button onClick={() => setShowAddModal('savings')} className="p-3 bg-indigo-500 text-white rounded-2xl"><Plus size={20} /></button>
          </div>
          {/* Savings rendering similar to existing but with updated aesthetics */}
          <div className="space-y-4">
             {savingsGoals.map(goal => (
               <div key={goal.id} className="p-6 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-lg font-black dark:text-white">{goal.name}</p>
                       <p className="text-xs text-slate-500 font-bold">${goal.current} of ${goal.target}</p>
                     </div>
                     <Target className="text-indigo-500" size={24} />
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${(goal.current / goal.target) * 100}%` }} />
                  </div>
                  <button onClick={() => {
                     const amt = prompt("Amount to save?");
                     if (amt) setSavingsGoals(savingsGoals.map(g => g.id === goal.id ? {...g, current: g.current + Number(amt)} : g));
                  }} className="w-full py-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">Update Progress</button>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Add Entry Modals */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end animate-in fade-in">
           <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-t-[56px] p-10 shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
              <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-8" />
              <h3 className="text-2xl font-black mb-8 dark:text-white uppercase tracking-tighter">Add {showAddModal}</h3>
              
              <div className="space-y-5">
                 <input 
                   type="text" 
                   placeholder="Name / Purpose" 
                   className="w-full p-6 rounded-[32px] bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm font-bold shadow-inner"
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                 />
                 <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="number" 
                      placeholder="Amount" 
                      className="w-full p-6 rounded-[32px] bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm font-bold shadow-inner"
                      onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    />
                    <select 
                      className="w-full p-6 rounded-[32px] bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm font-bold shadow-inner appearance-none"
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                       <option value="">Category</option>
                       {showAddModal === 'transaction' && (
                         <>
                           <option value="income">Income</option>
                           <option value="expense">Expense</option>
                         </>
                       )}
                       {showAddModal === 'due' && (
                         <>
                           <option value="payable">Powna (Receivable)</option>
                           <option value="receivable">Dena (Payable)</option>
                         </>
                       )}
                    </select>
                 </div>
                 
                 <div className="flex gap-4 pt-4">
                    <button onClick={() => setShowAddModal(null)} className="flex-1 py-6 rounded-[32px] font-black uppercase tracking-widest text-[10px] text-slate-500">Cancel</button>
                    <button 
                      onClick={() => {
                        if (showAddModal === 'transaction') {
                          setTransactions([{ id: Date.now().toString(), amount: formData.amount, type: formData.type as any, category: formData.name, date: new Date().toISOString(), note: '' }, ...transactions]);
                        } else if (showAddModal === 'due') {
                          setDues([{ id: Date.now().toString(), name: formData.name, amount: formData.amount, type: formData.type as any, date: new Date().toISOString(), status: 'pending' }, ...dues]);
                        } else if (showAddModal === 'savings') {
                          setSavingsGoals([{ id: Date.now().toString(), name: formData.name, target: formData.amount, current: 0, deadline: '' }, ...savingsGoals]);
                        }
                        setShowAddModal(null);
                      }}
                      className="flex-1 py-6 bg-indigo-600 text-white rounded-[32px] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-500/20"
                    >
                      Confirm
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FinanceView;
