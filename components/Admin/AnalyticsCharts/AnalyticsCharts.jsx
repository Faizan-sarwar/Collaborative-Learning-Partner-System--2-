import React from 'react';
import styles from '../AnalyticsCharts/AnalyticsCharts.module.css';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const registrationData = [
  { month: 'Jan', students: 120 },
  { month: 'Feb', students: 180 },
  { month: 'Mar', students: 240 },
  { month: 'Apr', students: 310 },
  { month: 'May', students: 280 },
  { month: 'Jun', students: 420 },
  { month: 'Jul', students: 380 },
];

const courseEngagementData = [
  { name: 'Mathematics', enrolled: 450, completed: 320 },
  { name: 'Physics', enrolled: 380, completed: 290 },
  { name: 'Chemistry', enrolled: 320, completed: 240 },
  { name: 'Biology', enrolled: 280, completed: 200 },
  { name: 'English', enrolled: 420, completed: 350 },
];

const studentStatusData = [
  { name: 'Active', value: 2156, color: '#10B981' },
  { name: 'Inactive', value: 668, color: '#F59E0B' },
  { name: 'Blocked', value: 23, color: '#EF4444' },
];

const AnalyticsCharts = () => {
  return (
    <div className={styles.chartsGrid}>
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3>Student Registrations</h3>
          <span className={styles.chartSubtitle}>Last 7 months</span>
        </div>
        <div className={styles.chartContent}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={registrationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} />
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

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3>Course Engagement</h3>
          <span className={styles.chartSubtitle}>Enrolled vs Completed</span>
        </div>
        <div className={styles.chartContent}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={courseEngagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="enrolled" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3>Student Status</h3>
          <span className={styles.chartSubtitle}>Distribution overview</span>
        </div>
        <div className={styles.chartContent}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={studentStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {studentStatusData.map((entry, index) => (
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
