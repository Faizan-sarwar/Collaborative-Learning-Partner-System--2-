import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Blog.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Study Tips', 'Productivity', 'Collaboration', 'Student Life', 'Updates'];

  const featuredPost = {
    title: 'How Collaborative Learning Can Transform Your Grades',
    excerpt: 'Discover the science behind why studying with peers leads to better understanding, retention, and academic performance. We break down the research and give you actionable strategies.',
    author: 'StudySync Team',
    date: 'Apr 2, 2026',
    readTime: '8 min read',
    category: 'Collaboration',
    image: '🎓'
  };

  const posts = [
    {
      title: 'The Pomodoro Technique: A Student\'s Best Friend',
      excerpt: 'Learn how to use timed study sessions to boost focus and beat procrastination.',
      author: 'Priya Sharma',
      date: 'Mar 28, 2026',
      readTime: '5 min read',
      category: 'Productivity',
      icon: '⏱️'
    },
    {
      title: '5 Ways to Explain Complex Topics to Your Study Partner',
      excerpt: 'Teaching others is the best way to learn. Here\'s how to do it effectively.',
      author: 'Alex Chen',
      date: 'Mar 22, 2026',
      readTime: '6 min read',
      category: 'Collaboration',
      icon: '💬'
    },
    {
      title: 'Building a Study Routine That Actually Sticks',
      excerpt: 'Consistency beats intensity. Create a sustainable study schedule you\'ll follow.',
      author: 'Maya Johnson',
      date: 'Mar 15, 2026',
      readTime: '7 min read',
      category: 'Study Tips',
      icon: '📅'
    },
    {
      title: 'How to Stay Motivated During Exam Season',
      excerpt: 'Practical strategies to keep your energy and focus high when it matters most.',
      author: 'Ravi Patel',
      date: 'Mar 10, 2026',
      readTime: '4 min read',
      category: 'Student Life',
      icon: '🔥'
    },
    {
      title: 'New Feature: Study Rooms with Shared Whiteboards',
      excerpt: 'We\'ve launched real-time collaborative whiteboards inside study rooms.',
      author: 'StudySync Team',
      date: 'Mar 5, 2026',
      readTime: '3 min read',
      category: 'Updates',
      icon: '🚀'
    },
    {
      title: 'Why Group Study Beats Solo Study (According to Science)',
      excerpt: 'Research shows collaborative learning improves critical thinking by 40%.',
      author: 'Dr. Sarah Kim',
      date: 'Feb 28, 2026',
      readTime: '6 min read',
      category: 'Study Tips',
      icon: '🧠'
    },
    {
      title: 'Managing Stress: A Guide for University Students',
      excerpt: 'Balancing academics, social life, and self-care doesn\'t have to be impossible.',
      author: 'Anita Das',
      date: 'Feb 20, 2026',
      readTime: '5 min read',
      category: 'Student Life',
      icon: '🧘'
    },
    {
      title: 'How to Find the Perfect Study Partner on StudySync',
      excerpt: 'Tips for using our matching algorithm to connect with compatible learners.',
      author: 'StudySync Team',
      date: 'Feb 15, 2026',
      readTime: '4 min read',
      category: 'Collaboration',
      icon: '🤝'
    }
  ];

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  return (
    <div className={styles.page}>
      <Navbar />
      
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.glowOrb1}></div>
          <div className={styles.glowOrb2}></div>
          <div className={styles.gridOverlay}></div>
        </div>
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.badge}>📝 Our Blog</span>
          <h1 className={styles.heroTitle}>
            Insights for <span className={styles.gradient}>Smarter Learning</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Tips, strategies, and stories to help you study better together.
          </p>
        </motion.div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          {/* Featured Post */}
          <motion.div 
            className={styles.featured}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.featuredIcon}>{featuredPost.image}</div>
            <div className={styles.featuredBody}>
              <span className={styles.featuredLabel}>Featured</span>
              <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
              <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
              <div className={styles.postMeta}>
                <span>{featuredPost.author}</span>
                <span className={styles.dot}>•</span>
                <span>{featuredPost.date}</span>
                <span className={styles.dot}>•</span>
                <span>{featuredPost.readTime}</span>
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          <div className={styles.categories}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.catBtn} ${activeCategory === cat ? styles.catActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className={styles.postsGrid}>
            {filteredPosts.map((post, i) => (
              <motion.article
                key={i}
                className={styles.postCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <div className={styles.postIcon}>{post.icon}</div>
                <span className={styles.postCategory}>{post.category}</span>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <div className={styles.postMeta}>
                  <span>{post.author}</span>
                  <span className={styles.dot}>•</span>
                  <span>{post.readTime}</span>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Newsletter */}
          <motion.div 
            className={styles.newsletter}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className={styles.nlTitle}>Stay in the loop</h3>
            <p className={styles.nlText}>Get the latest study tips and platform updates straight to your inbox.</p>
            <div className={styles.nlForm}>
              <input type="email" placeholder="Enter your email" className={styles.nlInput} />
              <button className={styles.nlBtn}>Subscribe</button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
