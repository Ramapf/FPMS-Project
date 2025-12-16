// Copyright (c) 2025, Ram and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Engagement", {
// 	refresh(frm) {

// 	},
// });
//----------------------------------------------------------
// AUTO-FILL FROM URL PARAMETERS (Cloud + Local)
//----------------------------------------------------------
frappe.ui.form.on('Engagement', {
    onload(frm) {
        const params = new URLSearchParams(window.location.search);

        const announcement = params.get("announcement");
        const academic_year = params.get("academic_year");

        // If URL contains data → call backend API
        if (announcement || academic_year) {
            frappe.call({
                method: "fpms.api.apply_tracker_defaults",
                args: {
                    announcement: announcement,
                    academic_year: academic_year
                },
                callback(r) {
                    if (r.message) {
                        if (r.message.announcement) {
                            frm.set_value("announcement", r.message.announcement);
                        }
                        if (r.message.academic_year) {
                            frm.set_value("academic_year", r.message.academic_year);
                        }
                        frm.refresh_fields();
                    }
                }
            });
        }

        // Default status for new forms
        if (!frm.doc.engagement_tracker_status) {
            frm.set_value("engagement_tracker_status", "Save");
        }
    },

    //=====================================================
    // REFRESH FUNCTION (Main UI Logic)
    //=====================================================
    refresh(frm) {

        //--------------------------------------------------
        // Hide Print button initially
        //--------------------------------------------------
        setTimeout(() => {
            $('.page-actions .btn[data-original-title="Print"]').hide();
            $('.page-actions .btn[aria-label="Print"]').hide();
        }, 300);


        //--------------------------------------------------
        // ADD PDF DOWNLOAD BUTTON
        //--------------------------------------------------
        if (!frm.is_new()) {
            if (!$('.custom-pdf-btn').length) {

                const pdfBtn = $('<button class="btn btn-info btn-sm custom-pdf-btn ml-2">')
                    .text("Download PDF")
                    .on('click', () => {
                        const pdf_url =
                            `/api/method/frappe.utils.print_format.download_pdf?doctype=Engagement&name=${frm.doc.name}&format=Engagement PDF&no_letterhead=0`;

                        window.open(pdf_url);
                    });

                pdfBtn.appendTo('.page-actions');
            }
        }

        //--------------------------------------------------
        // FIELDS THAT SHOULD BE READ-ONLY AFTER SUBMIT
        //--------------------------------------------------
        const readonly_fields = [
            "data_onnv","employee_id","mentoring","employee_name","first_id","email","supervisor",
            "supervisor_mail","announcement","academic_year","school_details","campus","status",
            "course_details","designing_teaching_programs_or_courses","workshops_for_university_students",
            "article_in_peer_reviewed_journal","article_in_nonreviewed_journal_or_conference_proceedings",
            "discussion_paper_or_working_paper","book","chapters_in_edited_book_or_in_long_report",
            "fulllengths_reports","policy_briefs","fulllength_case_study","editor_of_books_or_other_publications",
            "material_development_for_teacher_education_curriculum","journal_editorial_board_member",
            "talks_and_presentations","articles_in_newspapers_magazines_and_other_publications",
            "podcast_webinar_radio_tv_video_episode_exhibition_etc","translation","review_of_books_film_etc",
            "peer_review_of_journal_articles","conference_workshop_organising",
            "other_publications_or_research_related_work","ongoing_research_projects","practice_public",
            "professional_development_programs","public_talks_webinars_guest_lectures_etc",
            "contribution_to_social_sector_initiatives","contribution_to_government_related_initiatives",
            "phd_mastersug_thesis_supervision_or_review","contribution_at_other_academic_institutions",
            "consulting","other","institution_details","roles_and_committees",
            "contributing_to_organising_conferences_ev","test1","test","test2","test3"
        ];


        //=====================================================
        // CASE 1: SUBMITTED MODE
        //=====================================================
        if (frm.doc.engagement_tracker_status === "Submit") {

            readonly_fields.forEach(f => frm.set_df_property(f, "read_only", 1));

            $('button[data-label="Save"]').hide();
            $('.page-actions .btn[data-original-title="Print"]').show();

            const sb = $('.custom-submit-btn');
            if (sb.length) {
                sb.prop("disabled", true)
                  .removeClass("btn-primary")
                  .addClass("btn-secondary")
                  .text("Submitted");
            }

            //--------------------------------------------------
            // Supervisor can re-enable editing
            //--------------------------------------------------
            if (frappe.user.has_role("Supervisor")) {
                setTimeout(() => {
                    if (!$('.custom-edit-btn').length) {

                        $('<button class="btn btn-danger btn-sm custom-edit-btn ml-2">')
                        .text("Enable to Edit")
                        .on('click', function () {

                            frm.set_read_only(false);
                            frm.set_value("engagement_tracker_status", "Save");

                            frm.save_or_update().then(() => {
                                frappe.msgprint("Editing Enabled");
                                frm.refresh();
                            });

                        }).appendTo('.page-actions');
                    }
                }, 300);
            }

            return;
        }


        //=====================================================
        // CASE 2: DRAFT MODE (SAVE)
        //=====================================================
        if (frm.doc.engagement_tracker_status === "Save") {

            readonly_fields.forEach(f => frm.set_df_property(f, "read_only", 0));

            setTimeout(() => {

                const saveBtn = $('button[data-label="Save"]');
                if (!saveBtn.length) return;

                saveBtn.text("Save as Draft");

                saveBtn.off("click").on("click", () => {
                    frm.set_value("engagement_tracker_status", "Save");
                    frm.save_or_update();
                });

                //--------------------------------------------------
                // SUBMIT BUTTON — Sends Email + Locks Form
                //--------------------------------------------------
                if (!$('.custom-submit-btn').length) {

                    const sb = $('<button class="btn btn-primary btn-sm custom-submit-btn ml-2">')
                    .text("Submit")
                    .on('click', function () {

                        if (!frm.doc.email) {
                            frappe.msgprint("Email is required before submitting.");
                            return;
                        }

                        frm.set_value("engagement_tracker_status", "Submit");

                        frm.save_or_update().then(() => {

                            frappe.call({
                                method: "fpms.fpms.doctype.engagement.engagement.send_submission_email",
                                args: { docname: frm.doc.name },

                                callback() {
                                    frappe.msgprint("📧 Email sent successfully!");
                                    saveBtn.hide();
                                    frm.refresh();
                                },

                                error() {
                                    frappe.msgprint("❌ Email sending failed.");
                                }
                            });

                        });

                    });

                    saveBtn.after(sb);
                }

            }, 300);
        }
    }
});


//----------------------------------------------------------
// LIST VIEW SETTINGS
//----------------------------------------------------------
frappe.listview_settings['Engagement'] = {
    onload(listview) {
        setTimeout(() => {
            $('button:contains("Add Engagement")').text("Add Item");
        }, 500);
    }
};
