import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Signup.module.css';
import Alert from '../../components/Alert/Alert';
import PageTransition from '../../components/PageTransition/PageTransition';

const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Computer Science',
    'Data Structures',
    'Algorithms',
    'Database Management',
    'Web Development',
    'Machine Learning',
    'Networking',
];

const departments = [
    'Information Technology',
];

const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

const studyStyles = [
    'Individual Study',
    'Group Collaboration',
    'One-on-One Mentoring',
];

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        rollNumber: '',
        profilePicture: null,
        email: '',
        password: '',
        department: '',
        semester: '',
        academicStrengths: [],
        subjectsOfDifficulty: [],
        studyStyle: '',
        availability: '',
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertError, setAlertError] = useState('');
    const [success, setSuccess] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const issues = [];
        if (password.length < 8) issues.push('at least 8 characters');
        if (!/[A-Z]/.test(password)) issues.push('one uppercase letter');
        if (!/[a-z]/.test(password)) issues.push('one lowercase letter');
        if (!/[0-9]/.test(password)) issues.push('one number');
        if (!/[^A-Za-z0-9]/.test(password)) issues.push('one special character');
        return issues;
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'fullName':
                if (!value.trim()) return 'Full name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                if (value.trim().length > 100) return 'Name must be less than 100 characters';
                return '';
            case 'rollNumber':
                if (!value.trim()) return 'Roll number is required';
                if (!/^[A-Za-z0-9-]+$/.test(value)) return 'Roll number can only contain letters, numbers, and hyphens';
                return '';
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!validateEmail(value)) return 'Please enter a valid email address';
                return '';
            case 'password':
                if (!value) return 'Password is required';
                const passwordIssues = validatePassword(value);
                if (passwordIssues.length > 0) {
                    return `Password must contain ${passwordIssues.join(', ')}`;
                }
                return '';
            case 'availability':
                if (value.length > 500) return 'Availability description must be less than 500 characters';
                return '';
            default:
                return '';
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return { label: '', level: 0 };
        const issues = validatePassword(password);
        if (issues.length >= 4) return { label: 'Weak', level: 1 };
        if (issues.length >= 2) return { label: 'Medium', level: 2 };
        return { label: 'Strong', level: 3 };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (touched[name]) {
            const error = validateField(name, value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors((prev) => ({ ...prev, profilePicture: 'Please upload an image file' }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, profilePicture: 'Image must be less than 5MB' }));
                return;
            }
            setErrors((prev) => ({ ...prev, profilePicture: '' }));
        }
        setFormData((prev) => ({ ...prev, profilePicture: file }));
    };

    const handleCheckboxChange = (field, subject) => {
        setFormData((prev) => {
            const current = prev[field];
            const updated = current.includes(subject)
                ? current.filter((s) => s !== subject)
                : [...current, subject];
            return { ...prev, [field]: updated };
        });
    };

    const validateForm = () => {
        const newErrors = {};
        const fieldsToValidate = ['fullName', 'rollNumber', 'email', 'password', 'availability'];

        fieldsToValidate.forEach((field) => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });

        setErrors(newErrors);
        setTouched({
            fullName: true,
            rollNumber: true,
            email: true,
            password: true,
            availability: true,
        });

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertError('');
        setSuccess('');

        if (!validateForm()) {
            setAlertError('Please fix the errors in the form before submitting.');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setSuccess('Profile created successfully! Redirecting to login...');
        setIsSubmitting(false);
    };

    return (
        <PageTransition>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.logo}>
                            <div className={styles.logoIcon}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#grad1)" />
                                    <path d="M2 17L12 22L22 17" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 12L12 17L22 12" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <defs>
                                        <linearGradient id="grad1" x1="2" y1="2" x2="22" y2="22">
                                            <stop stopColor="#3b82f6" />
                                            <stop offset="1" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <span className={styles.logoText}>Collaborative Learning</span>
                        </div>

                        <Link to="/login" className={styles.loginButton}>
                            Login
                        </Link>
                    </div>
                </header>

                <main className={styles.main}>
                    <div className={styles.formContainer}>
                        {alertError && <Alert type="error" message={alertError} onClose={() => setAlertError('')} />}
                        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                        <div className={styles.formHeader}>
                            <h2>Student Registration & Profile</h2>
                            <p>Complete your profile to connect with the best study partners for you.</p>
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit} noValidate>
                            {/* Student Information Section */}
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>Student Information</h3>
                                <div className={styles.formGrid}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Full Name *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className={`${styles.input} ${errors.fullName && touched.fullName ? styles.inputError : ''}`}
                                            placeholder="Enter your full name"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                        />
                                        {errors.fullName && touched.fullName && (
                                            <span className={styles.errorMessage}>{errors.fullName}</span>
                                        )}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Roll Number *</label>
                                        <input
                                            type="text"
                                            name="rollNumber"
                                            className={`${styles.input} ${errors.rollNumber && touched.rollNumber ? styles.inputError : ''}`}
                                            placeholder="Enter your roll number"
                                            value={formData.rollNumber}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                        />
                                        {errors.rollNumber && touched.rollNumber && (
                                            <span className={styles.errorMessage}>{errors.rollNumber}</span>
                                        )}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Profile Picture</label>
                                        <input
                                            type="file"
                                            name="profilePicture"
                                            className={`${styles.fileInput} ${errors.profilePicture ? styles.inputError : ''}`}
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        {errors.profilePicture && (
                                            <span className={styles.errorMessage}>{errors.profilePicture}</span>
                                        )}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                        />
                                        {errors.email && touched.email && (
                                            <span className={styles.errorMessage}>{errors.email}</span>
                                        )}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Password *</label>
                                        <div className={styles.passwordWrapper}>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                className={`${styles.input} ${errors.password && touched.password ? styles.inputError : ''}`}
                                                placeholder="Create a password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                            />
                                            <button
                                                type="button"
                                                className={styles.eyeButton}
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                        <line x1="1" y1="1" x2="23" y2="23" />
                                                    </svg>
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && touched.password && (
                                            <span className={styles.errorMessage}>{errors.password}</span>
                                        )}
                                        {formData.password && !errors.password && (
                                            <div className={styles.strengthWrapper}>
                                                <div className={styles.strengthBar}>
                                                    <div
                                                        className={`${styles.strengthFill} ${styles[`strength${passwordStrength.level}`]}`}
                                                        style={{ width: `${(passwordStrength.level / 3) * 100}%` }}
                                                    />
                                                </div>
                                                <span className={`${styles.strengthLabel} ${styles[`strength${passwordStrength.level}`]}`}>
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Department *</label>
                                        <select
                                            name="department"
                                            className={styles.select}
                                            value={formData.department}
                                            onChange={handleInputChange}
                                        >
                                            <option value="" disabled hidden>
                                                Select your department
                                            </option>

                                            {departments.map((dept) => (
                                                <option key={dept} value={dept}>
                                                    {dept}
                                                </option>
                                            ))}
                                        </select>

                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Semester *</label>
                                        <select
                                            name="semester"
                                            className={styles.select}
                                            value={formData.semester}
                                            onChange={handleInputChange}
                                        >
                                            <option value="" disabled hidden>
                                                Select your semester
                                            </option>

                                            {semesters.map((sem) => (
                                                <option key={sem} value={sem}>Semester {sem}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Profile Section */}
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>Academic Profile</h3>

                                <div className={styles.checkboxSection}>
                                    <label className={styles.label}>Academic Strengths</label>
                                    <div className={styles.checkboxGrid}>
                                        {subjects.map((subject) => (
                                            <label key={`strength-${subject}`} className={styles.checkboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.academicStrengths.includes(subject)}
                                                    onChange={() => handleCheckboxChange('academicStrengths', subject)}
                                                    className={styles.checkbox}
                                                />
                                                <span className={styles.checkboxText}>{subject}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.checkboxSection}>
                                    <label className={styles.label}>Subjects of Difficulty</label>
                                    <div className={styles.checkboxGrid}>
                                        {subjects.map((subject) => (
                                            <label key={`difficulty-${subject}`} className={styles.checkboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.subjectsOfDifficulty.includes(subject)}
                                                    onChange={() => handleCheckboxChange('subjectsOfDifficulty', subject)}
                                                    className={styles.checkbox}
                                                />
                                                <span className={styles.checkboxText}>{subject}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Learning Preferences Section */}
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>Learning Preferences</h3>
                                <div className={styles.formGrid}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Preferred Study Style</label>
                                        <select
                                            name="studyStyle"
                                            className={styles.select}
                                            value={formData.studyStyle}
                                            onChange={handleInputChange}
                                        >
                                            {studyStyles.map((style) => (
                                                <option key={style} value={style}>{style}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Availability Section */}
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>Availability</h3>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Describe your available study times</label>
                                    <textarea
                                        name="availability"
                                        className={`${styles.textarea} ${errors.availability && touched.availability ? styles.inputError : ''}`}
                                        placeholder="E.g., Weekdays 6-9 PM, Weekends flexible..."
                                        value={formData.availability}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        rows={4}
                                    />
                                    {errors.availability && touched.availability && (
                                        <span className={styles.errorMessage}>{errors.availability}</span>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </PageTransition>
    );
};

export default Signup;
