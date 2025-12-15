import React, { useEffect, useState } from 'react';
import styles from './ActivityLogs.module.css';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 🔹 Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔹 Fetch logs from backend
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/activity-logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch activity logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 🔹 Filtering Logic
  const filteredLogs = logs.filter((log) => {
    const action = log.action ? log.action.toLowerCase() : '';
    const user = log.user ? log.user.toLowerCase() : '';
    const term = searchTerm.toLowerCase();

    const matchesSearch = action.includes(term) || user.includes(term);

    const matchesFilter =
      filter === 'all' ||
      (log.userType && log.userType === filter) ||
      (log.status && log.status === filter);

    return matchesSearch && matchesFilter;
  });

  // 🔹 Pagination Logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 🔹 Export to CSV Logic
  const handleExport = () => {
    if (filteredLogs.length === 0) return alert("No logs to export");

    // define headers
    const headers = ["Action", "User", "Type", "IP Address", "Time", "Status"];
    
    // map data to CSV rows
    const rows = filteredLogs.map(log => [
      `"${log.action}"`, // Quote strings to handle commas inside text
      `"${log.user || 'Unknown'}"`,
      log.userType || 'Unknown',
      log.ip || 'N/A',
      new Date(log.createdAt).toLocaleString().replace(/,/g, ''), // Remove commas from date
      log.status
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","), 
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `activity_logs_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            {filteredLogs.length} entries
          </span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.refreshBtn} onClick={fetchLogs} title="Refresh Logs">
            ↻
          </button>
          <button className={styles.exportBtn} onClick={handleExport}>
            Export Logs
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search logs..."
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
                    No activity found
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
                // Limit page numbers shown (e.g., current page, first, last) for simplicity in large datasets
                .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                .map((pageNum, index, arr) => (
                    <React.Fragment key={pageNum}>
                        {/* Add ellipsis if there's a gap */}
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