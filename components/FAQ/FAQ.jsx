import React, { useState } from 'react';
import styles from './FAQ.module.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'How does the matching algorithm work?',
      answer: 'Our AI-powered matching system analyzes your study preferences, schedule, subjects of interest, and learning style to connect you with compatible study partners. The more you use the platform, the smarter the recommendations become.'
    },
    {
      question: 'Is Collaborative Learning Partner System really free?',
      answer: 'Yes! Collaborative Learning Partner System is completely free for all students. We believe education should be accessible to everyone. There are no hidden fees, premium tiers, or paywalls. All features are available to all users.'
    },

    {
      question: 'Can I use Collaborative Learning Partner System on my phone?',
      answer: 'Absolutely! Collaborative Learning Partner System is fully responsive and works seamlessly on all devices. We also have dedicated mobile apps for iOS and Android that provide an optimized experience with push notifications for study sessions.'
    },
    {
      question: 'How do I create a study group?',
      answer: 'Creating a study group is simple. Just click "Create Group" on your dashboard, set the subject, add a description, and invite members. You can make groups public or private, and set specific meeting schedules.'
    },
    {
      question: 'What subjects are supported?',
      answer: 'Collaborative Learning Partner System supports all academic subjects from mathematics and sciences to humanities and arts. Our diverse community includes students from various fields, making it easy to find study partners regardless of your major.'
    },
    {
      question: 'How do virtual study rooms work?',
      answer: 'Virtual study rooms provide a collaborative space with video chat, screen sharing, a shared whiteboard, and integrated note-taking. Sessions can be scheduled in advance or started spontaneously.'
    }
  ];

  return (
    <section className={styles.faq}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>FAQ</span>
          <h2 className={styles.title}>Frequently Asked <span className={styles.gradient}>Questions</span></h2>
          <p className={styles.subtitle}>Got questions? We've got answers</p>
        </div>
        <div className={styles.accordionWrapper}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`${styles.accordionItem} ${openIndex === index ? styles.open : ''}`}
            >
              <button 
                className={styles.accordionHeader}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className={styles.question}>{faq.question}</span>
                <div className={styles.iconWrapper}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
              <div className={styles.accordionContent}>
                <p className={styles.answer}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
