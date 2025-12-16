import frappe

@frappe.whitelist(allow_guest=True)
def get_engagement_tracker_list():
    """Return full list of Engagement documents with all fields and child tables"""
    try:
        docs = frappe.get_all("Engagement", fields=["name"])
        result = []

        for d in docs:
            doc = frappe.get_doc("Engagement", d.name)
            result.append(doc.as_dict())  # includes all child tables & fields

        return result

    except Exception as e:
        frappe.log_error(message=str(e), title="Engagement Full List API Error")
        return {"error": str(e)}


