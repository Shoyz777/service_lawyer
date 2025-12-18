export enum AppView {
  HOME = 'HOME',
  EDITOR = 'EDITOR',
  PRICING = 'PRICING',
  LIBRARY = 'LIBRARY',
  TEAM = 'TEAM',
  AUTH = 'AUTH'
}

export type CategoryType = 
  | 'Недвижимость' 
  | 'Услуги' 
  | 'Деньги' 
  | 'Работа' 
  | 'Бизнес' 
  | 'Семья' 
  | 'Сайт' 
  | 'Налоговая' 
  | 'Накладные'
  | 'Внутренние'
  | 'Резюме'
  | 'Для работодателя'
  | 'Документы HR';

export interface User {
  id: string;
  email: string;
  name: string;
  docsCreated: number;
  isPro: boolean;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  complexity: 'Простой' | 'Средний' | 'Сложный';
  icon: string;
  tags?: string[];
  requiredInfo: string[]; // Уникальные вопросы для этого шаблона
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  isRiskAnalysis?: boolean;
}
