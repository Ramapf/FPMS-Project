// Initialize the namespace first
frappe.pages = frappe.pages || {};
frappe.pages['engagementtracker'] = frappe.pages['engagementtracker'] || {};

frappe.pages['engagementtracker'].on_page_load = function(wrapper) {
    const page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Engagementl - All Sections',
        single_column: true
    });

    // ===================================================================
    // 1. ADVANCED PROFESSIONAL ANIMATIONS & STYLES
    // ===================================================================
    const animationStyles = `
        <style>
            @keyframes fadeInBlur {
                from { opacity: 0; filter: blur(10px); transform: translateY(40px); }
                to { opacity: 1; filter: blur(0); transform: translateY(0); }
            }
            @keyframes gradientFlow {
                0% { background-position: 0% 50%; }
                25% { background-position: 100% 50%; }
                50% { background-position: 100% 100%; }
                75% { background-position: 0% 100%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            @keyframes glowPulse {
                0%, 100% { box-shadow: 0 0 20px rgba(74, 144, 226, 0.3); }
                50% { box-shadow: 0 0 40px rgba(74, 144, 226, 0.6); }
            }
            @keyframes slideUpBounce {
                0% { opacity: 0; transform: translateY(60px) scale(0.95); }
                60% { opacity: 1; transform: translateY(-10px) scale(1.02); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes shine {
                0% { left: -100%; }
                20%, 100% { left: 100%; }
            }
            @keyframes textShimmer {
                0% { background-position: -1000px 0; }
                100% { background-position: 1000px 0; }
            }
            @keyframes countUp {
                from { transform: scale(0.5); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @keyframes spinGlow {
                0% { transform: rotate(0deg); filter: hue-rotate(0deg); }
                100% { transform: rotate(360deg); filter: hue-rotate(360deg); }
            }

            .animated-content { animation: fadeInBlur 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
            .animated-header {
                background: linear-gradient(135deg, #003366 0%, #1e5a8e 25%, #4a90e2 50%, #2c5282 75%, #003366 100%);
                background-size: 400% 400%;
                animation: gradientFlow 15s ease infinite;
                position: relative;
                overflow: hidden;
            }
            .animated-header::before {
                content: '';
                position: absolute;
                top: -50%; left: -50%; width: 200%; height: 200%;
                background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
                animation: shine 3s infinite;
            }
            .shimmer-text {
                background: linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 100%);
                background-size: 200% auto;
                -webkit-background-clip: text;
                background-clip: text;
                animation: textShimmer 3s linear infinite;
            }
            .section-btn {
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
                overflow: hidden;
            }
            .section-btn::before {
                content: '';
                position: absolute;
                top: -50%; left: -100%; width: 100%; height: 200%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                transform: skewX(-20deg);
                transition: left 0.7s;
            }
            .section-btn:hover::before { left: 200%; }
            .section-btn:hover {
                transform: translateY(-8px) scale(1.03);
                box-shadow: 0 15px 35px rgba(0,0,0,0.25), 0 5px 15px rgba(0,0,0,0.15);
            }
            .icon-float { animation: float 3s ease-in-out infinite; }
            .module-card, .refl-card, .obj-card, .card {
                transition: all 0.4s;
                animation: slideUpBounce 0.6s backwards;
            }
            .module-card:hover, .refl-card:hover, .obj-card:hover {
                transform: translateY(-12px) scale(1.05);
                animation: glowPulse 2s infinite;
            }
            .module-card::after, .refl-card::after, .obj-card::after {
                content: '';
                position: absolute;
                top: 0; left: -100%; width: 100%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                transition: left 0.5s;
            }
            .module-card:hover::after, .refl-card:hover::after, .obj-card:hover::after { left: 100%; }
            .spinner-border { animation: spinGlow 1.5s linear infinite; box-shadow: 0 0 20px rgba(0,51,102,0.5); }
            .btn:hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0,0,0,0.2); }
            .form-control:focus { transform: scale(1.03); box-shadow: 0 0 0 4px rgba(74,144,226,0.25); }
            .table tbody tr:hover { background: rgba(74,144,226,0.1); transform: scale(1.01); }
            .count-badge { animation: countUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            .badge-animated { animation: glowPulse 2s ease-in-out infinite; }
            .text-purple { color: #805ad5; }
            .text-blue { color: #5a67d8; }
            html { scroll-behavior: smooth; }
        </style>
    `;
    $('head').append(animationStyles);

    // ===================================================================
    // 2. LOAD LIBRARIES ONCE
    // ===================================================================
    if (!window.libs_loaded) {
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', () => {
            $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js');
        });
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js');
        window.libs_loaded = true;
    }

    // ===================================================================
    // 3. COLOR SCHEME & DATA STRUCTURES
    // ===================================================================
    const COLORS = {
        primary: '#003366', accent: '#2c5282', success: '#2d6a4f', warning: '#b7791f',
        lightBg: '#f8f9fa', border: '#dee2e6', textDark: '#212529', textLight: '#6c757d'
    };

    const allSections = {
        'research_writing': { title: 'Research & Writing', color: COLORS.primary, icon: '📚' },
        'teaching_mentoring': { title: 'Teaching & Mentoring', color: COLORS.accent, icon: '👨‍🏫' },
        'practice_public_engagement': { title: 'Practice & Public Engagement', color: COLORS.success, icon: '🌍' },
        'institution_building': { title: 'Institution Building', color: COLORS.warning, icon: '🏛️' },
        'objectives': { title: 'Objectives', color: '#5a67d8', icon: '🎯' },
        'reflection': { title: 'Reflection', color: '#805ad5', icon: '💭' }
    };

    const REFLECTION_MODULES = [
        { label: 'Teaching-Mentoring-Reflection', field: 'test1' },
        { label: 'Research-Writing-Reflection', field: 'test' },
        { label: 'Practice-Public Engagement-Reflection', field: 'test2' },
        { label: 'Institution Building-Reflection', field: 'test3' },
        { label: 'Other Reflection', field: 'test4' },
        { label: 'All Reflections (Combined)', field: '__ALL__' }
    ];

    const MODULES = {
        research_writing: [
            { label: 'Article in Peer Reviewed Journal', field: 'article_in_peer_reviewed_journal' },
            { label: 'Article in Non-Reviewed Journal', field: 'article_in_nonreviewed_journal_or_conference_proceedings' },
            { label: 'Discussion Paper or Working Paper', field: 'discussion_paper_or_working_paper' },
            { label: 'Book', field: 'book' },
            { label: 'Chapters in Edited Book', field: 'chapters_in_edited_book_or_in_long_report' },
            { label: 'Full-Length Reports', field: 'fulllengths_reports' },
            { label: 'Policy Briefs', field: 'policy_briefs' },
            { label: 'Full-Length Case Study', field: 'fulllength_case_study' },
            { label: 'Editor of Books', field: 'editor_of_books_or_other_publications' },
            { label: 'Material Development', field: 'material_development_for_teacher_education_curriculum' },
            { label: 'Journal Editorial Board', field: 'journal_editorial_board_member' },
            { label: 'Talks and Presentations', field: 'talks_and_presentations' },
            { label: 'Articles in Newspapers', field: 'articles_in_newspapers_magazines_and_other_publications' },
            { label: 'Podcast/Webinar/TV', field: 'podcast_webinar_radio_tv_video_episode_exhibition_etc' },
            { label: 'Translation', field: 'translation' },
            { label: 'Peer Review', field: 'peer_review_of_journal_articles' },
            { label: 'Conference Organising', field: 'conference_workshop_organising' },
            { label: 'Other Publications', field: 'other_publications_or_research_related_work' },
            { label: 'Ongoing Research', field: 'ongoing_research_projects' }
        ],
        teaching_mentoring: [
            { label: 'Course Details', field: 'course_details' },
            { label: 'Mentoring Details', field: 'mentoring' },
            { label: 'Designing Programs/Courses', field: 'designing_teaching_programs_or_courses' },
            { label: 'Workshops for Students', field: 'workshops_for_university_students' }
        ],
        practice_public_engagement: [
            { label: 'Practice Public Engagement', field: 'practice_public' },
            { label: 'Professional Development', field: 'professional_development_programs' },
            { label: 'Public Talks & Webinars', field: 'public_talks_webinars_guest_lectures_etc' },
            { label: 'Social Sector Initiatives', field: 'contribution_to_social_sector_initiatives' },
            { label: 'Government Initiatives', field: 'contribution_to_government_related_initiatives' },
            { label: 'PhD/Masters Supervision', field: 'phd_mastersug_thesis_supervision_or_review' },
            { label: 'Other Academic Institutions', field: 'contribution_at_other_academic_institutions' },
            { label: 'Consulting', field: 'consulting' },
            { label: 'Other Contributions', field: 'other' }
        ],
        institution_building: [
            { label: 'Institution Details', field: 'institution_details' },
            { label: 'Roles and Committees', field: 'roles_and_committees' },
            { label: 'Conference Volunteering', field: 'contributing_to_organising_conferences_ev' }
        ],
        objectives: [
            { label: 'Objectives', field: 'data_onnv', is_objective: true }
        ],
        reflection: REFLECTION_MODULES
    };

    const EXCLUDE_FIELDS = ['name','owner','creation','modified','modified_by','docstatus','idx','parent','parentfield','parenttype','doctype'];

    // ===================================================================
    // 4. GLOBAL STATE
    // ===================================================================
    let allData = [];
    let filteredData = [];
    let currentSection = null;
    let selectedEmployees = [];
    let $filterRow, $grid, $tableView;

    // ===================================================================
    // 5. MAIN UI
    // ===================================================================
    const $content = $(`
        <div class="animated-content" style="padding:20px; background:${COLORS.lightBg}; min-height:100vh;">
            <div class="animated-header" style="text-align:center; margin-bottom:30px; padding:35px; border-radius:12px; color:white;">
                <h2 class="shimmer-text" style="font-size:36px;">🎓 Engagementl</h2>
                <p style="margin-top:15px; font-size:17px;">Academic & Professional Activities Dashboard</p>
            </div>
            <div id="section_nav" style="margin-bottom:30px; padding:25px; background:white; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                <h4 style="text-align:center; margin-bottom:25px;">Select Academic Section</h4>
                <div class="row" id="section_buttons"></div>
            </div>
            <div id="filter_row" class="filter-slide-in" style="display:none; margin-bottom:25px; padding:22px; background:white; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                <div class="row align-items-end">
                    <div class="col-md-3"><label>Academic Year</label><select id="filter_year" class="form-control"><option value="">All Years</option></select></div>
                    <div class="col-md-3"><label>School</label><select id="filter_school" class="form-control"><option value="">All Schools</option></select></div>
                    <div class="col-md-2"><label>Campus</label><select id="filter_campus" class="form-control"><option value="">All Campuses</option></select></div>
                    <div class="col-md-3"><label id="filter_label">Module</label><select id="type_filter" class="form-control"><option value="">-- Select --</option></select></div>
                    <div class="col-md-1"><button id="clear_filter" class="btn btn-secondary w-100">🔄 Clear</button></div>
                </div>
            </div>
            <div id="loading" style="text-align:center; padding:120px;">
                <div class="spinner-border text-primary" style="width:5rem; height:5rem;"></div>
                <p style="margin-top:25px; font-size:20px; color:${COLORS.primary};">Loading Engagementl Data...</p>
            </div>
            <div id="module_grid" style="display:none;"></div>
            <div id="table_view" class="table-fade-in" style="display:none;"></div>
        </div>
    `).appendTo(page.body);

    $filterRow = $('#filter_row');
    $grid = $('#module_grid');
    $tableView = $('#table_view');

    // ===================================================================
    // ALL FUNCTIONS - DEFINED BEFORE loadData() IS CALLED
    // ===================================================================

    function populateGlobalFilters() {
        const years = [...new Set(allData.map(d => d.academic_year).filter(Boolean))].sort();
        const schools = [...new Set(allData.map(d => d.school_details).filter(Boolean))].sort();
        const campuses = [...new Set(allData.map(d => d.campus).filter(Boolean))].sort();

        $('#filter_year, #filter_school, #filter_campus').empty()
            .append('<option value="">All</option>');
        years.forEach(y => $('#filter_year').append(`<option>${y}</option>`));
        schools.forEach(s => $('#filter_school').append(`<option>${s}</option>`));
        campuses.forEach(c => $('#filter_campus').append(`<option>${c}</option>`));

        $('#filter_year, #filter_school, #filter_campus').on('change', applyFilters);
        $('#clear_filter').on('click', () => {
            $('#filter_year,#filter_school,#filter_campus,#type_filter').val('');
            filteredData = [...allData];
            refreshCurrentView();
        });
    }

    function applyFilters() {
        const y = $('#filter_year').val();
        const s = $('#filter_school').val();
        const c = $('#filter_campus').val();
        filteredData = allData.filter(d =>
            (!y || d.academic_year === y) &&
            (!s || d.school_details === s) &&
            (!c || d.campus === c)
        );
        refreshCurrentView();
    }

    function refreshCurrentView() {
        $grid.empty().hide();
        $tableView.hide();
        $('#type_filter').off('change').empty().append('<option value="">-- Select --</option>');
        if (!currentSection) return;
        if (currentSection === 'reflection') buildReflectionCards();
        else if (currentSection === 'objectives') buildObjectivesCards();
        else if (currentSection === 'employee_summary') showEmployeeSummary();
        else buildModuleGrid();
    }

    function buildSectionButtons() {
        let html = '';
        Object.keys(allSections).forEach(key => {
            const s = allSections[key];
            html += `<div class="col-md-4 mb-3">
                <button class="btn section-btn w-100" data-section="${key}"
                    style="padding:25px; border:3px solid ${s.color}; color:${s.color}; background:white; font-weight:600; border-radius:12px;">
                    <div class="icon-float" style="font-size:42px; margin-bottom:12px;">${s.icon}</div>
                    <div style="font-weight:700;">${s.title}</div>
                </button>
            </div>`;
        });
        html += `<div class="col-md-4 mb-3">
            <button class="btn section-btn w-100" data-section="employee_summary"
                style="padding:25px; border:3px solid #1565c0; color:#1565c0; background:white; border-radius:12px;">
                <div class="icon-float" style="font-size:42px; margin-bottom:12px;">👥</div>
                <div style="font-weight:700;">Employee Summary</div>
            </button>
        </div>`;
        $('#section_buttons').html(html);

        $('.section-btn').on('click', function() {
            currentSection = $(this).data('section');
            const borderColor = $(this).css('border-color');
            $('.section-btn').css({background:'white', color: borderColor});
            $(this).css({background: borderColor, color:'white'});
            $filterRow.show();
            $('#filter_label').text(currentSection === 'reflection' ? 'Reflection Type' : currentSection === 'objectives' ? 'Faculty' : 'Module');
            refreshCurrentView();
        });
    }

    function buildModuleGrid() {
        const section = allSections[currentSection];
        const modules = MODULES[currentSection] || [];
        let html = `<div style="background:white; padding:30px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            <h4 style="color:${section.color}; border-bottom:4px solid ${section.color}; padding-bottom:15px; margin-bottom:25px;">
                ${section.icon} ${section.title}
            </h4>
            <div class="row">`;

        modules.forEach(m => {
            const count = filteredData.reduce((sum, d) => sum + (Array.isArray(d[m.field]) ? d[m.field].length : 0), 0);
            if (count > 0) {
                html += `<div class="col-md-4 mb-4">
                    <div class="card module-card h-100" data-field="${m.field}" data-label="${m.label}" style="cursor:pointer; border-left:6px solid ${section.color};">
                        <div class="card-body">
                            <h6>${m.label}</h6>
                            <span class="count-badge" style="background:${section.color};">${count}</span>
                        </div>
                    </div>
                </div>`;
            }
        });
        html += `</div></div>`;
        $grid.html(html).show();

        const $sel = $('#type_filter');
        modules.forEach(m => {
            const cnt = filteredData.reduce((s,d) => s + (Array.isArray(d[m.field])?d[m.field].length:0), 0);
            if (cnt > 0) $sel.append(`<option value="${m.field}">${m.label} (${cnt})</option>`);
        });
        $sel.on('change', function() {
            const f = $(this).val();
            if (f) showTable(f, modules.find(x => x.field === f).label);
        });

        $('.module-card').on('click', function() {
            const field = $(this).data('field');
            const label = $(this).data('label');
            showTable(field, label);
        });
    }

    function showTable(field, label) {
        // Your full showTable implementation here (same as original)
        // For brevity, placeholder — copy your original code
    }

    // Add all other functions here: buildReflectionCards, showReflectionType, buildObjectivesCards, showObjectives, showEmployeeSummary, downloadAsPDF, etc.
    // (Copy them exactly from your original code)

    function downloadAsPDF(title, records, isReflection = false, isObjective = false) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4');
        doc.setFillColor(0,51,102);
        doc.rect(0,0,297,25,'F');
        doc.setTextColor(255,255,255);
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('🎓 Engagementl', 148.5, 13, {align:'center'});
        doc.setFontSize(12);
        doc.text(title, 148.5, 21, {align:'center'});
        // ... rest of your PDF code
        doc.save(title.replace(/[^a-zA-Z0-9]/g,'_') + '.pdf');
    }

    // ===================================================================
    // 6. LOAD DATA - CALLED LAST
    // ===================================================================
    function loadData() {
        $('#loading').show();
        frappe.call({
            method: 'fpms.api.engagement_tracker.get_engagement_tracker_list',
            callback: function(r) {
                $('#loading').hide();
                if (r.message && r.message.length) {
                    allData = r.message;
                    filteredData = [...allData];
                    buildSectionButtons();
                    populateGlobalFilters();
                    frappe.show_alert({message: '✅ Data loaded successfully! (' + allData.length + ' records)', indicator: 'green'}, 4);
                } else {
                    frappe.msgprint('No data found');
                }
            },
            error: () => {
                $('#loading').hide();
                frappe.msgprint('Failed to load data');
            }
        });
    }

    // START THE APPLICATION
    loadData();
};