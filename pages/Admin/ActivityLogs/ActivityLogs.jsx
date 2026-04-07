import React, { useEffect, useState, useRef } from 'react';
import styles from './ActivityLogs.module.css';

const ActivityLogs = () => {
const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const syncInterval = useRef(null);

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  // 🟢 FETCH LOGS (Supports silent background syncing)
  const fetchLogs = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/activity-logs', {
        headers: { 
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      
      // 🟢 SAFETY CHECK: Prevents the blank screen crash!
      if (Array.isArray(data)) {
        setLogs(data);
      } else if (data.success === false) {
        console.error("API Blocked:", data.message);
        setLogs([]); // Keep it from crashing
      }
    } catch (err) {
      console.error('Failed to fetch activity logs', err);
      setLogs([]); 
    } finally {
      if (!isBackground) setLoading(false);
    }
  };F

  // 🟢 AUTO-REFRESH ENGINE (Every 5 seconds)
  useEffect(() => {
    fetchLogs(false); // Initial load with spinner

    // Set up silent background polling
    syncInterval.current = setInterval(() => {
      fetchLogs(true);
    }, 5000);

    return () => {
      if (syncInterval.current) clearInterval(syncInterval.current);
    };
  }, []);

  // Calculate the date from exactly 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Filtering Logic
  const filteredLogs = logs.filter((log) => {
    // 1. TIME FILTER: Exclude anything older than 7 days
    const logDate = new Date(log.createdAt);
    if (logDate < sevenDaysAgo) return false;

    // 2. ENHANCED SEARCH
    const term = searchTerm.toLowerCase();
    const action = log.action ? log.action.toLowerCase() : '';
    const user = log.user ? log.user.toLowerCase() : '';
    const type = log.userType ? log.userType.toLowerCase() : '';
    const ip = log.ip ? log.ip.toLowerCase() : '';

    const matchesSearch =
      action.includes(term) ||
      user.includes(term) ||
      type.includes(term) ||
      ip.includes(term);

    // 3. BUTTON FILTER
    const matchesFilter =
      filter === 'all' ||
      (log.userType && log.userType === filter) ||
      (log.status && log.status === filter);

    return matchesSearch && matchesFilter;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 🟢 EXPORT TO EXCEL (CSV format with BOM for perfect Excel rendering)
  const handleExportExcel = () => {
    if (filteredLogs.length === 0) return alert("No logs to export");

    const headers = ["Action", "User", "Type", "IP Address", "Time", "Status"];

    const rows = filteredLogs.map(log => [
      `"${log.action}"`,
      `"${log.user || 'Unknown'}"`,
      log.userType || 'Unknown',
      log.ip || 'N/A',
      `"${new Date(log.createdAt).toLocaleString()}"`,
      log.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Add BOM (\uFEFF) to ensure Excel opens it in UTF-8 without weird characters
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `Activity_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🟢 EXPORT TO PDF (Generates a clean print-ready layout)
  const handleExportPDF = () => {
    if (filteredLogs.length === 0) return alert("No logs to export");

    const printWindow = window.open('', '_blank');

    let html = `
      <html>
        <head>
          <title>Activity Logs - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h2 { text-align: center; color: #111; }
            .meta { text-align: center; margin-bottom: 20px; color: #666; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f4f4f4; font-weight: bold; color: #000; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .status-success { color: green; font-weight: bold; }
            .status-failed { color: red; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>System Activity Logs</h2>
          <div class="meta">Generated on: ${new Date().toLocaleString()} | Showing Last 7 Days</div>
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Type</th>
                <th>IP Address</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredLogs.forEach(log => {
      const statusClass = log.status === 'success' ? 'status-success' : 'status-failed';
      html += `
        <tr>
          <td>${log.action}</td>
          <td>${log.user || 'Unknown'}</td>
          <td>${(log.userType || 'unknown').toUpperCase()}</td>
          <td>${log.ip || 'N/A'}</td>
          <td>${new Date(log.createdAt).toLocaleString()}</td>
          <td class="${statusClass}">${log.status.toUpperCase()}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const getStatusClass = (status) =>
    status === 'success' ? styles.success : styles.failed;

  const getUserTypeClass = (userType) => {
    switch (userType) {
      case 'admin': return styles.admin;
      case 'student': return styles.student;
      case 'system': return styles.system;
      default: return styles.unknown;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Activity Logs</h2>
          <span className={styles.count}>
            {filteredLogs.length} entries (Last 7 Days)
          </span>
        </div>
        <div className={styles.headerActions} style={{ display: 'flex', gap: '10px' }}>
          {/* 🟢 NEW: Beautifully styled Refresh button matching the theme */}
          <button
            className={styles.exportBtn}
            onClick={() => fetchLogs(false)}
            style={{ backgroundColor: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 1 0 2.13-5.83L21 8"></path>
            </svg>
            Refresh
          </button>

          {/* 🟢 UPDATED: Excel button with matching SVG icon */}
          <button
            className={styles.exportBtn}
            onClick={handleExportExcel}
            style={{ backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Excel
          </button>

          {/* 🟢 UPDATED: PDF button with matching SVG icon */}
          <button
            className={styles.exportBtn}
            onClick={handleExportPDF}
            style={{ backgroundColor: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            PDF
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by user, action, IP..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
          />
        </div>

        <div className={styles.filterButtons}>
          {['all', 'admin', 'student', 'system', 'success', 'failed'].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => {
                setFilter(f);
                setCurrentPage(1); // Reset to page 1 on filter change
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.logsCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Type</th>
                <th>IP Address</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    Loading...
                  </td>
                </tr>
              ) : currentLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    No activity found in the last 7 days.
                  </td>
                </tr>
              ) : (
                currentLogs.map((log) => (
                  <tr key={log._id}>
                    <td>{log.action}</td>
                    <td>{log.user || 'Unknown User'}</td>
                    <td>
                      <span className={`${styles.userType} ${getUserTypeClass(log.userType)}`}>
                        {log.userType === 'unknown' ? 'Visitor' : log.userType}
                      </span>
                    </td>
                    <td>{log.ip}</td>
                    <td>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <span className={`${styles.status} ${getStatusClass(log.status)}`}>
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>

        <div className={styles.pageNumbers}>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
            .map((pageNum, index, arr) => (
              <React.Fragment key={pageNum}>
                {index > 0 && pageNum > arr[index - 1] + 1 && <span className={styles.ellipsis}>...</span>}
                <button
                  className={`${styles.pageNum} ${currentPage === pageNum ? styles.active : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              </React.Fragment>
            ))
          }
        </div>

        <button
          className={styles.pageBtn}
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActivityLogs;