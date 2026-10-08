import { ShieldAlert, AlertTriangle, Eye, CheckCircle } from 'lucide-react';
import Badge from '../common/Badge';

const severityMap = {
  high: { variant: 'danger', label: 'High', barColor: 'bg-red-500' },
  medium: { variant: 'warning', label: 'Medium', barColor: 'bg-yellow-500' },
  low: { variant: 'info', label: 'Low', barColor: 'bg-blue-500' },
};

function PlagiarismAlertCard({
  alerts = [],
  title = 'Plagiarism Alerts',
  maxItems = 4,
  onViewAll,
  className = '',
}) {
  const displayAlerts = alerts.slice(0, maxItems);

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        {alerts.length > maxItems && onViewAll && (
          <button onClick={onViewAll} className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors">
            View all
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-50">
        {displayAlerts.length > 0 ? displayAlerts.map((alert, i) => {
          const severity = severityMap[alert.severity] || severityMap.medium;
          return (
            <div key={i} className="px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  alert.severity === 'high' ? 'bg-red-50 border border-red-100' :
                  alert.severity === 'medium' ? 'bg-yellow-50 border border-yellow-100' :
                  'bg-blue-50 border border-blue-100'
                }`}>
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.severity === 'high' ? 'text-red-500' :
                    alert.severity === 'medium' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{alert.student || 'Student'}</p>
                    <Badge size="xs" variant={severity.variant}>{severity.label}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Matched with <span className="font-medium text-gray-700">{alert.matchedWith || 'another submission'}</span>
                  </p>
                  {/* Similarity bar */}
                  {alert.percentage !== undefined && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${severity.barColor} rounded-full`} style={{ width: `${alert.percentage}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-500">{alert.percentage}%</span>
                    </div>
                  )}
                </div>
                <button className="p-1.5 text-gray-300 hover:text-[#4F46E5] transition-colors flex-shrink-0 self-center" aria-label="Review">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="px-6 py-8 text-center text-sm text-gray-400 flex flex-col items-center gap-2">
            <CheckCircle className="h-8 w-8 text-[#10B981]" />
            No plagiarism alerts
          </div>
        )}
      </div>
    </div>
  );
}

export default PlagiarismAlertCard;

