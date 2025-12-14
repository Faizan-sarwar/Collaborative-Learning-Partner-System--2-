import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Signup.module.css';
import Alert from '../../components/Alert/Alert';
import PageTransition from '../../components/PageTransition/PageTransition';

const departments = [
    'Information Technology',
    'Computer Science',
    'Software Engineering',
    'Data Science'
];

const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

const studyStyles = [
    'Individual Study',
    'Group Collaboration',
    'One-on-One Mentoring',
];

// Fallback now includes active status
const FALLBACK_SUBJECTS = [
    { name: 'Mathematics', active: true },
    { name: 'Physics', active: true },
    { name: 'Chemistry', active: true },
    { name: 'Computer Science', active: true },
    { name: 'Data Structures', active: true },
    { name: 'Algorithms', active: true },
    { name: 'Database Management', active: true },
    { name: 'Web Development', active: true },
    { name: 'Machine Learning', active: true },
    { name: 'Networking', active: true },
];

const Signup = () => {
    // 🔹 State now stores objects { name, active }
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [usingFallback, setUsingFallback] = useState(false);

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

    // 🔹 FETCH LIVE COURSES ON MOUNT
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('http://localhost:5000/studygroup');
                const data = await res.json();

                if (data.success && data.groups.length > 0) {
                    // Map groups to a structure containing name and active status
                    const courses = data.groups.map(g => ({
                        name: g.name,
                        active: g.active
                    }));
                    setAvailableSubjects(courses);
                    setUsingFallback(false);
                } else {
                    console.log("Database empty, using fallback subjects.");
                    setAvailableSubjects(FALLBACK_SUBJECTS);
                    setUsingFallback(true);
                }
            } catch (err) {
                console.error("Failed to load subjects, using fallback", err);
                setAvailableSubjects(FALLBACK_SUBJECTS);
                setUsingFallback(true);
            } finally {
                setLoadingSubjects(false);
            }
        };
        fetchCourses();
    }, []);

    // ... [Validation functions: validateEmail, validatePassword, validateField stay the same] ...
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
                return '';
            case 'rollNumber':
                if (!value.trim()) return 'Roll number is required';
                return '';
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!validateEmail(value)) return 'Please enter a valid email address';
                return '';
            case 'password':
                if (!value) return 'Password is required';
                const passwordIssues = validatePassword(value);
                if (passwordIssues.length > 0) return `Password must contain ${passwordIssues.join(', ')}`;
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

    const handleCheckboxChange = (field, subjectName) => {
        setFormData((prev) => {
            const current = prev[field];
            const updated = current.includes(subjectName)
                ? current.filter((s) => s !== subjectName)
                : [...current, subjectName];
            return { ...prev, [field]: updated };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertError('');
        setSuccess('');

        const newErrors = {};
        ['fullName', 'email', 'password', 'rollNumber'].forEach(f => {
            const err = validateField(f, formData[f]);
            if (err) newErrors[f] = err;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setAlertError('Please fix errors in the form.');
            return;
        }

        setIsSubmitting(true);

        try {
            const formPayload = new FormData();
            Object.keys(formData).forEach((key) => {
                if (Array.isArray(formData[key])) {
                    formPayload.append(key, JSON.stringify(formData[key]));
                } else {
                    formPayload.append(key, formData[key]);
                }
            });

            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                body: formPayload,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // 🔹 CHANGE 1: Use sessionStorage (Clears when browser closes)
            if (data.user) {
                sessionStorage.setItem('user', JSON.stringify(data.user));
            }

            setSuccess("Profile created successfully! Redirecting...");

            // 🔹 CHANGE 2: Conditional Redirect based on Role
            setTimeout(() => {
                if (data.user.role === 'admin') {
                    window.location.href = '/admin'; // Redirect Admin to Admin Panel
                } else {
                    window.location.href = '/dashboard'; // Redirect Student to Dashboard
                }
            }, 1500);

        } catch (error) {
            setAlertError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageTransition>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.logo}>
                            <span className={styles.logoText}>Collaborative Learning</span>
                        </div>
                        <Link to="/login" className={styles.loginButton}>Login</Link>
                    </div>
                </header>

                <main className={styles.main}>
                    <div className={styles.formContainer}>
                        {alertError && <Alert type="error" message={alertError} onClose={() => setAlertError('')} />}
                        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                        <div className={styles.formHeader}>
                            <h2>Student Registration</h2>
                            <p>Complete your profile to find study partners.</p>
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit} noValidate>
                            {/* Student Info Section */}
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>Student Information</h3>
                                <div className={styles.formGrid}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Full Name *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
                                            placeholder="Enter your full name"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                        />
                                        {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Roll Number *</label>
                                        <input
                                            type="text"
                                            name="rollNumber"
                                            className={`${styles.input} ${errors.rollNumber ? styles.inputError : ''}`}
                                            placeholder="Enter your roll number"
                                            value={formData.rollNumber}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Profile Picture</label>
                                        <input
                                            type="file"
                                            name="profilePicture"
                                            className={styles.fileInput}
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onBlur={handleBlur}
                                        />
                                        {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Password *</label>
                                        <div className={styles.passwordWrapper}>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
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
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                        {formData.password && !errors.password && (
                                            <div className={styles.strengthWrapper}>
                                                <div className={styles.strengthBar}>
                                                    <div
                                                        className={`${styles.strengthFill} ${styles[`strength${passwordStrength.level}`]}`}
                                                        style={{ width: `${(passwordStrength.level / 3) * 100}%` }}
                                                    />
                                                </div>
                                                <span className={styles.strengthLabel}>{passwordStrength.label}</span>
                                            </div>
                                        )}
                                        {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Department *</label>
                                        <select
                                            name="department"
                                            className={styles.select}
                                            value={formData.department}
                                            onChange={handleInputChange}
                                        >
                                            <option value="" disabled hidden>Select your department</option>
                                            {departments.map((dept) => (
                                                <option key={dept} value={dept}>{dept}</option>
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
                                            <option value="" disabled hidden>Select your semester</option>
                                            {semesters.map((sem) => (
                                                <option key={sem} value={sem}>Semester {sem}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Profile Section - LIVE DATA */}
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>
                                    Academic Profile
                                    <span style={{ fontSize: '0.85em', fontWeight: 'normal', color: '#666', marginLeft: '10px' }}>
                                        ({availableSubjects.filter(s => s.active).length} Active Courses)
                                    </span>
                                </h3>

                                {loadingSubjects ? (
                                    <p>Loading subjects...</p>
                                ) : (
                                    <>
                                        <div className={styles.checkboxSection}>
                                            <label className={styles.label}>Academic Strengths</label>
                                            <div className={styles.checkboxGrid}>
                                                {availableSubjects.map((subjectObj) => (
                                                    <label
                                                        key={`strength-${subjectObj.name}`}
                                                        className={`${styles.checkboxLabel} ${!subjectObj.active ? styles.disabledLabel : ''}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.academicStrengths.includes(subjectObj.name)}
                                                            onChange={() => handleCheckboxChange('academicStrengths', subjectObj.name)}
                                                            className={styles.checkbox}
                                                            disabled={!subjectObj.active} // 🔹 DISABLE INPUT IF INACTIVE
                                                        />
                                                        <span className={`${styles.checkboxText} ${!subjectObj.active ? styles.disabledText : ''}`}>
                                                            {subjectObj.name} {!subjectObj.active && '(N/A)'}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={styles.checkboxSection}>
                                            <label className={styles.label}>Subjects of Difficulty</label>
                                            <div className={styles.checkboxGrid}>
                                                {availableSubjects.map((subjectObj) => (
                                                    <label
                                                        key={`difficulty-${subjectObj.name}`}
                                                        className={`${styles.checkboxLabel} ${!subjectObj.active ? styles.disabledLabel : ''}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.subjectsOfDifficulty.includes(subjectObj.name)}
                                                            onChange={() => handleCheckboxChange('subjectsOfDifficulty', subjectObj.name)}
                                                            className={styles.checkbox}
                                                            disabled={!subjectObj.active} // 🔹 DISABLE INPUT IF INACTIVE
                                                        />
                                                        <span className={`${styles.checkboxText} ${!subjectObj.active ? styles.disabledText : ''}`}>
                                                            {subjectObj.name} {!subjectObj.active && '(N/A)'}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {usingFallback && <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '10px' }}>* Showing default subjects because no custom courses have been added yet.</p>}
                                    </>
                                )}
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
                                        className={styles.textarea}
                                        placeholder="E.g., Weekdays 6-9 PM, Weekends flexible..."
                                        value={formData.availability}
                                        onChange={handleInputChange}
                                        rows={4}
                                    />
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