import frappe
from frappe.model.document import Document


# =====================================================================
#  ANNOUNCEMENT DOCTYPE – AFTER INSERT
# =====================================================================

class AnnoucementsDetail(Document):

    def after_insert(self):
        send_announcement_email(self.name)


# =====================================================================
#  SEND ANNOUNCEMENT EMAIL
# =====================================================================

@frappe.whitelist()
def send_announcement_email(docname):

    doc = frappe.get_doc("Annoucements Detail", docname)

    recipients = set()

    # -------------------------------------------------------------
    # Collect Faculty Emails
    # -------------------------------------------------------------
    if doc.faculty_name:
        for row in doc.faculty_name:
            email = frappe.db.get_value("Faculty", row.faculty, "email")
            if email:
                recipients.add(email)

    # -------------------------------------------------------------
    # Collect Supervisor Emails
    # -------------------------------------------------------------
    if doc.supervisor_name:
        for row in doc.supervisor_name:
            email = frappe.db.get_value("Supervisor", row.supervisor, "email")
            if email:
                recipients.add(email)

    if not recipients:
        return

    # -------------------------------------------------------------
    # Engagement Link
    # -------------------------------------------------------------
    engagement_link = (
        f"{frappe.utils.get_url()}/app/engagement/new-engagement"
        f"?announcement={doc.name}"
        f"&academic_year={doc.academic_year}"
    )

    subject = "Creation of FPMS Form"
    year = doc.academic_year or "2025–2026"

    # -------------------------------------------------------------
    # Send Email
    # -------------------------------------------------------------
    for email in recipients:

        faculty = frappe.db.get_value(
            "Faculty",
            {"email": email},
            ["faculty_name", "emp_code"],
            as_dict=True
        ) or {}

        full_name = faculty.get("faculty_name") or "Faculty"
        first_name = full_name.split(" ")[0]
        employee_code = faculty.get("emp_code") or "-"

        # ---------------------------------------------------------
        # EMAIL BODY (YOUR EXACT TEMPLATE)
        # ---------------------------------------------------------
        message = f"""
<p>Dear {first_name},</p>

<p>
The FPMS form <b>{full_name}</b> <b>{employee_code}</b>
for the year <b>{year}</b> has been created in the Frappe FPMS system.
</p>

<p>
Please use the link below to navigate to the document and to start
setting your Objectives and engagement details.
</p>

<p>
<a href="{engagement_link}" target="_blank">{engagement_link}</a>
</p>

<p style="font-size: 12px; color: #555;">
(Please do not respond to this automatic notification)
</p>

<p>
In case of any query please write to
<b>fpmssupport@apu.edu.in</b>
</p>

<p>
Regards,<br>
<b>People Function</b>
</p>
"""

        frappe.sendmail(
            recipients=[email],
            subject=subject,
            message=message
        )

    frappe.msgprint("📧 FPMS Email Sent Successfully")


# =====================================================================
#  OPTIONAL: AUTO-FILL API
# =====================================================================

@frappe.whitelist()
def tracker_defaults(announcement=None, academic_year=None):
    return {
        "announcement": announcement,
        "academic_year": academic_year
    }
