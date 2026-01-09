import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import styles from './Signup.module.css';
import Alert from '../../components/Alert/Alert';
import PageTransition from '../../components/PageTransition/PageTransition';

const departments = [
    'Information Technology',
];

const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

const studyStyles = [
    'Individual Study',
    'Group Collaboration',
    'One-on-One Mentoring'
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

    const [strengthsDropdownOpen, setStrengthsDropdownOpen] = useState(false);
    const [difficultyDropdownOpen, setDifficultyDropdownOpen] = useState(false);
    const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
    const [semesterDropdownOpen, setSemesterDropdownOpen] = useState(false);
    const strengthsRef = useRef(null);
    const difficultyRef = useRef(null);
    const departmentRef = useRef(null);
    const semesterRef = useRef(null);
    const studyStyleRef = useRef(null);
    const [studyStyleDropdownOpen, setStudyStyleDropdownOpen] = useState(false);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (strengthsRef.current && !strengthsRef.current.contains(event.target)) {
                setStrengthsDropdownOpen(false);
            }
            if (difficultyRef.current && !difficultyRef.current.contains(event.target)) {
                setDifficultyDropdownOpen(false);
            }
            if (departmentRef.current && !departmentRef.current.contains(event.target)) {
                setDepartmentDropdownOpen(false);
            }
            if (semesterRef.current && !semesterRef.current.contains(event.target)) {
                setSemesterDropdownOpen(false);
            }
            if (studyStyleRef.current && !studyStyleRef.current.contains(event.target)) {
                setStudyStyleDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const [formData, setFormData] = useState({
        fullName: '',
        rollNumber: '',
        profilePicture: null,
        email: '',
        password: '',
        gender: '',
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
            case 'gender':
                if (!value) return 'Please select a gender';
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

    // 🔹 HANDLERS FOR MULTI SELECT
    const handleSubjectToggle = (field, subjectName) => {
        setFormData((prev) => {
            const current = prev[field];
            const updated = current.includes(subjectName)
                ? current.filter((s) => s !== subjectName)
                : [...current, subjectName];
            return { ...prev, [field]: updated };
        });
    };

    const removeSubject = (field, subjectName) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((s) => s !== subjectName)
        }));
    };

    // const handleCheckboxChange = (field, subjectName) => {
    //     setFormData((prev) => {
    //         const current = prev[field];
    //         const updated = current.includes(subjectName)
    //             ? current.filter((s) => s !== subjectName)
    //             : [...current, subjectName];
    //         return { ...prev, [field]: updated };
    //     });
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertError('');
        setSuccess('');

        const newErrors = {};
        ['fullName', 'email', 'password', 'rollNumber', 'gender'].forEach(f => {
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
                if (data.token) sessionStorage.setItem('token', data.token);
            }

            setSuccess("Profile created successfully! Redirecting...");
            // LOGIC UPDATE: Check for Strengths and Redirect to Quiz
            setTimeout(() => {
                if (data.user.role === 'admin') {
                    window.location.href = '/admin';
                } else if (formData.academicStrengths.length > 0) {
                    // Redirect to Quiz if user selected strong subjects
                    window.location.href = '/quiz';
                } else {
                    window.location.href = '/dashboard';
                }
            }, 1500);
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
                                        <div className={styles.multiSelectWrapper} ref={departmentRef}>
                                            <div
                                                className={styles.multiSelectTrigger}
                                                onClick={() => setDepartmentDropdownOpen(!departmentDropdownOpen)}
                                            >
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
                                                                setDepartmentDropdownOpen(false);
                                                            }}
                                                        >
                                                            {dept}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Semester *</label>
                                        <div className={styles.multiSelectWrapper} ref={semesterRef}>
                                            <div
                                                className={styles.multiSelectTrigger}
                                                onClick={() => setSemesterDropdownOpen(!semesterDropdownOpen)}
                                            >
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
                                                                setSemesterDropdownOpen(false);
                                                            }}
                                                        >
                                                            Semester {sem}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Academic Profile Section */}
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>📚 Academic Profile</h3>

                                <div className={styles.formGrid}>
                                    {/* Academic Strengths Multi-Select */}
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Academic Strengths</label>
                                        <div className={styles.multiSelectWrapper} ref={strengthsRef}>
                                            <div
                                                className={styles.multiSelectTrigger}
                                                onClick={() => setStrengthsDropdownOpen(!strengthsDropdownOpen)}
                                            >
                                                <div className={styles.selectedTags}>
                                                    {formData.academicStrengths.length === 0 ? (
                                                        <span className={styles.placeholder}>Select your strengths...</span>
                                                    ) : (
                                                        formData.academicStrengths.map((subject) => (
                                                            <span key={subject} className={styles.tag}>
                                                                {subject}
                                                                <button
                                                                    type="button"
                                                                    className={styles.tagRemove}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        removeSubject('academicStrengths', subject);
                                                                    }}
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                                <ChevronDown
                                                    size={18}
                                                    className={`${styles.dropdownIcon} ${strengthsDropdownOpen ? styles.rotated : ''}`}
                                                />
                                            </div>
                                            {strengthsDropdownOpen && (
                                                <div className={styles.dropdownMenu}>
                                                    {availableSubjects.filter(s => s.active).map((subjectObj) => (
                                                        <div
                                                            key={subjectObj.name}
                                                            className={`${styles.dropdownItem} ${formData.academicStrengths.includes(subjectObj.name) ? styles.selected : ''
                                                                }`}
                                                            onClick={() => handleSubjectToggle('academicStrengths', subjectObj.name)}
                                                        >
                                                            <span className={styles.itemCheckbox}>
                                                                {formData.academicStrengths.includes(subjectObj.name) && (
                                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                        <polyline points="20 6 9 17 4 12" />
                                                                    </svg>
                                                                )}
                                                            </span>
                                                            {subjectObj.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Subjects of Difficulty Multi-Select */}
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Subjects of Difficulty</label>
                                        <div className={styles.multiSelectWrapper} ref={difficultyRef}>
                                            <div
                                                className={styles.multiSelectTrigger}
                                                onClick={() => setDifficultyDropdownOpen(!difficultyDropdownOpen)}
                                            >
                                                <div className={styles.selectedTags}>
                                                    {formData.subjectsOfDifficulty.length === 0 ? (
                                                        <span className={styles.placeholder}>Select difficult subjects...</span>
                                                    ) : (
                                                        formData.subjectsOfDifficulty.map((subject) => (
                                                            <span key={subject} className={styles.tag}>
                                                                {subject}
                                                                <button
                                                                    type="button"
                                                                    className={styles.tagRemove}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        removeSubject('subjectsOfDifficulty', subject);
                                                                    }}
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                                <ChevronDown
                                                    size={18}
                                                    className={`${styles.dropdownIcon} ${difficultyDropdownOpen ? styles.rotated : ''}`}
                                                />
                                            </div>
                                            {difficultyDropdownOpen && (
                                                <div className={styles.dropdownMenu}>
                                                    {availableSubjects.filter(s => s.active).map((subjectObj) => (
                                                        <div
                                                            key={subjectObj.name}
                                                            className={`${styles.dropdownItem} ${formData.subjectsOfDifficulty.includes(subjectObj.name) ? styles.selected : ''
                                                                }`}
                                                            onClick={() => handleSubjectToggle('subjectsOfDifficulty', subjectObj.name)}
                                                        >
                                                            <span className={styles.itemCheckbox}>
                                                                {formData.subjectsOfDifficulty.includes(subjectObj.name) && (
                                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                        <polyline points="20 6 9 17 4 12" />
                                                                    </svg>
                                                                )}
                                                            </span>
                                                            {subjectObj.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Learning Preferences Section */}
                            <div className={styles.section}>
                                <h3 className={styles.sectionTitle}>Learning Preferences</h3>
                                <div className={styles.formGrid}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Preferred Study Style</label>
                                        <div className={styles.singleSelectWrapper} ref={studyStyleRef}>
                                            <div
                                                className={styles.singleSelectTrigger}
                                                onClick={() => setStudyStyleDropdownOpen(!studyStyleDropdownOpen)}
                                            >
                                                <span className={formData.studyStyle ? styles.selectedText : styles.placeholder}>
                                                    {formData.studyStyle || "Select study style"}
                                                </span>
                                                <ChevronDown size={18} className={`${styles.dropdownIcon} ${studyStyleDropdownOpen ? styles.rotated : ''}`} />
                                            </div>
                                            {studyStyleDropdownOpen && (
                                                <div className={styles.dropdownMenu}>
                                                    {studyStyles.map((style) => (
                                                        <div
                                                            key={style}
                                                            className={`${styles.dropdownItem} ${formData.studyStyle === style ? styles.selected : ''}`}
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, studyStyle: style }));
                                                                setStudyStyleDropdownOpen(false);
                                                            }}
                                                        >
                                                            <div className={styles.itemRadio}>
                                                                {formData.studyStyle === style && (
                                                                    <div className={styles.radioInner} />
                                                                )}
                                                            </div>
                                                            <span>{style}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
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