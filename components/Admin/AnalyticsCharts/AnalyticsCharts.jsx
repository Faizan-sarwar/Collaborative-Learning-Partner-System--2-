import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { TrendingUp, BookOpen, PieChart as PieIcon, Loader2, AlertCircle } from 'lucide-react';
import styles from './AnalyticsCharts.module.css';

const AnalyticsCharts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🟢 FETCH DATA SECURELY
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // Prevent unnecessary network request if auth is missing
        if (!token) {
          throw new Error("Authentication token missing.");
        }

        const res = await fetch(`http://${window.location.hostname}:5000/api/auth/admin/analytics`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const json = await res.json();

        if (json.success) {
          setData(json.data);
        } else {
          throw new Error(json.message || "Failed to load data");
        }
      } catch (err) {
        console.error("Analytics Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={32} />
        <p>Analyzing platform data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={32} />
        <p>Failed to load analytics: {error}</p>
      </div>
    );
  }

  // 🟢 SAFE FALLBACKS
  const registrationData = data?.registrations?.length ? data.registrations : [{ month: 'No Data', students: 0 }];
  const courseData = data?.courses?.length ? data.courses : [{ name: 'No Data', count: 0 }];
  
  const statusData = data?.status?.length ? data.status : [
    { name: 'Active', value: 0, color: '#10B981' },
    { name: 'Inactive', value: 0, color: '#F59E0B' },
    { name: 'Blocked', value: 0, color: '#EF4444' }
  ];

  // 🟢 ENTERPRISE CUSTOM TOOLTIP
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className={styles.tooltipData} style={{ color: entry.color }}>
              {entry.name === 'students' || entry.name === 'count' ? 'Total' : entry.name}: <strong>{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartsGrid}>

      {/* 1. REGISTRATIONS AREA CHART (Upgraded from LineChart) */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div className={styles.headerTitle}>
            <div className={styles.iconWrapper} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <TrendingUp size={18} />
            </div>
            <div>
              <h3>Student Registrations</h3>
              <span className={styles.chartSubtitle}>Last 6 months growth trend</span>
            </div>
          </div>
        </div>
        <div className={styles.chartContent}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={registrationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--text-secondary)" fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="students" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorStudents)" 
                activeDot={{ r: 6, fill: '#3b82f6', stroke: 'var(--bg-secondary)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. ACADEMIC STRENGTHS BAR CHART */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div className={styles.headerTitle}>
            <div className={styles.iconWrapper} style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
              <BookOpen size={18} />
            </div>
            <div>
              <h3>Top Academic Strengths</h3>
              <span className={styles.chartSubtitle}>Users excelling per subject</span>
            </div>
          </div>
        </div>
        <div className={styles.chartContent}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={courseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="var(--text-secondary)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
                tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value} // Prevents long name clipping
              />
              <YAxis stroke="var(--text-secondary)" fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar 
                dataKey="count" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]} 
                name="Total Students"
                maxBarSize={40} // Prevents bars from becoming massive if there's only 1 item
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. STATUS DONUT CHART */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div className={styles.headerTitle}>
            <div className={styles.iconWrapper} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <PieIcon size={18} />
            </div>
            <div>
              <h3>Account Status</h3>
              <span className={styles.chartSubtitle}>Active vs Inactive vs Blocked</span>
            </div>
          </div>
        </div>
        <div className={styles.chartContent}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsCharts;