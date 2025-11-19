app_name = "fpms"
app_title = "Faculty Performance Management System"
app_publisher = "Ram"
app_description = "Faculty Performance Management System project"
app_email = "mahaveer.p@azimpremjifoundation.org"
app_license = "mit"

# Doctype JS
doctype_js = {
    "Engagement Tracker": "public/js/engagement_tracker_list.js"
}

# Page JS
page_js = {
    "test-report": "public/js/test_report.js",
    "test_page": "page/test_page/test_page.js"
}

# Doc Events
doc_events = {
    "Announcement": {
        "on_submit": "fpms.fpms.doctype.announcement.announcement.send_announcement_email"
    }
}

# -------------------------
# The rest is default Frappe commented sections.
# Do not modify below unless needed.
# -------------------------

# Apps
# required_apps = []

# Includes in <head>
# app_include_css = "/assets/fpms/css/fpms.css"
# app_include_js = "/assets/fpms/js/fpms.js"

# Web Includes
# web_include_css = "/assets/fpms/css/fpms.css"
# web_include_js = "/assets/fpms/js/fpms.js"

# doctype_js = {}
# doctype_list_js = {}
# doctype_tree_js = {}
# doctype_calendar_js = {}

# Home Pages
# home_page = "login"

# Generators
# website_generators = ["Web Page"]

# Installation
# before_install = "fpms.install.before_install"
# after_install = "fpms.install.after_install"

# Scheduled Tasks
# scheduler_events = {}

# Testing
# before_tests = "fpms.install.before_tests"

# Auth
# auth_hooks = ["fpms.auth.validate"]
