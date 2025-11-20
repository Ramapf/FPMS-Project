//----------------------------------------------------------
// LIST VIEW SETTINGS → Rename "Add Engagement Tracker" → "Add Item"
//----------------------------------------------------------
frappe.listview_settings['Engagement Tracker'] = {
    onload: function(listview) {
        setTimeout(() => {
            $('button:contains("Add Engagement Tracker")').text("Add Item");
        }, 500);
    }
};


//----------------------------------------------------------
// FORM SCRIPT → Save as Draft → Submit (Save + Email) → Lock → Supervisor Edit
//----------------------------------------------------------
frappe.ui.form.on('Engagement Tracker', {

    refresh(frm) {

        //--------------------------------------------------
        // Hide Print button initially
        //--------------------------------------------------
        setTimeout(() => {
            $('.page-actions .btn[data-original-title="Print"]').hide();
            $('.page-actions .btn[aria-label="Print"]').hide();
        }, 300);


        //--------------------------------------------------
        // 📄 ADD DOWNLOAD PDF BUTTON (Using Custom Print Format)
        //--------------------------------------------------
        if (!frm.is_new()) {

            if (!$('.custom-pdf-btn').length) {

                const pdfBtn = $('<button class="btn btn-info btn-sm custom-pdf-btn ml-2">')
                    .text("Download PDF")
                    .on('click', function () {

                        const pdf_url =
                            `/api/method/frappe.utils.print_format.download_pdf?doctype=Engagement Tracker&name=${frm.doc.name}&format=Engagement Tracker PDF&no_letterhead=0`;

                        window.open(pdf_url);
                    });

                pdfBtn.appendTo('.page-actions');
            }
        }


        //--------------------------------------------------
        // FIELDS THAT BECOME READONLY ON SUBMIT
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


        //--------------------------------------------------
        // CASE 1 → SUBMITTED MODE
        //--------------------------------------------------
        if (frm.doc.engagement_tracker_status === "Submit") {

            // Make read-only
            readonly_fields.forEach(f => frm.set_df_property(f, "read_only", 1));

            // Hide save
            $('button[data-label="Save"]').hide();

            // Show print button
            $('.page-actions .btn[data-original-title="Print"]').show();


            // Disable submit button
            const sb = $('.custom-submit-btn');
            if (sb.length) {
                sb.prop("disabled", true)
                  .addClass("btn-secondary")
                  .removeClass("btn-primary")
                  .text("Submitted");
            }

            //--------------------------------------------------
            // SUPERVISOR ENABLE EDIT
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



        //--------------------------------------------------
        // CASE 2 → DRAFT MODE (SAVE)
        //--------------------------------------------------
        if (frm.doc.engagement_tracker_status === "Save") {

            readonly_fields.forEach(f => frm.set_df_property(f, "read_only", 0));

            setTimeout(() => {

                const saveBtn = $('button[data-label="Save"]');
                if (!saveBtn.length) return;

                // Change Save → Save as Draft
                saveBtn.text("Save as Draft");
                saveBtn.off("click").on("click", function () {
                    frm.set_value("engagement_tracker_status", "Save");
                    frm.save_or_update();
                });


                //--------------------------------------------------
                // SUBMIT BUTTON → SAVE + PYTHON EMAIL
                //--------------------------------------------------
                if (!$('.custom-submit-btn').length) {

                    const sb = $('<button class="btn btn-primary btn-sm custom-submit-btn ml-2">')
                    .text("Submit")
                    .on('click', function () {

                        // Validate email
                        if (!frm.doc.email) {
                            frappe.msgprint({
                                title: 'Email Required',
                                indicator: 'red',
                                message: 'Please enter an email before submitting.'
                            });
                            return;
                        }

                        frm.set_value("engagement_tracker_status", "Submit");

                        // SAVE FIRST
                        frm.save_or_update().then(() => {

                            frappe.call({
                                method: "fpms.fpms.doctype.engagement_tracker.engagement_tracker.send_submission_email",
                                args: { docname: frm.doc.name },

                                callback: function(r) {

                                    // PYTHON SUCCESS
                                    if (r.message && r.message.email_sent) {

                                        frappe.msgprint({
                                            title: "Email Sent",
                                            indicator: "green",
                                            message: "📧 Email sent successfully!"
                                        });

                                    } else {

                                        // PYTHON FAILURE
                                        frappe.msgprint({
                                            title: "Warning",
                                            indicator: "orange",
                                            message: "⚠ Form saved, but email did NOT send."
                                        });
                                    }

                                    saveBtn.hide();
                                    frm.refresh();
                                },

                                error: function() {
                                    frappe.msgprint({
                                        title: "Error",
                                        indicator: "red",
                                        message: "❌ Email sending failed. Contact support."
                                    });
                                    frm.refresh();
                                }
                            });

                        });

                    });

                    saveBtn.after(sb);
                }

            }, 300);
        }



        //-------------------------------------------------- 
        // FIRST TIME OPEN → SET DEFAULT STATUS
        //--------------------------------------------------
        if (!frm.doc.engagement_tracker_status) {
            frm.set_value("engagement_tracker_status", "Save");
        }

    }
});
