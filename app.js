/* ==========================================
   AI RESUME & PORTFOLIO BUILDER — APP.JS
   ========================================== */

// ==========================================
// STATE
// ==========================================
let currentStep = 1;
const totalSteps = 6;
let selectedTemplate = 'modern';
let resumeData = {};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initStatCounters();
    initNavHighlight();
});

// ==========================================
// NAVBAR
// ==========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const links = document.getElementById('nav-links');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
        });
    });
}

// ==========================================
// NAVIGATION HIGHLIGHT ON SCROLL
// ==========================================
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// ==========================================
// SCROLL TO SECTION
// ==========================================
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ==========================================
// SCROLL REVEAL ANIMATION
// ==========================================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.feature-card, .template-card');
    reveals.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

// ==========================================
// STAT COUNTER ANIMATION
// ==========================================
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el, target) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString();
    }, 25);
}

// ==========================================
// FORM STEP NAVIGATION
// ==========================================
function nextStep() {
    if (currentStep >= totalSteps) return;

    // Basic validation for step 1
    if (currentStep === 1) {
        const name = document.getElementById('fullName').value.trim();
        const title = document.getElementById('jobTitle').value.trim();
        const email = document.getElementById('email').value.trim();
        if (!name || !title || !email) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
    }

    currentStep++;
    updateFormStep();
}

function prevStep() {
    if (currentStep <= 1) return;
    currentStep--;
    updateFormStep();
}

function goToStep(step) {
    currentStep = step;
    updateFormStep();
}

function updateFormStep() {
    // Update form steps visibility
    document.querySelectorAll('.form-step').forEach((el, i) => {
        el.classList.remove('active');
        if (i + 1 === currentStep) {
            el.classList.add('active');
        }
    });

    // Update step indicators
    document.querySelectorAll('.step-indicator').forEach((el, i) => {
        el.classList.remove('active', 'completed');
        if (i + 1 === currentStep) {
            el.classList.add('active');
        } else if (i + 1 < currentStep) {
            el.classList.add('completed');
        }
    });

    // Update progress bar
    const fill = document.getElementById('step-progress-fill');
    fill.style.width = `${(currentStep / totalSteps) * 100}%`;

    // Update buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const genBtn = document.getElementById('generate-btn');

    prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';

    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        genBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        genBtn.style.display = 'none';
    }

    // Scroll to top of builder
    document.getElementById('builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==========================================
// ADD / REMOVE ENTRIES
// ==========================================
function addEducation() {
    const container = document.getElementById('education-entries');
    const count = container.querySelectorAll('.entry-card').length;
    const html = `
        <div class="entry-card" data-index="${count}">
            <div class="entry-header">
                <span class="entry-badge">Education #${count + 1}</span>
                <button type="button" class="entry-remove" onclick="removeEntry(this, 'education')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Degree</label>
                    <div class="input-wrapper">
                        <i class="fas fa-award input-icon"></i>
                        <input type="text" name="edu_degree[]" placeholder="e.g. B.Tech in Computer Science">
                    </div>
                </div>
                <div class="form-group">
                    <label>Institution</label>
                    <div class="input-wrapper">
                        <i class="fas fa-building-columns input-icon"></i>
                        <input type="text" name="edu_institution[]" placeholder="e.g. MIT">
                    </div>
                </div>
                <div class="form-group">
                    <label>Year</label>
                    <div class="input-wrapper">
                        <i class="fas fa-calendar input-icon"></i>
                        <input type="text" name="edu_year[]" placeholder="e.g. 2020 - 2024">
                    </div>
                </div>
                <div class="form-group">
                    <label>Grade / GPA</label>
                    <div class="input-wrapper">
                        <i class="fas fa-star input-icon"></i>
                        <input type="text" name="edu_grade[]" placeholder="e.g. 3.8 / 4.0">
                    </div>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addExperience() {
    const container = document.getElementById('experience-entries');
    const count = container.querySelectorAll('.entry-card').length;
    const html = `
        <div class="entry-card" data-index="${count}">
            <div class="entry-header">
                <span class="entry-badge">Experience #${count + 1}</span>
                <button type="button" class="entry-remove" onclick="removeEntry(this, 'experience')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Job Title</label>
                    <div class="input-wrapper">
                        <i class="fas fa-id-badge input-icon"></i>
                        <input type="text" name="exp_title[]" placeholder="e.g. Frontend Developer">
                    </div>
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <div class="input-wrapper">
                        <i class="fas fa-building input-icon"></i>
                        <input type="text" name="exp_company[]" placeholder="e.g. Google">
                    </div>
                </div>
                <div class="form-group">
                    <label>Duration</label>
                    <div class="input-wrapper">
                        <i class="fas fa-calendar-days input-icon"></i>
                        <input type="text" name="exp_duration[]" placeholder="e.g. Jan 2023 - Present">
                    </div>
                </div>
                <div class="form-group full-width">
                    <label>Description</label>
                    <div class="input-wrapper textarea-wrapper">
                        <i class="fas fa-align-left input-icon"></i>
                        <textarea name="exp_description[]" rows="3" placeholder="Describe your responsibilities and achievements..."></textarea>
                        <button type="button" class="ai-suggest-btn" onclick="aiSuggestExperience(this)" title="Get AI Suggestion">
                            <i class="fas fa-wand-magic-sparkles"></i> AI Enhance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addProject() {
    const container = document.getElementById('project-entries');
    const count = container.querySelectorAll('.entry-card').length;
    const html = `
        <div class="entry-card" data-index="${count}">
            <div class="entry-header">
                <span class="entry-badge">Project #${count + 1}</span>
                <button type="button" class="entry-remove" onclick="removeEntry(this, 'project')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Project Name</label>
                    <div class="input-wrapper">
                        <i class="fas fa-folder-open input-icon"></i>
                        <input type="text" name="proj_name[]" placeholder="e.g. E-Commerce Platform">
                    </div>
                </div>
                <div class="form-group">
                    <label>Tech Stack</label>
                    <div class="input-wrapper">
                        <i class="fas fa-layer-group input-icon"></i>
                        <input type="text" name="proj_tech[]" placeholder="e.g. React, Node.js, MongoDB">
                    </div>
                </div>
                <div class="form-group">
                    <label>Project Link</label>
                    <div class="input-wrapper">
                        <i class="fas fa-external-link input-icon"></i>
                        <input type="url" name="proj_link[]" placeholder="e.g. https://github.com/...">
                    </div>
                </div>
                <div class="form-group full-width">
                    <label>Description</label>
                    <div class="input-wrapper textarea-wrapper">
                        <i class="fas fa-align-left input-icon"></i>
                        <textarea name="proj_description[]" rows="3" placeholder="Describe what the project does..."></textarea>
                        <button type="button" class="ai-suggest-btn" onclick="aiSuggestProject(this)" title="Get AI Suggestion">
                            <i class="fas fa-wand-magic-sparkles"></i> AI Enhance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function removeEntry(btn, type) {
    const card = btn.closest('.entry-card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        card.remove();
        // Re-number badges
        const container = document.getElementById(`${type === 'education' ? 'education' : type === 'experience' ? 'experience' : 'project'}-entries`);
        container.querySelectorAll('.entry-badge').forEach((badge, i) => {
            const label = type.charAt(0).toUpperCase() + type.slice(1);
            badge.textContent = `${label} #${i + 1}`;
        });
    }, 300);
}

// ==========================================
// TEMPLATE SELECTION
// ==========================================
function selectTemplate(template) {
    selectedTemplate = template;
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.template === template) {
            card.classList.add('active');
        }
    });
    showToast(`${template.charAt(0).toUpperCase() + template.slice(1)} template selected`, 'success');
}

// ==========================================
// COLLECT FORM DATA
// ==========================================
function collectFormData() {
    const data = {
        fullName: document.getElementById('fullName').value.trim(),
        jobTitle: document.getElementById('jobTitle').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        location: document.getElementById('location').value.trim(),
        website: document.getElementById('website').value.trim(),
        summary: document.getElementById('summary').value.trim(),
        education: [],
        experience: [],
        technicalSkills: document.getElementById('technicalSkills').value.trim(),
        softSkills: document.getElementById('softSkills').value.trim(),
        languages: document.getElementById('languages').value.trim(),
        projects: [],
        certifications: document.getElementById('certifications').value.trim(),
        achievements: document.getElementById('achievements').value.trim(),
        hobbies: document.getElementById('hobbies').value.trim(),
    };

    // Gather education entries
    const eduDegrees = document.querySelectorAll('input[name="edu_degree[]"]');
    const eduInstitutions = document.querySelectorAll('input[name="edu_institution[]"]');
    const eduYears = document.querySelectorAll('input[name="edu_year[]"]');
    const eduGrades = document.querySelectorAll('input[name="edu_grade[]"]');

    eduDegrees.forEach((_, i) => {
        const degree = eduDegrees[i].value.trim();
        const institution = eduInstitutions[i].value.trim();
        if (degree || institution) {
            data.education.push({
                degree,
                institution,
                year: eduYears[i].value.trim(),
                grade: eduGrades[i].value.trim(),
            });
        }
    });

    // Gather experience entries
    const expTitles = document.querySelectorAll('input[name="exp_title[]"]');
    const expCompanies = document.querySelectorAll('input[name="exp_company[]"]');
    const expDurations = document.querySelectorAll('input[name="exp_duration[]"]');
    const expDescs = document.querySelectorAll('textarea[name="exp_description[]"]');

    expTitles.forEach((_, i) => {
        const title = expTitles[i].value.trim();
        const company = expCompanies[i].value.trim();
        if (title || company) {
            data.experience.push({
                title,
                company,
                duration: expDurations[i].value.trim(),
                description: expDescs[i].value.trim(),
            });
        }
    });

    // Gather project entries
    const projNames = document.querySelectorAll('input[name="proj_name[]"]');
    const projTechs = document.querySelectorAll('input[name="proj_tech[]"]');
    const projLinks = document.querySelectorAll('input[name="proj_link[]"]');
    const projDescs = document.querySelectorAll('textarea[name="proj_description[]"]');

    projNames.forEach((_, i) => {
        const name = projNames[i].value.trim();
        if (name) {
            data.projects.push({
                name,
                tech: projTechs[i].value.trim(),
                link: projLinks[i].value.trim(),
                description: projDescs[i].value.trim(),
            });
        }
    });

    return data;
}

// ==========================================
// GENERATE RESUME
// ==========================================
function generateResume() {
    resumeData = collectFormData();

    if (!resumeData.fullName || !resumeData.jobTitle) {
        showToast('Please fill in at least your name and job title', 'error');
        return;
    }

    const resumeOutput = document.getElementById('resume-output');
    const portfolioOutput = document.getElementById('portfolio-output');

    // Generate resume HTML based on selected template
    resumeOutput.innerHTML = generateResumeHTML(resumeData, selectedTemplate);

    // Generate portfolio HTML
    portfolioOutput.innerHTML = generatePortfolioHTML(resumeData);

    // Show modal
    openModal();
    switchView('resume');

    showToast('Resume generated successfully!', 'success');
}

// ==========================================
// RESUME HTML GENERATORS
// ==========================================
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function parseSkills(skillString) {
    if (!skillString) return [];
    return skillString.split(',').map(s => s.trim()).filter(s => s);
}

function parseLines(text) {
    if (!text) return [];
    return text.split('\n').map(s => s.trim()).filter(s => s);
}

function descriptionToList(desc) {
    if (!desc) return '';
    const lines = desc.split('\n').filter(l => l.trim());
    if (lines.length > 1) {
        return '<ul>' + lines.map(l => `<li>${escapeHtml(l.replace(/^[-•]\s*/, ''))}</li>`).join('') + '</ul>';
    }
    return `<p>${escapeHtml(desc)}</p>`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateResumeHTML(data, template) {
    switch (template) {
        case 'modern': return generateModernResume(data);
        case 'classic': return generateClassicResume(data);
        case 'minimal': return generateMinimalResume(data);
        case 'creative': return generateCreativeResume(data);
        default: return generateModernResume(data);
    }
}

// ---- MODERN TEMPLATE ----
function generateModernResume(data) {
    const techSkills = parseSkills(data.technicalSkills);
    const softSkills = parseSkills(data.softSkills);
    const certs = parseLines(data.certifications);
    const achievements = parseLines(data.achievements);

    let sidebar = `
        <div class="rm-sidebar">
            <div class="rm-avatar">${getInitials(data.fullName)}</div>
            <div class="rm-name">${escapeHtml(data.fullName)}</div>
            <div class="rm-title">${escapeHtml(data.jobTitle)}</div>
            <div class="rm-sidebar-section">
                <div class="rm-sidebar-title">Contact</div>
                ${data.email ? `<div class="rm-contact-item"><i class="fas fa-envelope"></i> ${escapeHtml(data.email)}</div>` : ''}
                ${data.phone ? `<div class="rm-contact-item"><i class="fas fa-phone"></i> ${escapeHtml(data.phone)}</div>` : ''}
                ${data.location ? `<div class="rm-contact-item"><i class="fas fa-location-dot"></i> ${escapeHtml(data.location)}</div>` : ''}
                ${data.website ? `<div class="rm-contact-item"><i class="fas fa-link"></i> ${escapeHtml(data.website)}</div>` : ''}
            </div>
            ${techSkills.length ? `
            <div class="rm-sidebar-section">
                <div class="rm-sidebar-title">Skills</div>
                ${techSkills.map(s => `<span class="rm-skill-tag">${escapeHtml(s)}</span>`).join('')}
            </div>` : ''}
            ${softSkills.length ? `
            <div class="rm-sidebar-section">
                <div class="rm-sidebar-title">Soft Skills</div>
                ${softSkills.map(s => `<span class="rm-skill-tag">${escapeHtml(s)}</span>`).join('')}
            </div>` : ''}
            ${data.languages ? `
            <div class="rm-sidebar-section">
                <div class="rm-sidebar-title">Languages</div>
                <div class="rm-contact-item" style="display:block; font-size:0.8rem; color:rgba(255,255,255,0.8);">${escapeHtml(data.languages)}</div>
            </div>` : ''}
            ${data.hobbies ? `
            <div class="rm-sidebar-section">
                <div class="rm-sidebar-title">Interests</div>
                <div class="rm-contact-item" style="display:block; font-size:0.8rem; color:rgba(255,255,255,0.8);">${escapeHtml(data.hobbies)}</div>
            </div>` : ''}
        </div>
    `;

    let main = `<div class="rm-main">`;

    if (data.summary) {
        main += `
        <div class="rm-section">
            <div class="rm-section-title">Professional Summary</div>
            <div class="rm-entry-desc"><p>${escapeHtml(data.summary)}</p></div>
        </div>`;
    }

    if (data.experience.length) {
        main += `<div class="rm-section"><div class="rm-section-title">Experience</div>`;
        data.experience.forEach(exp => {
            main += `
            <div class="rm-entry">
                <div class="rm-entry-header">
                    <div>
                        <div class="rm-entry-title">${escapeHtml(exp.title)}</div>
                        <div class="rm-entry-sub">${escapeHtml(exp.company)}</div>
                    </div>
                    <div class="rm-entry-date">${escapeHtml(exp.duration)}</div>
                </div>
                <div class="rm-entry-desc">${descriptionToList(exp.description)}</div>
            </div>`;
        });
        main += `</div>`;
    }

    if (data.education.length) {
        main += `<div class="rm-section"><div class="rm-section-title">Education</div>`;
        data.education.forEach(edu => {
            main += `
            <div class="rm-entry">
                <div class="rm-entry-header">
                    <div>
                        <div class="rm-entry-title">${escapeHtml(edu.degree)}</div>
                        <div class="rm-entry-sub">${escapeHtml(edu.institution)}</div>
                    </div>
                    <div class="rm-entry-date">${escapeHtml(edu.year)}${edu.grade ? ` | ${escapeHtml(edu.grade)}` : ''}</div>
                </div>
            </div>`;
        });
        main += `</div>`;
    }

    if (data.projects.length) {
        main += `<div class="rm-section"><div class="rm-section-title">Projects</div>`;
        data.projects.forEach(proj => {
            main += `
            <div class="rm-entry">
                <div class="rm-entry-header">
                    <div>
                        <div class="rm-entry-title">${escapeHtml(proj.name)}</div>
                        <div class="rm-entry-sub">${escapeHtml(proj.tech)}</div>
                    </div>
                </div>
                <div class="rm-entry-desc">${descriptionToList(proj.description)}</div>
                ${proj.link ? `<a class="rm-project-link" href="${escapeHtml(proj.link)}" target="_blank"><i class="fas fa-external-link-alt"></i> ${escapeHtml(proj.link)}</a>` : ''}
            </div>`;
        });
        main += `</div>`;
    }

    if (certs.length) {
        main += `<div class="rm-section"><div class="rm-section-title">Certifications</div>`;
        certs.forEach(cert => {
            main += `<div class="rm-entry"><div class="rm-entry-desc"><p>• ${escapeHtml(cert)}</p></div></div>`;
        });
        main += `</div>`;
    }

    if (achievements.length) {
        main += `<div class="rm-section"><div class="rm-section-title">Achievements</div>`;
        achievements.forEach(ach => {
            main += `<div class="rm-entry"><div class="rm-entry-desc"><p>• ${escapeHtml(ach)}</p></div></div>`;
        });
        main += `</div>`;
    }

    main += `</div>`;

    return `<div class="resume-modern">${sidebar}${main}</div>`;
}

// ---- CLASSIC TEMPLATE ----
function generateClassicResume(data) {
    const techSkills = parseSkills(data.technicalSkills);
    const softSkills = parseSkills(data.softSkills);
    const certs = parseLines(data.certifications);
    const achievements = parseLines(data.achievements);
    const allSkills = [...techSkills, ...softSkills];

    let html = `<div class="resume-classic">`;

    html += `
    <div class="rc-header">
        <div class="rc-name">${escapeHtml(data.fullName)}</div>
        <div class="rc-title">${escapeHtml(data.jobTitle)}</div>
        <div class="rc-contact">
            ${data.email ? `<span><i class="fas fa-envelope"></i> ${escapeHtml(data.email)}</span>` : ''}
            ${data.phone ? `<span><i class="fas fa-phone"></i> ${escapeHtml(data.phone)}</span>` : ''}
            ${data.location ? `<span><i class="fas fa-location-dot"></i> ${escapeHtml(data.location)}</span>` : ''}
            ${data.website ? `<span><i class="fas fa-link"></i> ${escapeHtml(data.website)}</span>` : ''}
        </div>
    </div>
    <div class="rc-body">`;

    if (data.summary) {
        html += `
        <div class="rc-section">
            <div class="rc-section-title">Professional Summary</div>
            <div class="rc-summary">${escapeHtml(data.summary)}</div>
        </div>`;
    }

    if (data.experience.length) {
        html += `<div class="rc-section"><div class="rc-section-title">Experience</div>`;
        data.experience.forEach(exp => {
            html += `
            <div class="rc-entry">
                <div class="rc-entry-header">
                    <div>
                        <div class="rc-entry-title">${escapeHtml(exp.title)}</div>
                        <div class="rc-entry-sub">${escapeHtml(exp.company)}</div>
                    </div>
                    <div class="rc-entry-date">${escapeHtml(exp.duration)}</div>
                </div>
                <div class="rc-entry-desc">${descriptionToList(exp.description)}</div>
            </div>`;
        });
        html += `</div>`;
    }

    if (data.education.length) {
        html += `<div class="rc-section"><div class="rc-section-title">Education</div>`;
        data.education.forEach(edu => {
            html += `
            <div class="rc-entry">
                <div class="rc-entry-header">
                    <div>
                        <div class="rc-entry-title">${escapeHtml(edu.degree)}</div>
                        <div class="rc-entry-sub">${escapeHtml(edu.institution)}</div>
                    </div>
                    <div class="rc-entry-date">${escapeHtml(edu.year)}${edu.grade ? ` | GPA: ${escapeHtml(edu.grade)}` : ''}</div>
                </div>
            </div>`;
        });
        html += `</div>`;
    }

    if (allSkills.length) {
        html += `
        <div class="rc-section">
            <div class="rc-section-title">Skills</div>
            <div class="rc-skills-grid">
                ${allSkills.map(s => `<span class="rc-skill">${escapeHtml(s)}</span>`).join('')}
            </div>
        </div>`;
    }

    if (data.projects.length) {
        html += `<div class="rc-section"><div class="rc-section-title">Projects</div>`;
        data.projects.forEach(proj => {
            html += `
            <div class="rc-entry">
                <div class="rc-entry-header">
                    <div>
                        <div class="rc-entry-title">${escapeHtml(proj.name)}</div>
                        <div class="rc-entry-sub">${escapeHtml(proj.tech)}</div>
                    </div>
                </div>
                <div class="rc-entry-desc">${descriptionToList(proj.description)}</div>
            </div>`;
        });
        html += `</div>`;
    }

    if (certs.length) {
        html += `<div class="rc-section"><div class="rc-section-title">Certifications</div>`;
        certs.forEach(cert => {
            html += `<div class="rc-entry"><div class="rc-entry-desc">• ${escapeHtml(cert)}</div></div>`;
        });
        html += `</div>`;
    }

    if (achievements.length) {
        html += `<div class="rc-section"><div class="rc-section-title">Achievements</div>`;
        achievements.forEach(ach => {
            html += `<div class="rc-entry"><div class="rc-entry-desc">• ${escapeHtml(ach)}</div></div>`;
        });
        html += `</div>`;
    }

    html += `</div></div>`;
    return html;
}

// ---- MINIMAL TEMPLATE ----
function generateMinimalResume(data) {
    const techSkills = parseSkills(data.technicalSkills);
    const softSkills = parseSkills(data.softSkills);
    const certs = parseLines(data.certifications);
    const achievements = parseLines(data.achievements);
    const allSkills = [...techSkills, ...softSkills];

    let html = `<div class="resume-minimal">`;

    html += `
        <div class="rmin-name">${escapeHtml(data.fullName)}</div>
        <div class="rmin-title">${escapeHtml(data.jobTitle)}</div>
        <div class="rmin-contact">
            ${data.email ? `<span><i class="fas fa-envelope"></i> ${escapeHtml(data.email)}</span>` : ''}
            ${data.phone ? `<span><i class="fas fa-phone"></i> ${escapeHtml(data.phone)}</span>` : ''}
            ${data.location ? `<span><i class="fas fa-location-dot"></i> ${escapeHtml(data.location)}</span>` : ''}
        </div>
        <div class="rmin-divider"></div>
    `;

    if (data.summary) {
        html += `
        <div class="rmin-section">
            <div class="rmin-section-title">Summary</div>
            <div class="rmin-summary">${escapeHtml(data.summary)}</div>
        </div>`;
    }

    if (data.experience.length) {
        html += `<div class="rmin-section"><div class="rmin-section-title">Experience</div>`;
        data.experience.forEach(exp => {
            html += `
            <div class="rmin-entry">
                <div class="rmin-entry-header">
                    <div>
                        <div class="rmin-entry-title">${escapeHtml(exp.title)} – ${escapeHtml(exp.company)}</div>
                    </div>
                    <div class="rmin-entry-date">${escapeHtml(exp.duration)}</div>
                </div>
                <div class="rmin-entry-desc">${descriptionToList(exp.description)}</div>
            </div>`;
        });
        html += `</div>`;
    }

    if (data.education.length) {
        html += `<div class="rmin-section"><div class="rmin-section-title">Education</div>`;
        data.education.forEach(edu => {
            html += `
            <div class="rmin-entry">
                <div class="rmin-entry-header">
                    <div>
                        <div class="rmin-entry-title">${escapeHtml(edu.degree)}</div>
                        <div class="rmin-entry-sub">${escapeHtml(edu.institution)}</div>
                    </div>
                    <div class="rmin-entry-date">${escapeHtml(edu.year)}</div>
                </div>
            </div>`;
        });
        html += `</div>`;
    }

    if (allSkills.length) {
        html += `
        <div class="rmin-section">
            <div class="rmin-section-title">Skills</div>
            <div class="rmin-skills">${allSkills.map(s => `<span class="rmin-skill">${escapeHtml(s)}</span>`).join('')}</div>
        </div>`;
    }

    if (data.projects.length) {
        html += `<div class="rmin-section"><div class="rmin-section-title">Projects</div>`;
        data.projects.forEach(proj => {
            html += `
            <div class="rmin-entry">
                <div class="rmin-entry-title">${escapeHtml(proj.name)} <span style="font-weight:400;color:#9ca3af;font-size:0.82rem;">| ${escapeHtml(proj.tech)}</span></div>
                <div class="rmin-entry-desc">${descriptionToList(proj.description)}</div>
            </div>`;
        });
        html += `</div>`;
    }

    if (certs.length) {
        html += `<div class="rmin-section"><div class="rmin-section-title">Certifications</div>`;
        certs.forEach(c => { html += `<div class="rmin-entry-desc" style="margin-bottom:4px;">• ${escapeHtml(c)}</div>`; });
        html += `</div>`;
    }

    if (achievements.length) {
        html += `<div class="rmin-section"><div class="rmin-section-title">Achievements</div>`;
        achievements.forEach(a => { html += `<div class="rmin-entry-desc" style="margin-bottom:4px;">• ${escapeHtml(a)}</div>`; });
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

// ---- CREATIVE TEMPLATE ----
function generateCreativeResume(data) {
    const techSkills = parseSkills(data.technicalSkills);
    const softSkills = parseSkills(data.softSkills);
    const certs = parseLines(data.certifications);
    const achievements = parseLines(data.achievements);

    let html = `<div class="resume-creative">`;

    html += `
    <div class="rcr-header">
        <div class="rcr-avatar">${getInitials(data.fullName)}</div>
        <div class="rcr-header-info">
            <h2>${escapeHtml(data.fullName)}</h2>
            <p>${escapeHtml(data.jobTitle)}</p>
        </div>
    </div>
    <div class="rcr-contact-bar">
        ${data.email ? `<span><i class="fas fa-envelope"></i> ${escapeHtml(data.email)}</span>` : ''}
        ${data.phone ? `<span><i class="fas fa-phone"></i> ${escapeHtml(data.phone)}</span>` : ''}
        ${data.location ? `<span><i class="fas fa-location-dot"></i> ${escapeHtml(data.location)}</span>` : ''}
        ${data.website ? `<span><i class="fas fa-link"></i> ${escapeHtml(data.website)}</span>` : ''}
    </div>
    <div class="rcr-body">
        <div>
    `;

    if (data.summary) {
        html += `
        <div class="rcr-section">
            <div class="rcr-section-title">About Me</div>
            <div class="rcr-summary">${escapeHtml(data.summary)}</div>
        </div>`;
    }

    if (data.experience.length) {
        html += `<div class="rcr-section"><div class="rcr-section-title">Experience</div>`;
        data.experience.forEach(exp => {
            html += `
            <div class="rcr-entry">
                <div class="rcr-entry-title">${escapeHtml(exp.title)}</div>
                <div class="rcr-entry-sub">${escapeHtml(exp.company)}</div>
                <div class="rcr-entry-date">${escapeHtml(exp.duration)}</div>
                <div class="rcr-entry-desc">${descriptionToList(exp.description)}</div>
            </div>`;
        });
        html += `</div>`;
    }

    if (data.projects.length) {
        html += `<div class="rcr-section"><div class="rcr-section-title">Projects</div>`;
        data.projects.forEach(proj => {
            html += `
            <div class="rcr-entry">
                <div class="rcr-entry-title">${escapeHtml(proj.name)}</div>
                <div class="rcr-entry-sub">${escapeHtml(proj.tech)}</div>
                <div class="rcr-entry-desc">${descriptionToList(proj.description)}</div>
            </div>`;
        });
        html += `</div>`;
    }

    html += `</div><div>`;

    if (techSkills.length) {
        html += `
        <div class="rcr-section">
            <div class="rcr-section-title">Technical Skills</div>
            <div class="rcr-skill-bars">
                ${techSkills.slice(0, 8).map((s, i) => {
                    const width = Math.max(60, 100 - (i * 5));
                    return `
                    <div class="rcr-skill-bar">
                        <div class="rcr-skill-bar-label">${escapeHtml(s)}</div>
                        <div class="rcr-skill-bar-track"><div class="rcr-skill-bar-fill" style="width:${width}%"></div></div>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
    }

    if (data.education.length) {
        html += `<div class="rcr-section"><div class="rcr-section-title">Education</div>`;
        data.education.forEach(edu => {
            html += `
            <div class="rcr-entry">
                <div class="rcr-entry-title">${escapeHtml(edu.degree)}</div>
                <div class="rcr-entry-sub">${escapeHtml(edu.institution)}</div>
                <div class="rcr-entry-date">${escapeHtml(edu.year)}${edu.grade ? ` | ${escapeHtml(edu.grade)}` : ''}</div>
            </div>`;
        });
        html += `</div>`;
    }

    if (certs.length) {
        html += `<div class="rcr-section"><div class="rcr-section-title">Certifications</div>`;
        certs.forEach(c => {
            html += `<div class="rcr-entry-desc" style="margin-bottom:6px;font-size:0.82rem;color:#4b5563;">• ${escapeHtml(c)}</div>`;
        });
        html += `</div>`;
    }

    if (achievements.length) {
        html += `<div class="rcr-section"><div class="rcr-section-title">Achievements</div>`;
        achievements.forEach(a => {
            html += `<div class="rcr-entry-desc" style="margin-bottom:6px;font-size:0.82rem;color:#4b5563;">• ${escapeHtml(a)}</div>`;
        });
        html += `</div>`;
    }

    if (data.languages) {
        html += `
        <div class="rcr-section">
            <div class="rcr-section-title">Languages</div>
            <div class="rcr-entry-desc" style="font-size:0.82rem;color:#4b5563;">${escapeHtml(data.languages)}</div>
        </div>`;
    }

    html += `</div></div></div>`;
    return html;
}

// ==========================================
// PORTFOLIO HTML GENERATOR
// ==========================================
function generatePortfolioHTML(data) {
    const techSkills = parseSkills(data.technicalSkills);
    const softSkills = parseSkills(data.softSkills);
    const certs = parseLines(data.certifications);
    const achievements = parseLines(data.achievements);

    let html = `<div class="portfolio-page">`;

    // Hero
    html += `
    <div class="portfolio-hero">
        <div class="pf-avatar">${getInitials(data.fullName)}</div>
        <h1>${escapeHtml(data.fullName)}</h1>
        <div class="pf-title">${escapeHtml(data.jobTitle)}</div>
        ${data.summary ? `<div class="pf-summary">${escapeHtml(data.summary)}</div>` : ''}
    </div>`;

    // Skills
    if (techSkills.length || softSkills.length) {
        html += `
        <div class="portfolio-section">
            <h2><i class="fas fa-code"></i> Skills & Technologies</h2>
            <div class="pf-skills-grid">
                ${[...techSkills, ...softSkills].map(s => `<span class="pf-skill-chip">${escapeHtml(s)}</span>`).join('')}
            </div>
        </div>`;
    }

    // Experience
    if (data.experience.length) {
        html += `<div class="portfolio-section"><h2><i class="fas fa-briefcase"></i> Experience</h2>`;
        data.experience.forEach(exp => {
            html += `
            <div class="pf-experience-card">
                <h3>${escapeHtml(exp.title)}</h3>
                <div class="pf-company">${escapeHtml(exp.company)}</div>
                <div class="pf-date">${escapeHtml(exp.duration)}</div>
                <p>${escapeHtml(exp.description)}</p>
            </div>`;
        });
        html += `</div>`;
    }

    // Projects
    if (data.projects.length) {
        html += `<div class="portfolio-section"><h2><i class="fas fa-diagram-project"></i> Projects</h2>`;
        data.projects.forEach(proj => {
            html += `
            <div class="pf-project-card">
                <h3>${escapeHtml(proj.name)}</h3>
                <div class="pf-tech"><i class="fas fa-layer-group"></i> ${escapeHtml(proj.tech)}</div>
                <p>${escapeHtml(proj.description)}</p>
                ${proj.link ? `<a class="pf-project-link" href="${escapeHtml(proj.link)}" target="_blank"><i class="fas fa-external-link-alt"></i> View Project</a>` : ''}
            </div>`;
        });
        html += `</div>`;
    }

    // Education
    if (data.education.length) {
        html += `<div class="portfolio-section"><h2><i class="fas fa-graduation-cap"></i> Education</h2>`;
        data.education.forEach(edu => {
            html += `
            <div class="pf-education-item">
                <h3>${escapeHtml(edu.degree)}</h3>
                <p>${escapeHtml(edu.institution)} ${edu.year ? `| ${escapeHtml(edu.year)}` : ''} ${edu.grade ? `| ${escapeHtml(edu.grade)}` : ''}</p>
            </div>`;
        });
        html += `</div>`;
    }

    // Certifications
    if (certs.length) {
        html += `<div class="portfolio-section"><h2><i class="fas fa-certificate"></i> Certifications</h2>`;
        certs.forEach(c => {
            html += `<div class="pf-cert-item"><i class="fas fa-check-circle"></i> ${escapeHtml(c)}</div>`;
        });
        html += `</div>`;
    }

    // Achievements
    if (achievements.length) {
        html += `<div class="portfolio-section"><h2><i class="fas fa-trophy"></i> Achievements</h2>`;
        achievements.forEach(a => {
            html += `<div class="pf-achievement-item"><i class="fas fa-medal"></i> ${escapeHtml(a)}</div>`;
        });
        html += `</div>`;
    }

    // Contact
    html += `
    <div class="portfolio-section">
        <h2><i class="fas fa-paper-plane"></i> Contact</h2>
        <div class="pf-contact-grid">
            ${data.email ? `<div class="pf-contact-card"><i class="fas fa-envelope"></i> ${escapeHtml(data.email)}</div>` : ''}
            ${data.phone ? `<div class="pf-contact-card"><i class="fas fa-phone"></i> ${escapeHtml(data.phone)}</div>` : ''}
            ${data.location ? `<div class="pf-contact-card"><i class="fas fa-location-dot"></i> ${escapeHtml(data.location)}</div>` : ''}
            ${data.website ? `<div class="pf-contact-card"><i class="fas fa-link"></i> ${escapeHtml(data.website)}</div>` : ''}
        </div>
    </div>`;

    html += `</div>`;
    return html;
}

// ==========================================
// MODAL
// ==========================================
function openModal() {
    document.getElementById('resume-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('resume-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function switchView(view) {
    const resumeOut = document.getElementById('resume-output');
    const portfolioOut = document.getElementById('portfolio-output');
    const resumeBtn = document.getElementById('view-resume-btn');
    const portfolioBtn = document.getElementById('view-portfolio-btn');

    if (view === 'resume') {
        resumeOut.style.display = 'block';
        portfolioOut.style.display = 'none';
        resumeBtn.classList.remove('btn-outline');
        resumeBtn.classList.add('btn-primary');
        portfolioBtn.classList.remove('btn-primary');
        portfolioBtn.classList.add('btn-outline');
    } else {
        resumeOut.style.display = 'none';
        portfolioOut.style.display = 'block';
        portfolioBtn.classList.remove('btn-outline');
        portfolioBtn.classList.add('btn-primary');
        resumeBtn.classList.remove('btn-primary');
        resumeBtn.classList.add('btn-outline');
    }
}

// Close modal on overlay click
document.getElementById('resume-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ==========================================
// PDF DOWNLOAD
// ==========================================
function downloadResume() {
    const resumeEl = document.getElementById('resume-output');
    const name = resumeData.fullName || 'Resume';

    if (!resumeEl || !resumeEl.innerHTML.trim()) {
        showToast('No resume to download. Please generate one first.', 'error');
        return;
    }

    showToast('Opening print-ready resume...', 'info');

    // Build a self-contained print-ready HTML page with ALL styles inlined
    const printPage = buildPrintPage(name, resumeEl.innerHTML);

    // Open in a new tab (triggered by user click, so popup blockers won't block)
    const printWin = window.open('', '_blank');
    if (!printWin) {
        showToast('Popup blocked! Please allow popups and try again.', 'error');
        return;
    }

    printWin.document.write(printPage);
    printWin.document.close();
}

/**
 * Builds a complete, self-contained HTML page for printing/saving as PDF.
 * All CSS is inlined so it works independently of the parent page.
 */
function buildPrintPage(name, resumeHTML) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${name} - Resume</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<style>
/* === Reset === */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #f3f4f6;
    color: #1a1a2e;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

a { text-decoration: none; color: inherit; }

/* === Print Actions Bar === */
.print-actions {
    position: fixed;
    top: 0; left: 0; right: 0;
    background: #1a1a2e;
    color: #fff;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    z-index: 100;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    font-size: 0.9rem;
}

.print-actions span {
    color: rgba(255,255,255,0.7);
    font-size: 0.85rem;
}

.print-btn {
    padding: 10px 24px;
    border: none;
    border-radius: 10px;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.print-btn-primary {
    background: linear-gradient(135deg, #6c5ce7, #a855f7);
    color: #fff;
}

.print-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(108, 92, 231, 0.4);
}

.print-btn-secondary {
    background: rgba(255,255,255,0.1);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.2);
}

.print-btn-secondary:hover {
    background: rgba(255,255,255,0.15);
}

/* === Resume Container === */
.resume-wrapper {
    max-width: 794px;
    margin: 80px auto 40px;
    background: #fff;
    box-shadow: 0 8px 40px rgba(0,0,0,0.15);
}

/* ============================================================
   MODERN TEMPLATE
   ============================================================ */
.resume-modern {
    display: flex;
    background: #fff;
    color: #1a1a2e;
    font-family: 'Inter', sans-serif;
    min-height: 1000px;
}

.resume-modern .rm-sidebar {
    width: 35%;
    background: linear-gradient(180deg, #1a1a2e, #2d1b69);
    color: #fff;
    padding: 40px 28px;
    flex-shrink: 0;
}

.resume-modern .rm-avatar {
    width: 90px; height: 90px; border-radius: 50%;
    background: linear-gradient(135deg, #a78bfa, #6c5ce7);
    margin: 0 auto 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; font-weight: 800; color: #fff;
}

.resume-modern .rm-name {
    font-size: 1.3rem; font-weight: 800; text-align: center; margin-bottom: 4px;
}

.resume-modern .rm-title {
    font-size: 0.85rem; text-align: center; color: rgba(255,255,255,0.7); margin-bottom: 28px;
}

.resume-modern .rm-contact-item {
    display: flex; align-items: center; gap: 10px;
    font-size: 0.8rem; margin-bottom: 12px; color: rgba(255,255,255,0.8);
    word-break: break-all;
}

.resume-modern .rm-contact-item i {
    width: 16px; text-align: center; color: #a78bfa; flex-shrink: 0;
}

.resume-modern .rm-sidebar-section { margin-top: 28px; }

.resume-modern .rm-sidebar-title {
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.5px; color: #a78bfa; margin-bottom: 14px;
    padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.1);
}

.resume-modern .rm-skill-tag {
    display: inline-block; padding: 4px 10px;
    background: rgba(167, 139, 250, 0.15); border: 1px solid rgba(167, 139, 250, 0.2);
    border-radius: 100px; font-size: 0.72rem; margin: 0 4px 6px 0;
    color: rgba(255,255,255,0.85);
}

.resume-modern .rm-main { flex: 1; padding: 40px 32px; min-width: 0; }
.resume-modern .rm-section { margin-bottom: 28px; }

.resume-modern .rm-section-title {
    font-size: 0.9rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.5px; color: #6c5ce7; margin-bottom: 16px;
    padding-bottom: 8px; border-bottom: 2px solid #6c5ce7;
}

.resume-modern .rm-entry { margin-bottom: 18px; }

.resume-modern .rm-entry-header {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 4px; flex-wrap: wrap;
}

.resume-modern .rm-entry-title { font-size: 0.95rem; font-weight: 700; color: #1a1a2e; }
.resume-modern .rm-entry-sub { font-size: 0.82rem; color: #6b7280; font-style: italic; }
.resume-modern .rm-entry-date { font-size: 0.78rem; color: #9ca3af; white-space: nowrap; }

.resume-modern .rm-entry-desc {
    font-size: 0.82rem; color: #4b5563; line-height: 1.6; margin-top: 6px;
}
.resume-modern .rm-entry-desc ul { padding-left: 16px; }
.resume-modern .rm-entry-desc li { margin-bottom: 4px; }

.resume-modern .rm-project-link {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.75rem; color: #6c5ce7; margin-top: 4px;
}

/* ============================================================
   CLASSIC TEMPLATE
   ============================================================ */
.resume-classic { background: #fff; color: #1a1a2e; font-family: 'Inter', sans-serif; }

.resume-classic .rc-header {
    background: linear-gradient(135deg, #1e3a5f, #2563eb);
    color: #fff; padding: 36px 40px; text-align: center;
}

.resume-classic .rc-name { font-size: 2rem; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 4px; }
.resume-classic .rc-title { font-size: 1rem; color: rgba(255,255,255,0.8); margin-bottom: 16px; }

.resume-classic .rc-contact {
    display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;
    font-size: 0.82rem; color: rgba(255,255,255,0.85);
}
.resume-classic .rc-contact span { display: flex; align-items: center; gap: 6px; }

.resume-classic .rc-body { padding: 36px 40px; }
.resume-classic .rc-section { margin-bottom: 28px; }

.resume-classic .rc-section-title {
    font-size: 0.9rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 2px; color: #1e3a5f; margin-bottom: 14px;
    padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;
}

.resume-classic .rc-entry { margin-bottom: 16px; }
.resume-classic .rc-entry-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; }
.resume-classic .rc-entry-title { font-size: 0.95rem; font-weight: 700; }
.resume-classic .rc-entry-sub { font-size: 0.82rem; color: #6b7280; }
.resume-classic .rc-entry-date { font-size: 0.78rem; color: #9ca3af; }
.resume-classic .rc-entry-desc { font-size: 0.82rem; color: #4b5563; line-height: 1.6; margin-top: 4px; }
.resume-classic .rc-entry-desc ul { padding-left: 16px; }

.resume-classic .rc-skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.resume-classic .rc-skill {
    padding: 6px 14px; background: #f0f4ff; border: 1px solid #dbeafe;
    border-radius: 100px; font-size: 0.78rem; color: #1e3a5f; font-weight: 500;
}

.resume-classic .rc-summary { font-size: 0.88rem; color: #4b5563; line-height: 1.7; }

/* ============================================================
   MINIMAL TEMPLATE
   ============================================================ */
.resume-minimal {
    background: #fff; color: #1a1a2e; padding: 48px 44px; font-family: 'Inter', sans-serif;
}

.resume-minimal .rmin-name { font-size: 2.2rem; font-weight: 900; letter-spacing: -1px; margin-bottom: 4px; }
.resume-minimal .rmin-title { font-size: 1rem; color: #6b7280; margin-bottom: 12px; }

.resume-minimal .rmin-contact {
    display: flex; gap: 16px; flex-wrap: wrap; font-size: 0.82rem; color: #9ca3af; margin-bottom: 4px;
}
.resume-minimal .rmin-contact span { display: flex; align-items: center; gap: 6px; }

.resume-minimal .rmin-divider { height: 1px; background: #e5e7eb; margin: 24px 0; }
.resume-minimal .rmin-section { margin-bottom: 24px; }

.resume-minimal .rmin-section-title {
    font-size: 0.78rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 2px; color: #1a1a2e; margin-bottom: 14px;
}

.resume-minimal .rmin-entry { margin-bottom: 16px; }
.resume-minimal .rmin-entry-header { display: flex; justify-content: space-between; flex-wrap: wrap; }
.resume-minimal .rmin-entry-title { font-size: 0.95rem; font-weight: 700; }
.resume-minimal .rmin-entry-sub { font-size: 0.82rem; color: #6b7280; }
.resume-minimal .rmin-entry-date { font-size: 0.78rem; color: #9ca3af; }
.resume-minimal .rmin-entry-desc { font-size: 0.82rem; color: #4b5563; line-height: 1.6; margin-top: 4px; }
.resume-minimal .rmin-entry-desc ul { padding-left: 16px; }

.resume-minimal .rmin-skills { display: flex; flex-wrap: wrap; gap: 6px; }
.resume-minimal .rmin-skill { padding: 4px 12px; background: #f3f4f6; border-radius: 4px; font-size: 0.78rem; color: #374151; }
.resume-minimal .rmin-summary { font-size: 0.88rem; color: #4b5563; line-height: 1.7; }

/* ============================================================
   CREATIVE TEMPLATE
   ============================================================ */
.resume-creative { background: #fff; color: #1a1a2e; font-family: 'Inter', sans-serif; }

.resume-creative .rcr-header {
    background: linear-gradient(135deg, #6c5ce7, #a855f7, #06b6d4);
    color: #fff; padding: 36px 40px; display: flex; align-items: center; gap: 24px;
}

.resume-creative .rcr-avatar {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; font-weight: 800; flex-shrink: 0;
    border: 3px solid rgba(255,255,255,0.3);
}

.resume-creative .rcr-header-info h2 { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.5px; }
.resume-creative .rcr-header-info p { font-size: 0.95rem; color: rgba(255,255,255,0.8); margin-top: 2px; }

.resume-creative .rcr-contact-bar {
    background: #1a1a2e; color: rgba(255,255,255,0.85);
    padding: 14px 40px; display: flex; gap: 24px; flex-wrap: wrap; font-size: 0.8rem;
}
.resume-creative .rcr-contact-bar span { display: flex; align-items: center; gap: 6px; }
.resume-creative .rcr-contact-bar i { color: #a78bfa; }

.resume-creative .rcr-body {
    display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 36px 40px;
}

.resume-creative .rcr-section { margin-bottom: 24px; }

.resume-creative .rcr-section-title {
    font-size: 0.85rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.5px; color: #6c5ce7; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
}
.resume-creative .rcr-section-title::before {
    content: ''; width: 4px; height: 16px;
    background: linear-gradient(to bottom, #6c5ce7, #a855f7); border-radius: 2px;
}

.resume-creative .rcr-entry { margin-bottom: 14px; }
.resume-creative .rcr-entry-title { font-size: 0.92rem; font-weight: 700; }
.resume-creative .rcr-entry-sub { font-size: 0.8rem; color: #6b7280; }
.resume-creative .rcr-entry-date { font-size: 0.75rem; color: #9ca3af; }
.resume-creative .rcr-entry-desc { font-size: 0.82rem; color: #4b5563; line-height: 1.6; margin-top: 4px; }
.resume-creative .rcr-entry-desc ul { padding-left: 16px; }

.resume-creative .rcr-skill-bar { margin-bottom: 10px; }
.resume-creative .rcr-skill-bar-label { font-size: 0.78rem; font-weight: 600; margin-bottom: 4px; color: #374151; }
.resume-creative .rcr-skill-bar-track { height: 6px; background: #f3f4f6; border-radius: 3px; overflow: hidden; }
.resume-creative .rcr-skill-bar-fill {
    height: 100%; background: linear-gradient(90deg, #6c5ce7, #a855f7); border-radius: 3px;
}

.resume-creative .rcr-summary { font-size: 0.88rem; color: #4b5563; line-height: 1.7; }

/* ============================================================
   PRINT STYLES
   ============================================================ */
@page {
    size: A4;
    margin: 0;
}

@media print {
    body { background: #fff !important; }
    .print-actions { display: none !important; }
    .resume-wrapper { margin: 0; box-shadow: none; max-width: none; }
}
</style>
</head>
<body>
<div class="print-actions">
    <button class="print-btn print-btn-primary" onclick="window.print()">
        <i class="fas fa-download"></i> Save as PDF / Print
    </button>
    <span>Use "Save as PDF" as destination in the print dialog</span>
    <button class="print-btn print-btn-secondary" onclick="window.close()">
        <i class="fas fa-times"></i> Close
    </button>
</div>
<div class="resume-wrapper">
    ${resumeHTML}
</div>
<script>
    // Auto-trigger print after fonts are loaded
    document.fonts.ready.then(function() {
        setTimeout(function() { window.print(); }, 600);
    });
</script>
</body>
</html>`;
}

// ==========================================
// AI SUGGESTION ENGINE (CLIENT-SIDE)
// ==========================================
const aiSuggestions = {
    summary: [
        "Results-driven {title} with a passion for building scalable, high-performance applications. Experienced in leading cross-functional teams and delivering products that delight users. Adept at translating complex business requirements into elegant technical solutions.",
        "Innovative {title} with extensive experience in designing and implementing cutting-edge solutions. Known for strong analytical thinking, attention to detail, and commitment to writing clean, maintainable code. Passionate about leveraging technology to solve real-world problems.",
        "Dynamic and detail-oriented {title} with a proven track record of delivering high-quality projects on time. Skilled in agile methodologies, collaborative development, and continuous learning. Committed to driving innovation and exceeding expectations.",
        "Highly motivated {title} combining technical expertise with strong communication skills. Experienced in full project lifecycle management, from ideation to deployment. Passionate about mentoring, open-source contributions, and building inclusive tech communities.",
    ],
    experience: [
        "Led the development of key product features, resulting in a 30% increase in user engagement. Collaborated with design and product teams to deliver pixel-perfect implementations using modern frameworks and best practices.",
        "Architected and built scalable microservices handling 10K+ requests per second. Implemented CI/CD pipelines, automated testing, and monitoring dashboards, reducing deployment time by 60%.",
        "Developed and maintained RESTful APIs and frontend interfaces for enterprise clients. Conducted code reviews, mentored junior developers, and improved team velocity by 25% through process optimization.",
        "Spearheaded the migration of legacy systems to cloud-native architecture, reducing infrastructure costs by 40%. Introduced containerization with Docker and orchestrated with Kubernetes for seamless scaling.",
    ],
    project: [
        "Designed and developed a full-stack application with real-time data synchronization, role-based access control, and comprehensive analytics dashboards. Implemented responsive UI/UX resulting in a 95% user satisfaction score.",
        "Built an intelligent automation platform that streamlines workflows, reducing manual processing time by 70%. Integrated third-party APIs, implemented webhook notifications, and deployed on cloud infrastructure.",
        "Created an AI-powered recommendation engine using machine learning algorithms, achieving 92% accuracy in predictions. Features include natural language processing, data visualization, and export capabilities.",
        "Developed a mobile-first progressive web application with offline support, push notifications, and optimized performance scoring 98+ on Lighthouse. Implemented service workers and caching strategies for seamless UX.",
    ],
};

function aiSuggest(field) {
    const textarea = document.getElementById(field);
    const btn = textarea.closest('.textarea-wrapper').querySelector('.ai-suggest-btn');
    const title = document.getElementById('jobTitle').value.trim() || 'Professional';

    btn.classList.add('loading');
    btn.innerHTML = '<i class="fas fa-spinner"></i> Generating...';

    // Simulate AI processing time
    setTimeout(() => {
        const suggestions = aiSuggestions[field] || aiSuggestions.summary;
        let suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        suggestion = suggestion.replace(/{title}/g, title);

        textarea.value = suggestion;
        textarea.style.borderColor = 'var(--accent-1)';
        setTimeout(() => { textarea.style.borderColor = ''; }, 2000);

        btn.classList.remove('loading');
        btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> AI Enhance';

        showToast('AI suggestion applied!', 'success');
    }, 1200);
}

function aiSuggestExperience(btn) {
    const textarea = btn.closest('.textarea-wrapper').querySelector('textarea');

    btn.classList.add('loading');
    btn.innerHTML = '<i class="fas fa-spinner"></i> Generating...';

    setTimeout(() => {
        const suggestions = aiSuggestions.experience;
        textarea.value = suggestions[Math.floor(Math.random() * suggestions.length)];
        textarea.style.borderColor = 'var(--accent-1)';
        setTimeout(() => { textarea.style.borderColor = ''; }, 2000);

        btn.classList.remove('loading');
        btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> AI Enhance';

        showToast('AI suggestion applied!', 'success');
    }, 1200);
}

function aiSuggestProject(btn) {
    const textarea = btn.closest('.textarea-wrapper').querySelector('textarea');

    btn.classList.add('loading');
    btn.innerHTML = '<i class="fas fa-spinner"></i> Generating...';

    setTimeout(() => {
        const suggestions = aiSuggestions.project;
        textarea.value = suggestions[Math.floor(Math.random() * suggestions.length)];
        textarea.style.borderColor = 'var(--accent-1)';
        setTimeout(() => { textarea.style.borderColor = ''; }, 2000);

        btn.classList.remove('loading');
        btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> AI Enhance';

        showToast('AI suggestion applied!', 'success');
    }, 1200);
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="${icons[type] || icons.info}"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
