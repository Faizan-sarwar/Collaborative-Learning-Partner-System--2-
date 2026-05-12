import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Filter } from 'bad-words';
const profanityFilter = new Filter();
import { ChevronDown, X, Eye, EyeOff } from 'lucide-react'; // Added explicit icons
import styles from './Signup.module.css';
import Alert from '../../components/Alert/Alert';
import { motion } from 'framer-motion';
import PageWrapper from '../../src/motion/PageWrapper';
import { staggerContainer, fadeUpItem, springs } from '../../src/motion/motion';

const departments = [
    'Information Technology',
];

const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

const studyStyles = [
    'Individual Study',
    'Group Collaboration',
    'One-on-One Mentoring'
];

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
    const location = useLocation();

    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [usingFallback, setUsingFallback] = useState(false);

    const [strengthsDropdownOpen, setStrengthsDropdownOpen] = useState(false);
    const [difficultyDropdownOpen, setDifficultyDropdownOpen] = useState(false);
    const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
    const [semesterDropdownOpen, setSemesterDropdownOpen] = useState(false);
    const [studyStyleDropdownOpen, setStudyStyleDropdownOpen] = useState(false);

    const strengthsRef = useRef(null);
    const difficultyRef = useRef(null);
    const departmentRef = useRef(null);
    const semesterRef = useRef(null);
    const studyStyleRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (strengthsRef.current && !strengthsRef.current.contains(event.target)) setStrengthsDropdownOpen(false);
            if (difficultyRef.current && !difficultyRef.current.contains(event.target)) setDifficultyDropdownOpen(false);
            if (departmentRef.current && !departmentRef.current.contains(event.target)) setDepartmentDropdownOpen(false);
            if (semesterRef.current && !semesterRef.current.contains(event.target)) setSemesterDropdownOpen(false);
            if (studyStyleRef.current && !studyStyleRef.current.contains(event.target)) setStudyStyleDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 🟢 ADDED: confirmPassword and acceptTerms to the payload
    const [formData, setFormData] = useState({
        fullName: '',
        rollNumber: '',
        profilePicture: null,
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        department: '',
        semester: '',
        academicStrengths: [],
        subjectsOfDifficulty: [],
        studyStyle: '',
        availability: '',
        referredByCode: '',
        acceptTerms: false
    });

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const refCode = queryParams.get('ref');
        if (refCode) {
            setFormData(prev => ({ ...prev, referredByCode: refCode }));
        }
    }, [location]);

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 🟢 Added
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertError, setAlertError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch(`http://${window.location.hostname}:5000/studygroup`);
                const data = await res.json();
                if (data.success && data.groups.length > 0) {
                    const courses = data.groups.map(g => ({ name: g.name, active: g.active }));
                    setAvailableSubjects(courses);
                    setUsingFallback(false);
                } else {
                    setAvailableSubjects(FALLBACK_SUBJECTS);
                    setUsingFallback(true);
                }
            } catch (err) {
                setAvailableSubjects(FALLBACK_SUBJECTS);
                setUsingFallback(true);
            } finally {
                setLoadingSubjects(false);
            }
        };
        fetchCourses();
    }, []);

    const validateHumanName = (name) => {
        const trimmedName = name.trim();
        if (!trimmedName) return 'Full name is required';
        if (trimmedName.length < 2) return 'Name must be at least 2 characters';

        if (profanityFilter.isProfane(trimmedName)) {
            return 'Please enter an appropriate and respectful name.';
        }

        const validCharsRegex = /^[a-zA-Z\s\-']+$/;
        if (!validCharsRegex.test(trimmedName)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        if (/[\-']{2,}/.test(trimmedName) || /\s{2,}/.test(trimmedName)) return 'Name cannot contain consecutive spaces or symbols';
        if (/^[\-']|[\-']$/.test(trimmedName)) return 'Name cannot start or end with a symbol';

        const blockedWords = ['admin', 'root', 'test', 'fake', 'dummy', 'null', 'student', 'user'];
        if (trimmedName.toLowerCase().split(/\s+/).some(word => blockedWords.includes(word))) {
            return 'This name is not permitted. Please use your real name.';
        }
        return '';
    };

    const validateRollNumber = (roll) => {
        const trimmedRoll = roll.trim();
        if (!trimmedRoll) return 'Roll number is required';
        if (trimmedRoll.length < 4 || trimmedRoll.length > 20) return 'Roll number must be between 4 and 20 characters';
        if (!/^[A-Za-z0-9-]+$/.test(trimmedRoll)) return 'Roll number can only contain letters, numbers, and hyphens (no spaces)';
        return '';
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const issues = [];
        if (password.length < 8) issues.push('at least 8 chars');
        if (!/[A-Z]/.test(password)) issues.push('1 uppercase');
        if (!/[a-z]/.test(password)) issues.push('1 lowercase');
        if (!/[0-9]/.test(password)) issues.push('1 number');
        if (!/[^A-Za-z0-9]/.test(password)) issues.push('1 special char');
        return issues;
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'fullName':
                return validateHumanName(value);
            case 'rollNumber':
                return validateRollNumber(value);
            case 'gender':
                return !value ? 'Please select a gender' : '';
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!validateEmail(value)) return 'Please enter a valid email address';
                if (value.length > 100) return 'Email is too long';
                return '';
            case 'password':
                if (!value) return 'Password is required';
                const passwordIssues = validatePassword(value);
                return passwordIssues.length > 0 ? `Needs: ${passwordIssues.join(', ')}` : '';
            case 'confirmPassword':
                if (!value) return 'Please confirm your password';
                if (value !== formData.password) return 'Passwords do not match';
                return '';
            case 'department':
                return !value ? 'Please select your department' : '';
            case 'semester':
                return !value ? 'Please select your semester' : '';
            case 'studyStyle':
                return !value ? 'Please select a preferred study style' : '';
            case 'availability':
                if (value.length > 500) return 'Description must be less than 500 characters';
                // 🟢 SECURITY: Block basic HTML injection attempts
                if (/[<>]/.test(value)) return 'Angle brackets (< >) are not allowed';
                return '';
            case 'acceptTerms':
                return !value ? 'You must agree to the Terms and Privacy Policy to register.' : '';
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
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (touched[name]) {
            setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
        }

        // 🟢 Re-validate confirm password if primary password changes
        if (name === 'password' && touched.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: validateField('confirmPassword', formData.confirmPassword) }));
        }
    };

    const handleBlur = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
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

    const handleSubjectToggle = (field, subjectName) => {
        // 🟢 NEW LIMIT LOGIC: Block user if they try to add an 11th strength
        if (field === 'academicStrengths' && !formData[field].includes(subjectName) && formData[field].length >= 10) {
            setAlertError("You can only select a maximum of 10 academic strengths.");
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up so they see the error banner
            return; // Stop execution
        }

        const oppositeField = field === 'academicStrengths' ? 'subjectsOfDifficulty' : 'academicStrengths';

        setFormData((prev) => {
            const current = prev[field];
            const isAdding = !current.includes(subjectName);
            const updated = isAdding
                ? [...current, subjectName]
                : current.filter((s) => s !== subjectName);

            // If we're ADDING to this list, also remove from opposite list (defensive guard)
            const updatedOpposite = isAdding
                ? prev[oppositeField].filter((s) => s !== subjectName)
                : prev[oppositeField];

            return { ...prev, [field]: updated, [oppositeField]: updatedOpposite };
        });
    };

    const removeSubject = (field, subjectName) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((s) => s !== subjectName)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertError('');
        setSuccess('');

        const newErrors = {};
        const fieldsToValidate = [
            'fullName', 'email', 'password', 'confirmPassword', 'rollNumber', 'gender',
            'department', 'semester', 'studyStyle', 'availability', 'acceptTerms'
        ];

        fieldsToValidate.forEach(f => {
            const err = validateField(f, formData[f]);
            if (err) newErrors[f] = err;
        });

        // Re-run confirm password check against current state just to be safe
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setAlertError('Please fix errors in the form before submitting.');

            // Auto-scroll to the first validation error
            const firstErrorField = document.querySelector(`[name="${Object.keys(newErrors)[0]}"]`);
            if (firstErrorField) firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });

            return;
        }

        setIsSubmitting(true);

        try {
            const formPayload = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === 'confirmPassword' || key === 'acceptTerms') return; // Don't send these to DB
                if (key === 'referredByCode' && !formData[key]) return;

                if (Array.isArray(formData[key])) {
                    formPayload.append(key, JSON.stringify(formData[key]));
                } else {
                    formPayload.append(key, formData[key]);
                }
            });

            const response = await fetch(`http://${window.location.hostname}:5000/api/auth/signup`, {
                method: "POST",
                body: formPayload,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            if (data.user) {
                sessionStorage.setItem('user', JSON.stringify(data.user));
                if (data.token) sessionStorage.setItem('token', data.token);
            }

            setSuccess("Profile created successfully! Redirecting...");

            // 🟢 MAGIC FIX: Instantly scroll smoothly to the top to show the success banner
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => {
                if (data.user.role === 'admin') {
                    window.location.href = '/admin';
                } else if (!data.user.quizCompleted) {
                    // New users (and anyone who hasn't finished the quiz) MUST take it
                    // before they can reach the dashboard.
                    window.location.href = '/quiz';
                } else {
                    window.location.href = '/dashboard';
                }
            }, 1500);

        } catch (error) {
            setAlertError(error.message);

            // 🟢 MAGIC FIX: Scroll to the top if there's a backend error (e.g., "Email already registered")
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageWrapper>
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
                        <Link to="/login" className={styles.loginButton}>Login</Link>
                    </div>
                </header>

                <main className={styles.main}>
                    <motion.div
                        className={styles.formContainer}
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                    >
                        {alertError && <Alert type="error" message={alertError} onClose={() => setAlertError('')} />}
                        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

                        {formData.referredByCode && !alertError && !success && (
                            <motion.div variants={fadeUpItem} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', color: '#10B981', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                                🎉 You've been invited by a friend! Sign up to claim your rewards.
                            </motion.div>
                        )}

                        <motion.div className={styles.formHeader} variants={fadeUpItem}>
                            <h2>Student Registration</h2>
                            <p>Complete your profile to find study partners.</p>
                        </motion.div>

                        <form className={styles.form} onSubmit={handleSubmit} noValidate>
                            {/* === STUDENT INFO SECTION === */}
                            <motion.div className={styles.section} variants={fadeUpItem}>
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
                                            aria-invalid={!!errors.fullName}
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
                                        {errors.rollNumber && <span className={styles.errorMessage}>{errors.rollNumber}</span>}
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
                                        <label className={styles.label}>Gender *</label>
                                        <div className={styles.radioGroup}>
                                            <label className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="Male"
                                                    checked={formData.gender === 'Male'}
                                                    onChange={handleInputChange}
                                                    className={styles.radioInput}
                                                />
                                                Male
                                            </label>
                                            <label className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="Female"
                                                    checked={formData.gender === 'Female'}
                                                    onChange={handleInputChange}
                                                    className={styles.radioInput}
                                                />
                                                Female
                                            </label>
                                        </div>
                                        {errors.gender && <span className={styles.errorMessage}>{errors.gender}</span>}
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
                                        {/* Blank space to keep grid alignment if needed, or leave empty */}
                                    </div>

                                    {/* 🟢 PASSWORD SETUP */}
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
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                                        <label className={styles.label}>Confirm Password *</label>
                                        <div className={styles.passwordWrapper}>
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                                                placeholder="Confirm your password"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                            />
                                            <button
                                                type="button"
                                                className={styles.eyeButton}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Department *</label>
                                        <div className={styles.multiSelectWrapper} ref={departmentRef}>
                                            <div className={styles.multiSelectTrigger} onClick={() => setDepartmentDropdownOpen(!departmentDropdownOpen)}>
                                                <span className={formData.department ? styles.selectedText : styles.placeholder}>
                                                    {formData.department || "Select your department"}
                                                </span>
                                                <ChevronDown size={18} className={`${styles.dropdownIcon} ${departmentDropdownOpen ? styles.rotated : ''}`} />
                                            </div>
                                            {departmentDropdownOpen && (
                                                <div className={styles.dropdownMenu}>
                                                    {departments.map((dept) => (
                                                        <div
                                                            key={dept}
                                                            className={`${styles.dropdownItem} ${formData.department === dept ? styles.selected : ''}`}
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, department: dept }));
                                                                setErrors(prev => ({ ...prev, department: '' }));
                                                                setDepartmentDropdownOpen(false);
                                                            }}
                                                        >
                                                            {dept}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {errors.department && <span className={styles.errorMessage}>{errors.department}</span>}
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Semester *</label>
                                        <div className={styles.multiSelectWrapper} ref={semesterRef}>
                                            <div className={styles.multiSelectTrigger} onClick={() => setSemesterDropdownOpen(!semesterDropdownOpen)}>
                                                <span className={formData.semester ? styles.selectedText : styles.placeholder}>
                                                    {formData.semester ? `Semester ${formData.semester}` : "Select your semester"}
                                                </span>
                                                <ChevronDown size={18} className={`${styles.dropdownIcon} ${semesterDropdownOpen ? styles.rotated : ''}`} />
                                            </div>
                                            {semesterDropdownOpen && (
                                                <div className={styles.dropdownMenu}>
                                                    {semesters.map((sem) => (
                                                        <div
                                                            key={sem}
                                                            className={`${styles.dropdownItem} ${formData.semester === sem ? styles.selected : ''}`}
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, semester: sem }));
                                                                setErrors(prev => ({ ...prev, semester: '' }));
                                                                setSemesterDropdownOpen(false);
                                                            }}
                                                        >
                                                            Semester {sem}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {errors.semester && <span className={styles.errorMessage}>{errors.semester}</span>}
                                    </div>
                                </div>
                            </motion.div>

                            {/* === ACADEMIC PROFILE SECTION === */}
                            <motion.div className={styles.section} variants={fadeUpItem}>
                                <h3 className={styles.sectionTitle}>📚 Academic Profile</h3>

                                <div className={styles.formGrid}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Academic Strengths</label>
                                        <small style={{ display: 'block', marginTop: '-4px', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                                            Your reliability quiz will be drawn only from these subjects.
                                        </small>
                                        <div className={styles.multiSelectWrapper} ref={strengthsRef}>
                                            <div className={styles.multiSelectTrigger} onClick={() => setStrengthsDropdownOpen(!strengthsDropdownOpen)}>
                                                <div className={styles.selectedTags}>
                                                    {formData.academicStrengths.length === 0 ? (
                                                        <span className={styles.placeholder}>Select your strengths...</span>
                                                    ) : (
                                                        formData.academicStrengths.map((subject) => (
                                                            <span key={subject} className={styles.tag}>
                                                                {subject}
                                                                <button type="button" className={styles.tagRemove} onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeSubject('academicStrengths', subject);
                                                                }}>
                                                                    <X size={12} />
                                                                </button>
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                                <ChevronDown size={18} className={`${styles.dropdownIcon} ${strengthsDropdownOpen ? styles.rotated : ''}`} />
                                            </div>
                                            {strengthsDropdownOpen && (
                                                <div className={styles.dropdownMenu}>
                                                    {availableSubjects.filter(s => s.active).map((subjectObj) => {
                                                        const isDisabled = formData.subjectsOfDifficulty.includes(subjectObj.name);
                                                        const isSelected = formData.academicStrengths.includes(subjectObj.name);
                                                        return (
                                                            <div
                                                                key={subjectObj.name}
                                                                className={`${styles.dropdownItem} ${isSelected ? styles.selected : ''}`}
                                                                onClick={() => {
                                                                    if (isDisabled) return;
                                                                    handleSubjectToggle('academicStrengths', subjectObj.name);
                                                                }}
                                                                style={isDisabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                                                                title={isDisabled ? 'Already selected as a difficult subject' : ''}
                                                            >
                                                                <span className={styles.itemCheckbox}>
                                                                    {isSelected && (
                                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                            <polyline points="20 6 9 17 4 12" />
                                                                        </svg>
                                                                    )}
                                                                </span>
                                                                {subjectObj.name}
                                                                {isDisabled && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>(in difficulties)</span>}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Subjects of Difficulty</label>
                                        <small style={{ display: 'block', marginTop: '-4px', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                                            Subjects you'd like help with — cannot overlap with strengths.
                                        </small>
                                        <div className={styles.multiSelectWrapper} ref={difficultyRef}>
                                            <div className={styles.multiSelectTrigger} onClick={() => setDifficultyDropdownOpen(!difficultyDropdownOpen)}>
                                                <div className={styles.selectedTags}>
                                                    {formData.subjectsOfDifficulty.length === 0 ? (
                                                        <span className={styles.placeholder}>Select difficult subjects...</span>
                                                    ) : (
                                                        formData.subjectsOfDifficulty.map((subject) => (
                                                            <span key={subject} className={styles.tag}>
                                                                {subject}
                                                                <button type="button" className={styles.tagRemove} onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeSubject('subjectsOfDifficulty', subject);
                                                                }}>
                                                                    <X size={12} />
                                                                </button>
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                                <ChevronDown size={18} className={`${styles.dropdownIcon} ${difficultyDropdownOpen ? styles.rotated : ''}`} />
                                            </div>
                                            {difficultyDropdownOpen && (
                                                <div className={styles.dropdownMenu}>
                                                    {availableSubjects.filter(s => s.active).map((subjectObj) => {
                                                        const isDisabled = formData.academicStrengths.includes(subjectObj.name);
                                                        const isSelected = formData.subjectsOfDifficulty.includes(subjectObj.name);
                                                        return (
                                                            <div
                                                                key={subjectObj.name}
                                                                className={`${styles.dropdownItem} ${isSelected ? styles.selected : ''}`}
                                                                onClick={() => {
                                                                    if (isDisabled) return;
                                                                    handleSubjectToggle('subjectsOfDifficulty', subjectObj.name);
                                                                }}
                                                                style={isDisabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                                                                title={isDisabled ? 'Already selected as a strength' : ''}
                                                            >
                                                                <span className={styles.itemCheckbox}>
                                                                    {isSelected && (
                                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                            <polyline points="20 6 9 17 4 12" />
                                                                        </svg>
                                                                    )}
                                                                </span>
                                                                {subjectObj.name}
                                                                {isDisabled && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>(in strengths)</span>}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* === LEARNING PREFERENCES === */}
                            <motion.div className={styles.section} variants={fadeUpItem}>
                                <h3 className={styles.sectionTitle}>Learning Preferences</h3>
                                <div className={styles.formGrid}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Preferred Study Style *</label>
                                        <div className={styles.singleSelectWrapper} ref={studyStyleRef}>
                                            <div className={styles.singleSelectTrigger} onClick={() => setStudyStyleDropdownOpen(!studyStyleDropdownOpen)}>
                                                <span className={formData.studyStyle ? styles.selectedText : styles.placeholder}>
                                                    {formData.studyStyle || "Select study style"}
                                                </span>
                                                <ChevronDown size={18} className={`${styles.dropdownIcon} ${studyStyleDropdownOpen ? styles.rotated : ''}`} />
                                            </div>
                                            {studyStyleDropdownOpen && (
                                                <div className={styles.dropdownMenu}>
                                                    {studyStyles.map((style) => (
                                                        <div key={style} className={`${styles.dropdownItem} ${formData.studyStyle === style ? styles.selected : ''}`} onClick={() => {
                                                            setFormData(prev => ({ ...prev, studyStyle: style }));
                                                            setErrors(prev => ({ ...prev, studyStyle: '' }));
                                                            setStudyStyleDropdownOpen(false);
                                                        }}>
                                                            <div className={styles.itemRadio}>
                                                                {formData.studyStyle === style && <div className={styles.radioInner} />}
                                                            </div>
                                                            <span>{style}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {errors.studyStyle && <span className={styles.errorMessage}>{errors.studyStyle}</span>}
                                    </div>

                                    {/* 🟢 ADDED: Manual Referral Code Entry */}
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Referral Code (Optional)</label>
                                        <input
                                            type="text"
                                            name="referredByCode"
                                            className={styles.input}
                                            placeholder="Got a code from a friend?"
                                            value={formData.referredByCode}
                                            onChange={handleInputChange}
                                            style={{ textTransform: 'uppercase' }}
                                        />
                                    </div>
                                </div>

                                {/* Availability Section */}
                                <div className={styles.inputGroup} style={{ marginTop: '20px' }}>
                                    <label className={styles.label}>Describe your available study times</label>
                                    <textarea
                                        name="availability"
                                        className={`${styles.textarea} ${errors.availability ? styles.inputError : ''}`}
                                        placeholder="E.g., Weekdays 6-9 PM, Weekends flexible..."
                                        value={formData.availability}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        rows={3}
                                    />
                                    {errors.availability && <span className={styles.errorMessage}>{errors.availability}</span>}
                                </div>
                            </motion.div>

                            {/* 🟢 ADDED: Legal / TOS Checkbox */}
                            <motion.div className={styles.legalSection} variants={fadeUpItem} style={{ marginTop: '30px', marginBottom: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleInputChange}
                                        style={{ marginTop: '4px', width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        I agree to the <Link to="/terms" style={{ color: 'var(--primary-color)' }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: 'var(--primary-color)' }}>Privacy Policy</Link>.
                                    </span>
                                </label>
                                {errors.acceptTerms && <span className={styles.errorMessage} style={{ display: 'block', marginTop: '5px' }}>{errors.acceptTerms}</span>}
                            </motion.div>

                            <motion.button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting || !formData.acceptTerms}
                                style={{ opacity: (!formData.acceptTerms || isSubmitting) ? 0.6 : 1 }}
                                whileHover={(!formData.acceptTerms || isSubmitting) ? {} : { y: -2, scale: 1.01 }}
                                whileTap={(!formData.acceptTerms || isSubmitting) ? {} : { scale: 0.97 }}
                                transition={springs.snappy}
                            >
                                {isSubmitting ? 'Creating Secure Profile...' : 'Create Profile'}
                            </motion.button>
                        </form>
                    </motion.div>
                </main>
            </div>
        </PageWrapper>
    );
};

export default Signup;