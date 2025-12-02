import { formatCurrency } from '../../utils/format';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatsCard = ({ title, value, icon: Icon, color, format, trend, trendValue }) => {
  const colorConfig = {
    green: {
      bg: 'bg-gradient-to-br from-success-500 to-success-600',
      border: 'border-success-500',
      text: 'text-success-600',
    },
    blue: {
      bg: 'bg-gradient-to-br from-primary-500 to-primary-600',
      border: 'border-primary-500',
      text: 'text-primary-600',
    },
    purple: {
      bg: 'bg-gradient-to-br from-secondary-500 to-secondary-600',
      border: 'border-secondary-500',
      text: 'text-secondary-600',
    },
    orange: {
      bg: 'bg-gradient-to-br from-warning-500 to-warning-600',
      border: 'border-warning-500',
      text: 'text-warning-600',
    },
  };

  const config = colorConfig[color] || colorConfig.blue;
  const displayValue = format === 'currency' ? formatCurrency(value) : value.toLocaleString();

  return (
    <div className={`stats-card border-l-4 ${config.border} animate-slide-up`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold ${config.text} mb-2`}>{displayValue}</p>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-success-600' : 'text-error-600'}`}>
              {trend === 'up' ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
              <span className="font-semibold">{trendValue}%</span>
              <span className="text-gray-500">vs mois dernier</span>
            </div>
          )}
        </div>
        <div className={`${config.bg} p-4 rounded-xl shadow-medium`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

