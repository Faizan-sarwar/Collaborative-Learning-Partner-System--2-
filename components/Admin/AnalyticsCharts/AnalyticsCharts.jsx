import React, { useState, useEffect } from 'react';
import styles from './AnalyticsCharts.module.css';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const AnalyticsCharts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Real Data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/admin/analytics');
        const json = await res.json();
        
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading charts...</div>;
  }

  // Fallback if data is empty (prevents crashes)
  const registrationData = data?.registrations?.length ? data.registrations : [{ month: 'No Data', students: 0 }];
  const courseData = data?.courses?.length ? data.courses : [{ name: 'No Courses', enrolled: 0, completed: 0 }];
  const statusData = data?.status || [
    { name: 'Active', value: 0, color: '#10B981' },
    { name: 'Inactive', value: 0, color: '#F59E0B' },
    { name: 'Blocked', value: 0, color: '#EF4444' }
  ];

  return (
    <div className={styles.chartsGrid}>
      
      {/* 1. REGISTRATIONS CHART */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3>Student Registrations</h3>
          <span className={styles.chartSubtitle}>Last 6 months trend</span>
        </div>
        <div className={styles.chartContent}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={registrationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ fill: '#6366F1', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. COURSE ENGAGEMENT CHART */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3>Course Engagement</h3>
          <span className={styles.chartSubtitle}>Enrolled vs Estimated Completion</span>
        </div>
        <div className={styles.chartContent}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tick={{width: 100}} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="enrolled" fill="#6366F1" radius={[4, 4, 0, 0]} name="Enrolled" />
              <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} name="Completed (Est.)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. STATUS PIE CHART */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3>Student Status</h3>
          <span className={styles.chartSubtitle}>Active vs Inactive vs Blocked</span>
        </div>
        <div className={styles.chartContent}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;