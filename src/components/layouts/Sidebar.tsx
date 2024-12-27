import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Target, 
  Building2, 
  BarChart3,
  Mail,
  HeadphonesIcon,
  Briefcase,
  Settings,
  User,
  LogOut,
  ListTodo,
  Users
} from 'lucide-react';
import ThemeToggle from '../theme/ThemeToggle';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import { useToastStore } from '../../stores/toastStore';
import AnimatedLogo from '../common/AnimatedLogo';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const addToast = useToastStore(state => state.addToast);

  const navItems = [
    { to: '/comercial', icon: Briefcase, label: 'Comercial' },
    { to: '/atividades', icon: ListTodo, label: 'Atividades' },
    { to: '/contatos', icon: Users, label: 'Contatos' },
    { to: '/marketing', icon: Mail, label: 'Marketing' },
    { to: '/atendimento', icon: HeadphonesIcon, label: 'Atendimento' },
    { to: '/operacional', icon: Settings, label: 'Operacional' },
    { to: '/relatorios', icon: BarChart3, label: 'Relatórios' },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      addToast('Logout realizado com sucesso!', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      addToast('Erro ao fazer logout', 'error');
    }
  };

  return (
    <aside className="bg-white dark:bg-gray-800 h-screen w-16 border-r border-gray-200 dark:border-gray-700 fixed left-0 top-0 flex flex-col">
      <div className="p-3 flex-1">
        <div className="mb-6">
          <ThemeToggle />
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-center p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`
              }
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center p-2 w-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;