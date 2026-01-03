import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import styles from './Refer.module.css';

const mockReferrals = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'joined', date: '2024-01-15', reward: 50 },
  { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', status: 'pending', date: '2024-01-18', reward: 0 },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'joined', date: '2024-01-10', reward: 50 },
  { id: 4, name: 'Emily Chen', email: 'emily@example.com', status: 'pending', date: '2024-01-20', reward: 0 },
];

const rewards = [
  { count: 3, reward: '1 Month Free Premium', icon: '🎁', unlocked: true },
  { count: 5, reward: 'Exclusive Study Resources', icon: '📚', unlocked: true },
  { count: 10, reward: 'Priority Matching', icon: '⭐', unlocked: false },
  { count: 25, reward: 'Lifetime Premium Access', icon: '👑', unlocked: false },
];

const Refer = () => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const referralCode = 'STUDY2024XYZ';
  const referralLink = `https://studymatch.com/invite/${referralCode}`;
  const totalReferrals = mockReferrals.filter(r => r.status === 'joined').length;
  const totalEarnings = mockReferrals.reduce((acc, r) => acc + r.reward, 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Invitation sent to ${email}`);
      setEmail('');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <motion.div
          className={styles.heroSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.heroContent}>
            <span className={styles.heroEmoji}>🎉</span>
            <h1 className={styles.heroTitle}>Invite Friends & Earn Rewards</h1>
            <p className={styles.heroSubtitle}>
              Share the joy of learning! Invite your friends to join and both of you 
              will earn amazing rewards.
            </p>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>{totalReferrals}</span>
              <span className={styles.heroStatLabel}>Friends Joined</span>
            </div>
            <div className={styles.heroDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>${totalEarnings}</span>
              <span className={styles.heroStatLabel}>Credits Earned</span>
            </div>
            <div className={styles.heroDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>{mockReferrals.filter(r => r.status === 'pending').length}</span>
              <span className={styles.heroStatLabel}>Pending Invites</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.mainGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className={styles.shareCard} variants={itemVariants}>
            <h2 className={styles.cardTitle}>
              <span className={styles.cardIcon}>🔗</span>
              Share Your Link
            </h2>

            <div className={styles.linkBox}>
              <input
                type="text"
                value={referralLink}
                readOnly
                className={styles.linkInput}
              />
              <motion.button
                className={styles.copyBtn}
                onClick={handleCopy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </motion.button>
            </div>

            <div className={styles.codeSection}>
              <span className={styles.codeLabel}>Your Referral Code:</span>
              <span className={styles.code}>{referralCode}</span>
            </div>

            <div className={styles.socialShare}>
              <span className={styles.shareLabel}>Share via:</span>
              <div className={styles.socialBtns}>
                {['📧', '💬', '🐦', '📱'].map((icon, index) => (
                  <motion.button
                    key={index}
                    className={styles.socialBtn}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {icon}
                  </motion.button>
                ))}
              </div>
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
              <motion.button
                type="submit"
                className={styles.inviteBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Invite
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </motion.button>
            </form>

            <div className={styles.howItWorks}>
              <h3 className={styles.sectionTitle}>How It Works</h3>
              <div className={styles.steps}>
                {[
                  { step: 1, text: 'Share your unique referral link', icon: '🔗' },
                  { step: 2, text: 'Friend signs up using your link', icon: '👤' },
                  { step: 3, text: 'Both of you earn rewards!', icon: '🎁' },
                ].map((item) => (
                  <div key={item.step} className={styles.step}>
                    <span className={styles.stepIcon}>{item.icon}</span>
                    <span className={styles.stepText}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.rewardsSection}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🏆</span>
            Rewards Milestones
          </h2>

          <div className={styles.rewardsGrid}>
            {rewards.map((reward, index) => (
              <motion.div
                key={index}
                className={`${styles.rewardCard} ${reward.unlocked ? styles.unlocked : ''}`}
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className={styles.rewardIcon}>{reward.icon}</div>
                <div className={styles.rewardInfo}>
                  <span className={styles.rewardCount}>{reward.count} Referrals</span>
                  <span className={styles.rewardName}>{reward.reward}</span>
                </div>
                {reward.unlocked ? (
                  <span className={styles.unlockedBadge}>✓ Unlocked</span>
                ) : (
                  <span className={styles.lockedBadge}>🔒 Locked</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.referralsSection}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>👥</span>
            Your Referrals
          </h2>

          <div className={styles.referralsList}>
            {mockReferrals.map((referral, index) => (
              <motion.div
                key={referral.id}
                className={styles.referralItem}
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <div className={styles.referralAvatar}>
                  {referral.name.charAt(0)}
                </div>
                <div className={styles.referralInfo}>
                  <span className={styles.referralName}>{referral.name}</span>
                  <span className={styles.referralEmail}>{referral.email}</span>
                </div>
                <div className={styles.referralMeta}>
                  <span className={styles.referralDate}>{referral.date}</span>
                  <span className={`${styles.referralStatus} ${styles[referral.status]}`}>
                    {referral.status === 'joined' ? '✓ Joined' : '⏳ Pending'}
                  </span>
                </div>
                {referral.reward > 0 && (
                  <span className={styles.referralReward}>+${referral.reward}</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Refer;
