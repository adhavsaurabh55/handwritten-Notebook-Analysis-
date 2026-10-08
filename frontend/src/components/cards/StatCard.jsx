import { TrendingUp, TrendingDown } from 'lucide-react';

const bgGradientMap = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-emerald-500 to-teal-600',
  purple: 'from-violet-500 to-purple-600',
  orange: 'from-orange-500 to-amber-600',
  rose: 'from-rose-500 to-pink-600',
  cyan: 'from-cyan-500 to-sky-600',
};

function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  bgGradient = 'blue',
  className = '',
}) {
  const isPositive = trend > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-[#10B981]' : 'text-red-500'}`}>
                <TrendIcon className="h-3.5 w-3.5" />
                {Math.abs(trend)}%
              </span>
              {trendLabel && <span className="text-xs text-gray-400">{trendLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${bgGradientMap[bgGradient]} flex items-center justify-center shadow-lg shadow-black/10 flex-shrink-0 ml-4`}>
            <span className="text-white">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;

