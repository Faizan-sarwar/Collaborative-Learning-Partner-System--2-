import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './MiniCalendar.module.css';

const MiniCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayEvents, setDayEvents] = useState([]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // 🟢 ENTERPRISE LOGIC: Fetch actual deadlines for the selected date
  useEffect(() => {
    const fetchEventsForDate = () => {
      // Format selected date to match standard HTML date input format (YYYY-MM-DD)
      const offset = selectedDate.getTimezoneOffset() * 60000;
      const formattedDate = (new Date(selectedDate - offset)).toISOString().split('T')[0];

      // In a full full-stack setup, this would be: fetch(`/api/events?date=${formattedDate}`)
      // For now, we sync it with the localStorage 'deadlines' from your UpcomingDeadlines component
      const savedDeadlines = JSON.parse(localStorage.getItem('deadlines') || '[]');
      
      const eventsToday = savedDeadlines.filter(deadline => deadline.date === formattedDate);
      setDayEvents(eventsToday);
    };

    fetchEventsForDate();

    // Listen for updates if the user adds a deadline in another widget
    window.addEventListener('deadlinesUpdated', fetchEventsForDate);
    return () => window.removeEventListener('deadlinesUpdated', fetchEventsForDate);
  }, [selectedDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    return day === selectedDate.getDate() && 
           currentDate.getMonth() === selectedDate.getMonth() && 
           currentDate.getFullYear() === selectedDate.getFullYear();
  };

  // Check if a specific day has events (to show a dot indicator)
  const hasEvents = (day) => {
    if (!day) return false;
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const offset = targetDate.getTimezoneOffset() * 60000;
    const formattedStr = (new Date(targetDate - offset)).toISOString().split('T')[0];
    const savedDeadlines = JSON.parse(localStorage.getItem('deadlines') || '[]');
    return savedDeadlines.some(d => d.date === formattedStr);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.navBtn} onClick={prevMonth}>
          <ChevronLeft size={18} />
        </button>
        <h3 className={styles.monthTitle}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button className={styles.navBtn} onClick={nextMonth}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className={styles.daysHeader}>
        {daysOfWeek.map((day, index) => (
          <span key={index} className={styles.dayLabel}>{day}</span>
        ))}
      </div>

      <div className={styles.daysGrid}>
        {getDaysInMonth(currentDate).map((day, index) => (
          <motion.button
            key={index}
            className={`${styles.dayBtn} ${day ? '' : styles.empty} ${isToday(day) ? styles.today : ''} ${isSelected(day) ? styles.selected : ''}`}
            onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
            whileHover={day ? { scale: 1.1 } : {}}
            whileTap={day ? { scale: 0.95 } : {}}
          >
            <span>{day}</span>
            {hasEvents(day) && !isSelected(day) && <div className={styles.eventDot} />}
          </motion.button>
        ))}
      </div>

      <div className={styles.footer}>
        <AnimatePresence mode="wait">
          {dayEvents.length === 0 ? (
            <motion.div 
              key="empty"
              className={styles.agendaItem}
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            >
              <div className={styles.agendaIconWrapper}>
                <CalendarIcon size={20} className={styles.emptyIcon} />
              </div>
              <div className={styles.agendaContent}>
                <h4>No deadlines today</h4>
                <p>Your schedule is clear. Enjoy your day or focus on general studying.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="events"
              className={styles.agendaItem}
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            >
              <div className={`${styles.agendaIconWrapper} ${styles.hasEvents}`}>
                <CheckCircle2 size={20} className={styles.activeIcon} />
              </div>
              <div className={styles.agendaContent}>
                <h4>{dayEvents.length} Deadline{dayEvents.length > 1 ? 's' : ''}</h4>
                <p className={styles.eventTitle}>{dayEvents[0].title}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button className={styles.openBtn} onClick={() => navigate('/dashboard')}>
           View Full Calendar <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default MiniCalendar;