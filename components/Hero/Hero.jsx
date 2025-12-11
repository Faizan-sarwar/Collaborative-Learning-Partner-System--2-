import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.backgroundGlow}></div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.badge}>
              <span className={styles.badgeDot}></span>
              <span>The Future of Learning</span>
            </div>
            <h1 className={styles.title}>
              <span className={styles.gradientBlue}>Connect,</span>{' '}
              <span className={styles.gradientPurple}>Learn,</span>{' '}
              <span className={styles.gradientPink}>Excel</span>
              <br />
              <span className={styles.white}>Together</span>
            </h1>
            <p className={styles.description}>
              Join with students in collaborative study groups. 
              Share knowledge, stay motivated, and achieve your academic goals 
              with our intelligent learning platform.
            </p>
            <div className={styles.ctas}>
              <button className={styles.primaryBtn}>
                Get Started
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {/* <button className={styles.secondaryBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                </svg>
                Watch Demo
              </button> */}
            </div>
            {/* <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>50K+</span>
                <span className={styles.statLabel}>Active Students</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>1000+</span>
                <span className={styles.statLabel}>Study Groups</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>4.9</span>
                <span className={styles.statLabel}>User Rating</span>
              </div>
            </div> */}
          </div>
          <div className={styles.right}>
            <div className={styles.imageWrapper}>
              <div className={styles.glowOrb}></div>
              <div className={styles.mainImage}>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
                  alt="Students collaborating"
                />
              </div>
              <div className={styles.floatingCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardDot}></div>
                  <span>Live Study Session</span>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.avatarGroup}>
                    <div className={styles.avatar} style={{background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'}}>J</div>
                    <div className={styles.avatar} style={{background: 'linear-gradient(135deg, #ec4899, #8b5cf6)'}}>M</div>
                    <div className={styles.avatar} style={{background: 'linear-gradient(135deg, #10b981, #06b6d4)'}}>S</div>
                  </div>
                  <span className={styles.cardLabel}></span>
                </div>
              </div>
              <div className={styles.screenshotCard}>
                <div className={styles.screenshotHeader}>
                  <div className={styles.windowDots}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className={styles.screenshotContent}>
                  <div className={styles.screenshotSidebar}>
                    <div className={styles.sidebarItem}></div>
                    <div className={styles.sidebarItem}></div>
                    <div className={styles.sidebarItem}></div>
                  </div>
                  <div className={styles.screenshotMain}>
                    <div className={styles.chartBar} style={{height: '60%'}}></div>
                    <div className={styles.chartBar} style={{height: '80%'}}></div>
                    <div className={styles.chartBar} style={{height: '45%'}}></div>
                    <div className={styles.chartBar} style={{height: '90%'}}></div>
                    <div className={styles.chartBar} style={{height: '70%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
