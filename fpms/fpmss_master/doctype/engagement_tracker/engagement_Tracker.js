    frappe.ui.form.on("Engagement Tracker", {
    refresh(frm) {

        // Hide print in draft mode
        if (frm.doc.engagement_tracker_status !== "Submit") {
            $('.page-actions .btn[data-original-title="Print"]').hide();
        }

        // When form is already submitted → Lock fields
        if (frm.doc.engagement_tracker_status === "Submit") {

            frm.disable_form();
            $('.page-actions .btn[data-original-title="Print"]').show();

            // Supervisor "Enable Edit"
            if ($('.custom-edit-btn').length === 0 && frappe.user.has_role("Supervisor")) {
                let btn = $('<button class="btn btn-danger btn-sm custom-edit-btn ml-2">Enable to Edit</button>');
                btn.on("click", function () {
                    frm.enable_form();
                    frm.set_value("engagement_tracker_status", "Save");
                    frm.save();
                });
                $(".page-actions").append(btn);
            }
        }

        // Draft Mode → Add Custom Submit Button
        if (frm.doc.engagement_tracker_status === "Save") {
            setTimeout(() => {

                const saveBtn = $('button[data-label="Save"]');
                saveBtn.text("Save as Draft");

                // Add SUBMIT BUTTON
                if (!$('.custom-submit-btn').length) {
                    let submitBtn = $('<button class="btn btn-primary btn-sm custom-submit-btn ml-2">Submit</button>');
                    submitBtn.on("click", function () {

                        if (!frm.doc.email) {
                            frappe.msgprint("Email is missing. Please fill Email before submitting.");
                            return;
                        }

                        frm.set_value("engagement_tracker_status", "Submit");

                        frm.save().then(() => {
                            // Call server email function
                            frappe.call({
                                method: "fpms.fpms.doctype.engagement_tracker.engagement_tracker.send_submission_email",
                                args: {
                                    docname: frm.doc.name
                                },
                                callback() {
                                    frappe.msgprint("🎉 Successfully Submitted! Email Sent.");
                                    frm.reload_doc();
                                }
                            });
                        });
                    });

                    saveBtn.after(submitBtn);
                }

            }, 200);
        }

        // First time entry
        if (!frm.doc.engagement_tracker_status) {
            frm.set_value("engagement_tracker_status", "Save");
        }
    }
});
