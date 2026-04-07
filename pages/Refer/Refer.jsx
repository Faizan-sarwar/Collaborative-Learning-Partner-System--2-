import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import { useNotification } from '../../src/context/NotificationContext';
import styles from './Refer.module.css';

const REWARD_TIERS = [
  { count: 3, reward: '1 Month Free Premium', icon: '🎁' },
  { count: 5, reward: 'Exclusive Study Resources', icon: '📚' },
  { count: 10, reward: 'Priority Matching', icon: '⭐' },
  { count: 25, reward: 'Lifetime Premium Access', icon: '👑' },
];

const Refer = () => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  
  // 🟢 ADDED: Local state to show success/error messages directly on the screen
  const [inviteStatus, setInviteStatus] = useState({ type: '', message: '' });
  
  // Real State Variables
  const [isLoading, setIsLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);
  const [referralCode, setReferralCode] = useState('');
  const { addNotification } = useNotification();

  const referralLink = referralCode ? `https://studymatch.com/signup?ref=${referralCode}` : 'Loading...';
  
  // Calculated Stats based on real database data
  const joinedReferrals = referrals.filter(r => r.status === 'joined');
  const totalReferrals = joinedReferrals.length;
  const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
  
  // LOGIC UPDATE: Calculate total XP earned from referrals (Fallback to 100 if reward field is missing)
  const totalXPEarned = joinedReferrals.reduce((acc, r) => acc + (r.reward || 100), 0);

  // FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // 1. Fetch user data to get their unique referral code
        const userRes = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await userRes.json();
        
        if (userData.success && userData.user) {
          setReferralCode(userData.user.referralCode || 'NO_CODE_FOUND');
        }

        // 2. Fetch the list of people they have referred
        const refRes = await fetch('http://localhost:5000/api/referrals/my-referrals', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const refData = await refRes.json();

        if (refData.success) {
          setReferrals(refData.referrals);
        }
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    
    // Optional: Keep the global toast for copying since it's an achievement/XP style context
    if(addNotification) addNotification('Referral link copied!', 'success');
    
    setTimeout(() => setCopied(false), 2000);
  };

  // SEND INVITE TO BACKEND
  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    // Reset status before sending
    setInviteStatus({ type: '', message: '' });

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/referrals/invite', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (data.success) {
        // 🟢 Show inline success message
        setInviteStatus({ type: 'success', message: `Invitation sent to ${email}!` });
        
        // Optimistically add the pending referral to the UI
        setReferrals(prev => [
          {
            _id: Date.now().toString(), 
            name: email.split('@')[0],
            email: email,
            status: 'pending',
            createdAt: new Date().toISOString(),
            reward: 0 // 0 XP until they actually sign up
          },
          ...prev
        ]);
        setEmail('');
      } else {
        // 🟢 Show inline error message (e.g., "Uexists")
        setInviteStatus({ type: 'error', message: data.message || 'Failed to send invite' });
      }
    } catch (error) {
      setInviteStatus({ type: 'error', message: 'Network error while sending invite. Is the server running?' });
    }
    
    // Clear the message after 5 seconds
    setTimeout(() => setInviteStatus({ type: '', message: '' }), 5000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <h2>Loading your rewards...</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <motion.div className={styles.heroSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.heroContent}>
            <span className={styles.heroEmoji}>🎉</span>
            <h1 className={styles.heroTitle}>Invite Friends & Earn XP</h1>
            <p className={styles.heroSubtitle}>
              Share the joy of learning! Invite your friends to join and both of you will earn amazing rewards and level up faster.
            </p>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>{totalReferrals}</span>
              <span className={styles.heroStatLabel}>Friends Joined</span>
            </div>
            <div className={styles.heroDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue} style={{ color: '#10B981' }}>{totalXPEarned} XP</span>
              <span className={styles.heroStatLabel}>Total Earned</span>
            </div>
            <div className={styles.heroDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>{pendingReferrals}</span>
              <span className={styles.heroStatLabel}>Pending Invites</span>
            </div>
          </div>
        </motion.div>

        <motion.div className={styles.mainGrid} variants={containerVariants} initial="hidden" animate="visible">
          <motion.div className={styles.shareCard} variants={itemVariants}>
            <h2 className={styles.cardTitle}>
              <span className={styles.cardIcon}>🔗</span>
              Share Your Link
            </h2>

            <div className={styles.linkBox}>
              <input type="text" value={referralLink} readOnly className={styles.linkInput} />
              <motion.button className={styles.copyBtn} onClick={handleCopy} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>

            <div className={styles.codeSection}>
              <span className={styles.codeLabel}>Your Referral Code:</span>
              <span className={styles.code}>{referralCode}</span>
            </div>
          </motion.div>

          <motion.div className={styles.inviteCard} variants={itemVariants}>
            <h2 className={styles.cardTitle}>
              <span className={styles.cardIcon}>✉️</span>
              Invite by Email
            </h2>

            <form onSubmit={handleInvite} className={styles.inviteForm}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter friend's email address"
                className={styles.emailInput}
                required
              />
              <motion.button type="submit" className={styles.inviteBtn} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Send Invite
              </motion.button>
            </form>

            {/* 🟢 INLINE NOTIFICATION MESSAGE RENDERS HERE */}
            {inviteStatus.message && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        textAlign: 'center',
                        backgroundColor: inviteStatus.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: inviteStatus.type === 'error' ? '#ef4444' : '#10b981',
                        border: `1px solid ${inviteStatus.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                    }}
                >
                    {inviteStatus.message}
                </motion.div>
            )}

          </motion.div>
        </motion.div>

        <motion.div className={styles.rewardsSection} variants={containerVariants} initial="hidden" animate="visible">
          <h2 className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🏆</span>
            Rewards Milestones
          </h2>

          <div className={styles.rewardsGrid}>
            {REWARD_TIERS.map((reward, index) => {
              const isUnlocked = totalReferrals >= reward.count;
              return (
                <motion.div key={index} className={`${styles.rewardCard} ${isUnlocked ? styles.unlocked : ''}`} variants={itemVariants} whileHover={{ y: -5 }}>
                  <div className={styles.rewardIcon}>{reward.icon}</div>
                  <div className={styles.rewardInfo}>
                    <span className={styles.rewardCount}>{reward.count} Referrals</span>
                    <span className={styles.rewardName}>{reward.reward}</span>
                  </div>
                  {isUnlocked ? (
                    <span className={styles.unlockedBadge}>✓ Unlocked</span>
                  ) : (
                    <span className={styles.lockedBadge}>🔒 Locked</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div className={styles.referralsSection} variants={containerVariants} initial="hidden" animate="visible">
          <h2 className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>👥</span>
            Your Referrals
          </h2>

          <div className={styles.referralsList}>
            {referrals.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>You haven't referred anyone yet. Start sharing!</p>
            ) : (
              referrals.map((referral) => (
                <motion.div key={referral._id || referral.id} className={styles.referralItem} variants={itemVariants} whileHover={{ x: 5 }}>
                  <div className={styles.referralAvatar}>
                    {referral.name ? referral.name.charAt(0).toUpperCase() : referral.email.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.referralInfo}>
                    <span className={styles.referralName}>{referral.name || 'Pending User'}</span>
                    <span className={styles.referralEmail}>{referral.email}</span>
                  </div>
                  <div className={styles.referralMeta}>
                    <span className={styles.referralDate}>
                      {new Date(referral.createdAt || referral.date).toLocaleDateString()}
                    </span>
                    <span className={`${styles.referralStatus} ${styles[referral.status]}`}>
                      {referral.status === 'joined' ? '✓ Joined' : '⏳ Pending'}
                    </span>
                  </div>
                  {(referral.reward > 0) && (
                    <span className={styles.referralReward} style={{ color: '#10B981', fontWeight: 'bold' }}>
                      +{referral.reward} XP
                    </span>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Refer;