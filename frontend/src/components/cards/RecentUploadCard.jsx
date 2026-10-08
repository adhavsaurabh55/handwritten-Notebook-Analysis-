import { FileText, Eye, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';

const statusMap = {
  processing: { variant: 'warning', icon: Clock, label: 'Processing' },
  completed: { variant: 'success', icon: CheckCircle, label: 'Completed' },
  failed: { variant: 'danger', icon: AlertCircle, label: 'Failed' },
};

function RecentUploadCard({
  uploads = [],
  title = 'Recent Uploads',
  maxItems = 4,
  onViewAll,
  className = '',
}) {
  const displayUploads = uploads.slice(0, maxItems);

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {uploads.length > maxItems && onViewAll && (
          <button onClick={onViewAll} className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors">
            View all
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-50">
        {displayUploads.length > 0 ? displayUploads.map((upload, i) => {
          const status = statusMap[upload.status] || statusMap.completed;
          const StatusIcon = status.icon;
          return (
            <div key={i} className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{upload.title || `Notebook ${i + 1}`}</p>
                <div className="mt-0.5 flex items-center gap-2 flex-wrap">
                  {upload.student && <span className="text-xs text-gray-400">{upload.student}</span>}
                  {upload.date && <span className="text-xs text-gray-300 flex items-center gap-1"><Clock className="h-3 w-3" />{upload.date}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge size="xs" variant={status.variant}>
                  <StatusIcon className="h-3 w-3" />
                  <span>{status.label}</span>
                </Badge>
                <button className="p-1.5 text-gray-300 hover:text-[#4F46E5] transition-colors" aria-label="Download">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="px-6 py-8 text-center text-sm text-gray-400">No uploads yet</div>
        )}
      </div>
    </div>
  );
}

export default RecentUploadCard;

