import frappe
from frappe.model.document import Document

class AnnoucementsDetail(Document):

    # Trigger email after form is saved (inserted)
    def after_insert(self):
        send_announcement_email(self)


def send_announcement_email(doc):
    recipients = []

    # ----------------------------------------
    # 1️⃣ Collect Faculty Emails
    # ----------------------------------------
    for row in doc.faculty_name:
        faculty_email = frappe.db.get_value("Faculty", row.faculty, "email")
        if faculty_email:
            recipients.append(faculty_email)

    # ----------------------------------------
    # 2️⃣ Collect Supervisor Emails
    # ----------------------------------------
    for row in doc.supervisor_name:
        supervisor_email = frappe.db.get_value("Supervisor", row.supervisor, "email")
        if supervisor_email:
            recipients.append(supervisor_email)

    # Remove duplicates
    recipients = list(set(recipients))

    if not recipients:
        frappe.msgprint("⚠️ No email IDs found to send announcement.")
        return

    # ----------------------------------------
    # 3️⃣ Prepare Email Subject + Year + Link
    # ----------------------------------------
    subject = "Creation of FPMS Form"
    year = doc.academic_year or "2025-2026"

    base_url = frappe.utils.get_url()

    # Engagement Tracker link with correct parameters
    tracker_url = (
        f"{base_url}/app/engagement-tracker/new-engagement-tracker"
        f"?academic_year={doc.academic_year}"
        f"&announcement={doc.announcement_id}"
    )

    # ----------------------------------------
    # 4️⃣ Send Email to Each Recipient
    # ----------------------------------------
    for email in recipients:

        faculty_details = frappe.db.get_value(
            "Faculty",
            {"email": email},
            ["faculty_name", "emp_code"],
            as_dict=True
        ) or {}

        first_name = faculty_details.get("faculty_name") or "Faculty Member"
        emp_code = faculty_details.get("emp_code") or "-"

        # ----------------------------------------
        # ⭐ FINAL EMAIL FORMAT
        # ----------------------------------------
        message = f"""
<p>Dear {first_name},</p>

<p>
    The FPMS form <b>{doc.announcement_id}</b>
    (Faculty ID: <b>{emp_code}</b>)
    for the year <b>{year}</b> has been created in the Frappe FPMS system.
</p>

<p>
    Please use the link below to navigate to the document and to start
    setting your Objectives and Engagement details:
</p>

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

<p>
    In case of any query please write to
    <a href="mailto:fpmssupport@apu.edu.in">fpmssupport@apu.edu.in</a>
</p>

<p><i>(Please do not respond to this automatic notification)</i></p>

<p>Regards,<br>
<b>People Function</b></p>
"""

        frappe.sendmail(
            recipients=[email],
            subject=subject,
            message=message
        )

    frappe.msgprint("✅ FPMS Intimation Mail sent successfully!")


# ------------------------------------------------------------
# ⭐ AUTO-FILL ENGAGEMENT TRACKER (SERVER SIDE)
# ------------------------------------------------------------
@frappe.whitelist()
def apply_tracker_defaults(announcement=None, academic_year=None):
    """
    API auto-fills announcement + academic_year inside Engagement Tracker.
    Triggered automatically when the form is opened using URL parameters.
    """

    data = {
        "announcement": announcement,
        "academic_year": academic_year
    }

    return data
