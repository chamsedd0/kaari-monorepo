import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { PerformanceChartStyling } from '../../../styles/constructed/chart/performance-chart-styling';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface DataPoint {
  date: string;
  views: number;
  clicks: number;
  bookings: number;
}

interface PerformanceChartProps {
  title?: string;
  viewCount?: number;
  inquiryCount?: number;
  bookingCount?: number;
  loading?: boolean;
}

const data: DataPoint[] = [
  { date: '1 Apr', views: 1200, clicks: 800, bookings: 60 },
  { date: '8 Apr', views: 600, clicks: 1300, bookings: 275 },
  { date: '15 Apr', views: 1900, clicks: 900, bookings: 565 },
  { date: '22 Apr', views: 900, clicks: 1700, bookings: 80 },
  { date: '29 Apr', views: 1500, clicks: 1200, bookings: 1985 },
];

// Custom dot component for better control over the appearance
const CustomDot = (props: any) => {
  const { cx, cy, stroke, value } = props;
  
  // Only show dots if we have a value
  if (value) {
    return (
      <circle cx={cx} cy={cy} r={3} fill={stroke} stroke={stroke} strokeWidth={0} />
    );
  }
  return null;
};

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  title,
  viewCount = 1500,
  inquiryCount = 1200,
  bookingCount = 85,
  loading = false
}) => {
  const { t } = useTranslation();
  
  return (
    <PerformanceChartStyling>
      <div className="chart-info">
        <div className="header">
            <h2 className="title">{title || t('advertiser_dashboard.dashboard.performance_overview', 'Listing Performance')}</h2>
            <div className="date">{t('advertiser_dashboard.dashboard.chart_date', 'April 2025')}</div>
        </div>

        <div className="metrics">
            <div className="metric">
            <div className="value views">
              <FiArrowUp className="trend-icon up" />
                <span className="value-number">{viewCount}</span>
                
            </div>
            <div className="label">{t('advertiser_dashboard.dashboard.views', 'Views')}</div>
            </div>
            <div className="metric">
            <div className="value clicks">
              <FiArrowDown className="trend-icon down" />
                  <span className="value-number">{inquiryCount}</span>
                
            </div>
            <div className="label">{t('advertiser_dashboard.dashboard.clicks', 'Clicks')}</div>
            </div>
            <div className="metric">
            <div className="value bookings">
              <FiArrowUp className="trend-icon up" />
                <span className="value-number">{bookingCount}</span>
                
            </div>
            <div className="label">{t('advertiser_dashboard.dashboard.booking_requests', 'Booking Requests')}</div>
            </div>
        </div>
      </div>

      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8F27CE" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#8F27CE" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0595C3" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#0595C3" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#29822D" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#29822D" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <XAxis 
              hide={true}
            />
            <YAxis 
              hide={true}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#8F27CE"
              fill="url(#colorViews)"
              strokeWidth={1}
              dot={<CustomDot />}
              isAnimationActive={false}
              activeDot={{ r: 6, fill: "white", stroke: "#8F27CE", strokeWidth: 1 }}
              connectNulls={true}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#0595C3"
              fill="url(#colorClicks)"
              strokeWidth={1}
              dot={<CustomDot />}
              isAnimationActive={false}
              activeDot={{ r: 6, fill: "white", stroke: "#0595C3", strokeWidth: 1 }}
              connectNulls={true}
            />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="#29822D"
              fill="url(#colorBookings)"
              strokeWidth={1}
              dot={<CustomDot />}
              isAnimationActive={false}
              activeDot={{ r: 6, fill: "white", stroke: "#29822D", strokeWidth: 1 }}
              connectNulls={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </PerformanceChartStyling>
  );
};
