import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const chartPreviewColors = {
  blue: 'from-blue-500 to-blue-400',
  green: 'from-emerald-500 to-emerald-400',
  purple: 'from-violet-500 to-violet-400',
  orange: 'from-orange-500 to-amber-400',
};

function AnalyticsCard({
  title,
  value,
  subtitle,
  data = [],
  color = 'blue',
  trend,
  className = '',
}) {
  const maxVal = Math.max(...data, 1);
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${chartPreviewColors[color]} flex items-center justify-center shadow-lg shadow-black/10 flex-shrink-0 ml-4`}>
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Mini chart bars */}
      {data.length > 0 && (
        <div className="flex items-end gap-1 h-12 mb-3">
          {data.map((val, i) => {
            const height = Math.max((val / maxVal) * 100, 4);
            return (
              <div
                key={i}
                className={`flex-1 rounded-t-sm bg-gradient-to-t ${chartPreviewColors[color]} opacity-${i === data.length - 1 ? '90' : '50'}`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      )}

      {trend !== undefined && (
        <div className="flex items-center gap-1.5 text-xs">
          <TrendIcon className={`h-3.5 w-3.5 ${trend > 0 ? 'text-[#10B981]' : trend < 0 ? 'text-red-500' : 'text-gray-400'}`} />
          <span className={`font-medium ${trend > 0 ? 'text-[#10B981]' : trend < 0 ? 'text-red-500' : 'text-gray-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
}

export default AnalyticsCard;

