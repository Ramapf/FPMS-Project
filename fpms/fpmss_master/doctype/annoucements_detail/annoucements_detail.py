# apps/fpms/fpms/fpmss_masster/doctype/annoucement/annoucement.py

import frappe
from frappe.model.document import Document

# =====================================================================
#  ANNOUNCEMENT DOCTYPE – AFTER INSERT TRIGGER
# =====================================================================

class Annoucement(Document):
    def after_insert(self):
        """Send announcement email after inserting the Annoucement document."""
        send_announcement_email(self)


# =====================================================================
#  SEND EMAIL TO FACULTY & SUPERVISORS
# =====================================================================

def send_announcement_email(doc):
    recipients = []

    # ------------------------------------------------------
    # 1️⃣ Collect Faculty Emails
    # ------------------------------------------------------
    for row in doc.faculty_name:
        email = frappe.db.get_value("Faculty", row.faculty, "email")
        if email:
            recipients.append(email)

    # ------------------------------------------------------
    # 2️⃣ Collect Supervisor Emails
    # ------------------------------------------------------
    for row in doc.supervisor_name:
        email = frappe.db.get_value("Supervisor", row.supervisor, "email")
        if email:
            recipients.append(email)

    # Remove duplicates
    recipients = list(set(recipients))

    if not recipients:
        frappe.msgprint("⚠️ No email IDs found. No announcement sent.")
        return

    # ------------------------------------------------------
    # 3️⃣ Prepare Email Details
    # ------------------------------------------------------
    subject = "Creation of FPMS Form"
    year = doc.academic_year or "2025-2026"

    # Auto detects site URL (local + cloud)
    base_url = frappe.utils.get_url()

    # Engagement Tracker auto-fill link
    tracker_url = (
        f"{base_url}/app/engagement-tracker/new-engagement-tracker?"
        f"academic_year={doc.academic_year}&announcement={doc.announcement_id}"
    )

    # ------------------------------------------------------
    # 4️⃣ Send Email to Each Recipient
    # ------------------------------------------------------
    for email in recipients:

        faculty_info = frappe.db.get_value(
            "Faculty",
            {"email": email},
            ["faculty_name", "emp_code"],
            as_dict=True
        ) or {}

        faculty_name = faculty_info.get("faculty_name") or "Faculty Member"
        emp_code = faculty_info.get("emp_code") or "-"

        message = f"""
        <p>Dear {faculty_name},</p>

        <p>
            The FPMS form <b>{doc.announcement_id}</b> (Faculty ID: <b>{emp_code}</b>) 
            for the year <b>{year}</b> has been created.
        </p>

        <p>Please click the button below to open the Engagement Tracker:</p>

        <p>
            <a href="{tracker_url}" 
            style="
                background-color:#1a73e8;
                color:white;
                padding:10px 16px;
                text-decoration:none;
                border-radius:6px;
                font-weight:bold;
                display:inline-block;">
                Open Engagement Tracker
            </a>
        </p>

        <p>For support, contact: <b>fpmssupport@apu.edu.in</b></p>

        <p><i>This is an automated email. Do not reply.</i></p>

        <p>Regards,<br>
        <b>People Function</b></p>
        """

        frappe.sendmail(
            recipients=[email],
            subject=subject,
            message=message
        )

    frappe.msgprint("✅ FPMS Announcement Email sent successfully!")


# =====================================================================
#  AUTO-FILL API (Used by Engagement Tracker to fill fields automatically)
# =====================================================================

@frappe.whitelist()
def apply_tracker_defaults(announcement=None, academic_year=None):
    """
    Returns default values for Engagement Tracker fields.
    Triggered when user opens the form using URL parameters.
    """
    return {
        "announcement": announcement,
        "academic_year": academic_year
    }
