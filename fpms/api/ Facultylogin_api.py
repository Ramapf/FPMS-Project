import frappe

# Existing function (keep it, Frappe needs this reference)
def get_home_page():
    return "/app/engagement-tracker"

# ⭐ NEW FUNCTION — 100% working Redirect
def redirect_faculty(page_name=None):
    user = frappe.session.user
    roles = frappe.get_roles(user)

    # Redirect ONLY Faculty Role
    if "Faculty" in roles:
        frappe.local.response["type"] = "redirect"
        frappe.local.response["location"] = "/app/engagement-tracker"
        return

    # Default behaviour for others (Admin, Manager etc.)
    return frappe.call("frappe.desk.desktop.get_desktop_page", page_name)
