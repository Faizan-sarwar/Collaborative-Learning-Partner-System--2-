import React, { useEffect, useState, useRef } from 'react';
import { 
  Search, RefreshCw, FileSpreadsheet, FileText, 
  ChevronLeft, ChevronRight, ShieldAlert, Loader2, Info
} from 'lucide-react';
import styles from './ActivityLogs.module.css';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Increased to 15 for better desktop usage
  const syncInterval = useRef(null);

  //  SECURE FETCH (Supports silent background syncing)
  const fetchLogs = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error("Authentication token missing.");

      const res = await fetch(`http://${window.location.hostname}:5000/api/activity-logs`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setLogs(data);
      } else if (data.success === false) {
        throw new Error(data.message || "Failed to load logs");
      }
    } catch (err) {
      console.error('Activity logs error:', err);
      if (logs.length === 0) setError(err.message);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  //  AUTO-REFRESH ENGINE
  useEffect(() => {
    fetchLogs(false); 
    syncInterval.current = setInterval(() => {
      fetchLogs(true);
    }, 10000); // Polling every 10s is safer for enterprise apps

    return () => {
      if (syncInterval.current) clearInterval(syncInterval.current);
    };
  }, []);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  //  FILTERING LOGIC
  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.createdAt);
    if (logDate < sevenDaysAgo) return false;

    const term = searchTerm.toLowerCase();
    const action = log.action ? log.action.toLowerCase() : '';
    const user = log.user ? log.user.toLowerCase() : '';
    const type = log.userType ? log.userType.toLowerCase() : '';
    const ip = log.ip ? log.ip.toLowerCase() : '';

    const matchesSearch = action.includes(term) || user.includes(term) || type.includes(term) || ip.includes(term);

    const matchesFilter = filter === 'all' || 
                          (log.userType && log.userType === filter) || 
                          (log.status && log.status === filter);

    return matchesSearch && matchesFilter;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  //  EXPORT TO EXCEL
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

    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
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

  //  XSS SANITIZER FOR PDF
  const escapeHTML = (str) => {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  //  SECURE PDF EXPORT
  const handleExportPDF = () => {
    if (filteredLogs.length === 0) return alert("No logs to export");

    const printWindow = window.open('', '_blank');
    let html = `
      <html>
        <head>
          <title>Activity Logs - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h2 { text-align: center; color: #111; margin-bottom: 5px; }
            .meta { text-align: center; margin-bottom: 20px; color: #666; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f8fafc; font-weight: bold; color: #0f172a; text-transform: uppercase; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .status-success { color: #10b981; font-weight: bold; }
            .status-failed { color: #ef4444; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>System Activity Logs</h2>
          <div class="meta">Generated on: ${new Date().toLocaleString()} | Filter: Last 7 Days</div>
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
          <td>${escapeHTML(log.action)}</td>
          <td>${escapeHTML(log.user || 'Unknown')}</td>
          <td>${escapeHTML((log.userType || 'unknown').toUpperCase())}</td>
          <td>${escapeHTML(log.ip || 'N/A')}</td>
          <td>${new Date(log.createdAt).toLocaleString()}</td>
          <td class="${statusClass}">${escapeHTML(log.status.toUpperCase())}</td>
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

  const getStatusClass = (status) => status === 'success' ? styles.success : styles.failed;

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
        <div className={styles.headerActions}>
          <button className={`${styles.actionBtn} ${styles.btnRefresh}`} onClick={() => fetchLogs(false)}>
            <RefreshCw size={16} /> Sync
          </button>
          <button className={`${styles.actionBtn} ${styles.btnExcel}`} onClick={handleExportExcel}>
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button className={`${styles.actionBtn} ${styles.btnPdf}`} onClick={handleExportPDF}>
            <FileText size={16} /> PDF
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by user, action, IP..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
          />
        </div>

        <div className={styles.filterButtons}>
          {['all', 'admin', 'student', 'system', 'success', 'failed'].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`}
              onClick={() => {
                setFilter(f);
                setCurrentPage(1);
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className={styles.centerStateCard}>
            <ShieldAlert size={32} color="#ef4444" />
            <p className={styles.errorText}>{error}</p>
        </div>
      ) : (
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
                {loading && currentLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                        <div className={styles.tableCenterState}>
                            <Loader2 size={24} className={styles.spinner} />
                            <span>Loading logs...</span>
                        </div>
                    </td>
                  </tr>
                ) : currentLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                        <div className={styles.tableCenterState}>
                            <Info size={24} color="var(--text-muted)" />
                            <span>No activity found matching your criteria.</span>
                        </div>
                    </td>
                  </tr>
                ) : (
                  currentLogs.map((log) => (
                    <tr key={log._id}>
                      <td className={styles.actionCell}>{log.action}</td>
                      <td className={styles.userCell}>{log.user || 'Unknown User'}</td>
                      <td>
                        <span className={`${styles.badge} ${getUserTypeClass(log.userType)}`}>
                          {log.userType === 'unknown' ? 'Visitor' : log.userType}
                        </span>
                      </td>
                      <td className={styles.ipCell}>{log.ip}</td>
                      <td className={styles.timeCell}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <span className={`${styles.badge} ${getStatusClass(log.status)}`}>
                          <span className={styles.statusDot}></span>
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
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            <ChevronLeft size={16} /> Prev
            </button>

            <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                .map((pageNum, index, arr) => (
                <React.Fragment key={pageNum}>
                    {index > 0 && pageNum > arr[index - 1] + 1 && <span className={styles.ellipsis}>...</span>}
                    <button
                    className={`${styles.pageNum} ${currentPage === pageNum ? styles.activePage : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                    >
                    {pageNum}
                    </button>
                </React.Fragment>
                ))
            }
            </div>

            <button className={styles.pageBtn} disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            Next <ChevronRight size={16} />
            </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;