import React from 'react';
import { Calendar, Clock, FileText } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  due_date: string;
  type: {
    name: string;
    icon: string;
    color: string;
  };
}

interface ActivityListProps {
  activities: Activity[];
  loading: boolean;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 animate-pulse h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Nenhuma atividade encontrada
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {activities.map(activity => (
        <div 
          key={activity.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {activity.title}
            </h3>
            <span 
              className="px-2 py-1 text-xs font-medium rounded-full"
              style={{ 
                backgroundColor: `${activity.type.color}20`,
                color: activity.type.color 
              }}
            >
              {activity.type.name}
            </span>
          </div>

          {activity.description && (
            <div className="flex items-start gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
              <FileText className="w-4 h-4 mt-0.5" />
              <p>{activity.description}</p>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(activity.due_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(activity.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;