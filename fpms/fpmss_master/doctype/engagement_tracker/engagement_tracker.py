import frappe
from frappe.model.document import Document

class EngagementTracker(Document):

    def after_insert(self):
        """Send email immediately after form is created"""
        send_submission_email(self.name)


@frappe.whitelist()
def send_submission_email(docname):

    doc = frappe.get_doc("Engagement Tracker", docname)

    # Validate Email
    if not doc.email:
        frappe.throw("Email field is empty. Please fill the Email before saving.")

    # First Name
    first_name = (doc.employee_name or "Faculty").split(" ")[0]

    # Link
    link = f"{frappe.utils.get_url()}/app/engagement-tracker/{doc.name}"

    # Year
    year = doc.academic_year or "2025-2026"

    subject = "FPMS Engagement Tracker Submission Confirmation"

    message = f"""
<p>Dear {first_name},</p>

<p>Your FPMS Engagement Tracker for the Year <b>{year}</b> has been saved successfully.</p>

<p>You can view the form using the link below:</p>
<p><a href="{link}" target="_blank">{link}</a></p>

<p><i>(Please do not respond to this automatic notification)</i></p>

<p>Regards,<br>
<b>People Function</b></p>
"""

    frappe.sendmail(
        recipients=[doc.email],
        subject=subject,
        message=message,
        now=True
    )

    frappe.msgprint("📧 Email Sent Successfully!")
