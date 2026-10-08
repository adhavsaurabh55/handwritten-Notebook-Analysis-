import { Clock, ArrowRight } from 'lucide-react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';

function ActivityCard({
  activities = [],
  title = 'Recent Activity',
  maxItems = 5,
  onViewAll,
  className = '',
}) {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {activities.length > maxItems && onViewAll && (
          <button onClick={onViewAll} className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors">
            View all
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-50">
        {displayActivities.length > 0 ? displayActivities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3 px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
            {activity.avatar && <Avatar size="sm" {...activity.avatar} />}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                {activity.text}
              </p>
              <div className="mt-0.5 flex items-center gap-2">
                {activity.badge && <Badge size="xs" variant={activity.badge.variant}>{activity.badge.label}</Badge>}
                {activity.time && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </span>
                )}
              </div>
            </div>
            {activity.action && (
              <button onClick={activity.action} className="text-gray-300 hover:text-[#4F46E5] transition-colors flex-shrink-0">
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )) : (
          <div className="px-6 py-8 text-center text-sm text-gray-400">No recent activity</div>
        )}
      </div>
    </div>
  );
}

export default ActivityCard;

