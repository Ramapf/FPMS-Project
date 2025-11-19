// Copyright (c) 2025, Ram and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Annoucements Detail", {
// 	refresh(frm) {

// 	},
// });
frappe.ui.form.on("Annoucements Detail", {

    // -------------------------------
    // ✅ AUTO FILL FACULTY TABLE
    // -------------------------------
    faculty_announcement(frm) {

        if (frm.doc.faculty_announcement === "All Faculty") {

            frm.clear_table("faculty_name");

            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Faculty",
                    fields: ["name"]
                },
                callback(r) {
                    if (r.message) {

                        r.message.forEach(f => {
                            let row = frm.add_child("faculty_name");
                            row.faculty = f.name;
                        });

                        frm.refresh_field("faculty_name");
                        frappe.msgprint("✅ All Faculty Added!");
                    }
                }
            });

        } else {
            frm.clear_table("faculty_name");
            frm.refresh_field("faculty_name");
        }
    },

    // -------------------------------
    // ✅ AUTO FILL SUPERVISOR TABLE
    // -------------------------------
    supervisor_announcement(frm) {

        if (frm.doc.supervisor_announcement === "All Supervisor") {

            frm.clear_table("supervisor_name");

            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Supervisor",
                    fields: ["name"]
                },
                callback(r) {
                    if (r.message) {

                        r.message.forEach(s => {
                            let row = frm.add_child("supervisor_name");
                            row.supervisor = s.name;
                        });

                        frm.refresh_field("supervisor_name");
                        frappe.msgprint("✅ All Supervisors Added!");
                    }
                }
            });

        } else {
            frm.clear_table("supervisor_name");
            frm.refresh_field("supervisor_name");
        }
    },

    // -------------------------------
    // ✅ AUTO GENERATE ANNOUNCEMENT ID
    // -------------------------------
    before_save(frm) {

        if (!frm.doc.scl_short_name || !frm.doc.academic_year) {
            frappe.msgprint("Please enter School Short Name and Academic Year before saving.");
            return;
        }

        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Annoucements Detail",
                fields: ["announcement_id"],
                filters: {
                    scl_short_name: frm.doc.scl_short_name,
                    academic_year: frm.doc.academic_year
                },
                order_by: "creation desc",
                limit: 1
            },
            callback: function(r) {

                let new_serial = 1;

                if (r.message && r.message.length > 0) {
                    const last_id = r.message[0].announcement_id;

                    if (last_id) {
                        const parts = last_id.split("/");
                        const last_serial = parseInt(parts[2]) || 0;
                        new_serial = last_serial + 1;
                    }
                }

                const new_id = `${frm.doc.scl_short_name}/${frm.doc.academic_year}/${new_serial}`;
                frm.set_value("announcement_id", new_id);
            }
        });
    },

    // -------------------------------
    // ✅ SET ADDED TIME
    // -------------------------------
    refresh(frm) {
        if (!frm.doc.added_time) {
            frm.set_value("added_time", frappe.datetime.now_datetime());
        }
    }
});
