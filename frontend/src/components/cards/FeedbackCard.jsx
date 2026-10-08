import { MessageSquareText, Star, ThumbsUp, Clock } from 'lucide-react';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';

const scoreColorMap = {
  high: 'text-[#10B981] bg-green-50 border-green-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  low: 'text-red-600 bg-red-50 border-red-200',
};

function FeedbackCard({
  feedbacks = [],
  title = 'Latest Feedback',
  maxItems = 4,
  onViewAll,
  className = '',
}) {
  const displayFeedbacks = feedbacks.slice(0, maxItems);

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-[#4F46E5]" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        {feedbacks.length > maxItems && onViewAll && (
          <button onClick={onViewAll} className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors">
            View all
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-50">
        {displayFeedbacks.length > 0 ? displayFeedbacks.map((fb, i) => {
          const scoreKey = fb.score >= 70 ? 'high' : fb.score >= 40 ? 'medium' : 'low';
          return (
            <div key={i} className="px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start gap-3">
                {fb.student && <Avatar size="sm" name={fb.student} />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">{fb.student || 'Student'}</p>
                    {fb.score !== undefined && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${scoreColorMap[scoreKey]}`}>
                        {fb.score}%
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">{fb.feedback}</p>
                  <div className="mt-1.5 flex items-center gap-3">
                    {fb.date && <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="h-3 w-3" />{fb.date}</span>}
                    {fb.rating && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        {fb.rating}/5
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="px-6 py-8 text-center text-sm text-gray-400">No feedback yet</div>
        )}
      </div>
    </div>
  );
}

export default FeedbackCard;

