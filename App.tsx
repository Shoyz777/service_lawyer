import React, { useState, useEffect } from 'react';
import { AppView, Template, CategoryType, User } from './types';
import { TEMPLATES } from './constants';
import TemplateCard from './components/TemplateCard';
import DocumentEditor from './components/DocumentEditor';
import { AuthModal } from './components/AuthModal';
import { FileText, Users, History, CheckCircle, Shield, Search, Zap, Crown, Check, ArrowRight, BookOpen, UserPlus, Settings } from 'lucide-react';

const CATEGORIES: (CategoryType | 'Все')[] = [
    'Все', 'Недвижимость', 'Услуги', 'Деньги', 'Работа', 'Бизнес', 'Семья', 'Сайт', 'Налоговая', 'Накладные', 'Внутренние', 'Резюме', 'Для работодателя', 'Документы HR'
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'Все'>('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLimitReached, setShowLimitReached] = useState(false);

  const handleTemplateSelect = (template: Template) => {
    if (!user) {
      setSelectedTemplate(template);
      setShowAuth(true);
      return;
    }

    if (!user.isPro && user.docsCreated >= 3) {
      setShowLimitReached(true);
      return;
    }

    setSelectedTemplate(template);
    setView(AppView.EDITOR);
  };

  const onAuthSuccess = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
    if (selectedTemplate) {
      setView(AppView.EDITOR);
    }
  };

  const filteredTemplates = TEMPLATES.filter(t => {
      const matchesCategory = activeCategory === 'Все' || t.category === activeCategory;
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  const handleProUpgrade = () => {
      if(user) {
          setUser({...user, isPro: true});
          setShowLimitReached(false);
          alert("🎉 Спасибо за доверие! Теперь вам доступны безлимитные документы и экспорт во все форматы.");
          setView(AppView.HOME);
      }
  };

  const renderNavbar = () => (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => setView(AppView.HOME)}>
          <div className="bg-blue-600 p-1.5 rounded-xl shadow-lg shadow-blue-200">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">Документы<span className="text-blue-600">БезЮриста</span></span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-bold text-gray-500">
          <button onClick={() => setView(AppView.LIBRARY)} className={`hover:text-blue-600 transition-colors ${view === AppView.LIBRARY ? 'text-blue-600 font-black' : ''}`}>Библиотека</button>
          <button onClick={() => setView(AppView.TEAM)} className={`hover:text-blue-600 transition-colors ${view === AppView.TEAM ? 'text-blue-600 font-black' : ''}`}>Команда</button>
          <button onClick={() => setView(AppView.PRICING)} className={`hover:text-blue-600 transition-colors ${view === AppView.PRICING ? 'text-blue-600 font-black' : ''}`}>Тарифы</button>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
              <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-gray-900 uppercase tracking-tighter">{user.name}</p>
                      <p className={`text-[9px] font-black ${user.isPro ? 'text-blue-600' : 'text-gray-400'}`}>
                          {user.isPro ? 'PRO VERSION' : `${3 - user.docsCreated} БЕСПЛАТНО`}
                      </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm ring-2 ring-blue-50 transition-transform hover:rotate-12">
                      {user.name[0]}
                  </div>
              </div>
          ) : (
              <button onClick={() => setShowAuth(true)} className="px-6 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 hover:-translate-y-0.5">
                  Войти
              </button>
          )}
        </div>
      </div>
    </nav>
  );

  const renderHome = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans animate-in fade-in duration-700">
      {renderNavbar()}

      <div className="bg-white border-b border-gray-200 pb-24 pt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.06),transparent_40%)]"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-8 border border-blue-100 animate-bounce shadow-sm">
             <Zap className="w-3 h-3" />
             <span>AI Legal Mastery 3.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight">
            Готовые документы <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">вместо дорогих юристов</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            В нашей базе более 1000 готовых шаблонов. <br className="hidden md:block" />
            Умные контракты, налоги и HR — всё в одном месте.
          </p>
          
          <div className="max-w-2xl mx-auto relative group">
              <input 
                type="text" 
                placeholder="Поиск по 1000+ шаблонам: Резюме, NDA, Отпуск..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-gray-100 shadow-2xl focus:border-blue-500 outline-none text-xl transition-all group-hover:shadow-blue-200 group-hover:border-blue-100"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-20 flex-grow">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Популярные шаблоны</h2>
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2 max-w-full">
                {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                        activeCategory === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105' : 'bg-white border border-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                >
                    {cat}
                </button>
                ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} onSelect={handleTemplateSelect} />
          ))}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-24 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
            <div className="col-span-2">
                <div className="text-white font-black text-2xl mb-8 tracking-tighter">ДокументыБезЮриста</div>
                <p className="max-w-md leading-relaxed text-sm opacity-60">
                    Мы объединяем мощь искусственного интеллекта и экспертизу юристов РФ, чтобы вы могли строить бизнес без правовых преград и бюрократии.
                </p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-widest">Продукт</h4>
                <ul className="space-y-4 text-sm font-medium">
                    <li><button onClick={() => setView(AppView.LIBRARY)} className="hover:text-white transition-colors">Библиотека</button></li>
                    <li><button onClick={() => setView(AppView.TEAM)} className="hover:text-white transition-colors">Команда</button></li>
                    <li><button onClick={() => setView(AppView.PRICING)} className="hover:text-white transition-colors">Тарифы</button></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-widest">Юридическая часть</h4>
                <p className="text-[10px] leading-relaxed opacity-50">
                    Данный сервис не является юридической фирмой и не предоставляет прямых консультаций. Все документы требуют проверки специалистом.
                </p>
            </div>
        </div>
      </footer>
    </div>
  );

  const renderLibrary = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in slide-in-from-right-10 duration-500">
        {renderNavbar()}
        <div className="max-w-7xl mx-auto px-4 py-16 w-full">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-4">
                    <div className="bg-blue-600 p-3 rounded-2xl">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Библиотека (1000+ шаблонов)</h2>
                        <p className="text-gray-500 font-medium">Весь документооборот в одном окне</p>
                    </div>
                </div>
                <div className="hidden md:block relative">
                     <input 
                       type="text" 
                       placeholder="Быстрый поиск..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {TEMPLATES.map(t => (
                    <div 
                        key={t.id} 
                        onClick={() => handleTemplateSelect(t)}
                        className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1"
                    >
                        <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600">{t.title}</h4>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{t.category}</span>
                            <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderTeam = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-in slide-in-from-right-10 duration-500">
        {renderNavbar()}
        <div className="max-w-4xl mx-auto px-4 py-20 w-full text-center">
            <div className="bg-white p-16 rounded-[4rem] shadow-3xl border border-gray-50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full -translate-y-24 translate-x-24 opacity-50"></div>
                <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-200">
                    <Users className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Командный доступ</h2>
                <p className="text-gray-500 font-medium mb-12 max-w-lg mx-auto leading-relaxed text-lg">
                    Управляйте доступами, делитесь шаблонами с коллегами и ведите общую историю изменений.
                </p>
                
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:shadow-xl transition-all">
                        <UserPlus className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                        <p className="text-sm font-bold text-gray-900">Инвайты</p>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:shadow-xl transition-all">
                        <Settings className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                        <p className="text-sm font-bold text-gray-900">Права</p>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:shadow-xl transition-all">
                        <History className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                        <p className="text-sm font-bold text-gray-900">Версии</p>
                    </div>
                </div>

                {!user?.isPro ? (
                    <button onClick={() => setView(AppView.PRICING)} className="px-12 py-5 bg-blue-600 text-white rounded-3xl font-black text-lg shadow-3xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all">
                        ОТКРЫТЬ В PRO ТАРИФЕ
                    </button>
                ) : (
                    <div className="p-8 border-2 border-dashed border-gray-200 rounded-[3rem]">
                        <p className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-4">Ваша команда пуста</p>
                        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">
                            ДОБАВИТЬ УЧАСТНИКА
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );

  const renderPricing = () => (
    <div className="min-h-screen bg-white py-24 px-4 font-sans animate-in zoom-in-95 duration-700">
        {renderNavbar()}
        <div className="max-w-5xl mx-auto mt-16">
            <div className="text-center mb-20">
                <h2 className="text-6xl font-black text-gray-900 mb-6 tracking-tight">Тарифы</h2>
                <p className="text-xl text-gray-400 font-medium">Безопасность вашего бизнеса начинается здесь</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="p-12 rounded-[4rem] border border-gray-100 bg-gray-50 flex flex-col hover:border-blue-100 transition-all group">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Старт</h3>
                    <div className="text-5xl font-black text-gray-900 my-8 tracking-tighter">0 ₽ <span className="text-base font-bold text-gray-400">/ мес</span></div>
                    <ul className="space-y-5 mb-14 flex-grow">
                        {['3 документа бесплатно', 'Базовые шаблоны РФ', 'Экспорт в TXT', 'Безопасное хранение'].map(item => (
                            <li key={item} className="flex items-center text-gray-600 font-bold text-sm">
                                <Check className="w-5 h-5 text-green-500 mr-4" /> {item}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setView(AppView.HOME)} className="w-full py-5 rounded-3xl bg-white border-2 border-gray-200 font-black text-gray-900 hover:bg-gray-100 transition-all uppercase tracking-widest text-xs">
                        Назад на главную
                    </button>
                </div>

                <div className="p-12 rounded-[4rem] bg-slate-900 text-white flex flex-col relative overflow-hidden group hover:scale-[1.03] transition-all duration-700 shadow-[0_40px_100px_-20px_rgba(37,99,235,0.3)]">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
                    <div className="bg-blue-600 text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full w-fit mb-8 shadow-2xl shadow-blue-900 animate-pulse">Most Popular</div>
                    <h3 className="text-2xl font-black mb-2 flex items-center tracking-tight">
                        Бизнес PRO <Crown className="w-6 h-6 ml-3 text-amber-400" />
                    </h3>
                    <div className="text-6xl font-black my-8 tracking-tighter">990 ₽ <span className="text-base font-bold text-slate-500">/ мес</span></div>
                    <ul className="space-y-5 mb-14 flex-grow">
                        {[
                            'Безлимитные документы',
                            'Интеллектуальный аудит рисков',
                            'Экспорт: DOCX, PDF, TXT',
                            'Приоритет в чате 24/7',
                            'Командный доступ (до 5 чел)'
                        ].map(item => (
                            <li key={item} className="flex items-center font-bold text-sm">
                                <Check className="w-5 h-5 text-blue-400 mr-4" /> {item}
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleProUpgrade} className="w-full py-6 rounded-3xl bg-blue-600 font-black text-white shadow-3xl shadow-blue-900 hover:bg-blue-500 hover:-translate-y-1.5 transition-all uppercase tracking-widest text-sm">
                        Оформить подписку
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <>
      {view === AppView.HOME && renderHome()}
      {view === AppView.LIBRARY && renderLibrary()}
      {view === AppView.TEAM && renderTeam()}
      {view === AppView.PRICING && renderPricing()}
      {view === AppView.EDITOR && (
        <DocumentEditor 
          template={selectedTemplate} 
          user={user}
          onBack={() => setView(AppView.HOME)} 
          onDocCreated={() => user && setUser({...user, docsCreated: user.docsCreated + 1})}
        />
      )}
      {showAuth && (
        <AuthModal 
          onSuccess={onAuthSuccess} 
          onClose={() => setShowAuth(false)} 
        />
      )}
      {showLimitReached && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-2xl animate-in fade-in duration-300">
            <div className="bg-white max-w-lg w-full rounded-[4rem] p-14 text-center shadow-3xl animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 animate-bounce shadow-xl shadow-rose-100">
                    <Zap className="w-12 h-12 text-rose-500" />
                </div>
                <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tight leading-tight">Кажется, лимит исчерпан. 😳</h3>
                <p className="text-gray-500 mb-12 leading-relaxed font-bold opacity-80">
                    Вы уже создали максимальное количество документов в рамках текущего плана. 
                    Оформите подписку, чтобы продолжить работу без пауз.
                </p>
                <div className="space-y-5">
                    <button onClick={() => { setView(AppView.PRICING); setShowLimitReached(false); }} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center space-x-3">
                        <span>Оформить подписку</span>
                        <ArrowRight className="w-6 h-6" />
                    </button>
                    <button onClick={() => setShowLimitReached(false)} className="w-full py-4 text-xs font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest">
                        Закрыть окно
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default App;
