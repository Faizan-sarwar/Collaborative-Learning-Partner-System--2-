// import React from 'react';
// import { motion } from 'framer-motion';
// import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
// import styles from './Social.module.css';

// const studyGroups = [
//   { id: 1, name: 'Math Study Group', members: 5, active: true },
//   { id: 2, name: 'Physics Lab Partners', members: 3, active: true },
//   { id: 3, name: 'CS Project Team', members: 4, active: false },
// ];

// const Social = () => {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   return (
//     <DashboardLayout title="Social">
//       <motion.div
//         className={styles.container}
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         <motion.div className={styles.header} variants={itemVariants}>
//           <h1 className={styles.title}>Study Partners & Groups</h1>
//           <p className={styles.subtitle}>Connect with fellow students and form study groups</p>
//         </motion.div>

//         <div className={styles.grid}>
//           <motion.div className={styles.section} variants={itemVariants}>
//             <h2 className={styles.sectionTitle}>Find Study Partners</h2>
//             <div className={styles.searchCard}>
//               <div className={styles.searchIcon}>🔍</div>
//               <input 
//                 type="text" 
//                 placeholder="Search by subject, skill, or name..."
//                 className={styles.searchInput}
//               />
//               <button className={styles.searchBtn}>Search</button>
//             </div>
//             <div className={styles.filters}>
//               <button className={styles.filterBtn}>All Subjects</button>
//               <button className={styles.filterBtn}>Same Semester</button>
//               <button className={styles.filterBtn}>Online Now</button>
//             </div>
//             <div className={styles.emptyState}>
//               <span className={styles.emptyIcon}>👋</span>
//               <p>No study partners found yet</p>
//               <span className={styles.emptyHint}>Try searching or updating your profile to match with others</span>
//             </div>
//           </motion.div>

//           <motion.div className={styles.section} variants={itemVariants}>
//             <h2 className={styles.sectionTitle}>My Study Groups</h2>
//             <div className={styles.groupsList}>
//               {studyGroups.map(group => (
//                 <div key={group.id} className={styles.groupCard}>
//                   <div className={styles.groupInfo}>
//                     <div className={`${styles.groupStatus} ${group.active ? styles.active : ''}`} />
//                     <div>
//                       <h3>{group.name}</h3>
//                       <p>{group.members} members</p>
//                     </div>
//                   </div>
//                   <button className={styles.joinBtn}>View</button>
//                 </div>
//               ))}
//             </div>
//             <button className={styles.createGroupBtn}>
//               <span>+</span> Create New Group
//             </button>
//           </motion.div>
//         </div>

//         <motion.div className={styles.activitySection} variants={itemVariants}>
//           <h2 className={styles.sectionTitle}>Recent Activity</h2>
//           <div className={styles.activityEmpty}>
//             <span className={styles.emptyIcon}>📭</span>
//             <p>No recent activity</p>
//             <span className={styles.emptyHint}>Connect with study partners to see activity here</span>
//           </div>
//         </motion.div>
//       </motion.div>
//     </DashboardLayout>
//   );
// };

// export default Social;
