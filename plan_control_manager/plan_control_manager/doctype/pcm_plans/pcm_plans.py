# Copyright (c) 2024, Samarth Uparr and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class PCMPlans(Document):
	pass



@frappe.whitelist()
def get_plan_details(plan):
	doc = frappe.get_doc("PCM Plans", plan)
	role_profiles = [ i.role_profile for i in doc.pcm_role_profile]
	module_profiles = [ i.module_profile for i in doc.pcm_module_profile]
	role_profile_check = False if len(role_profiles) == 0 else True
	module_profile_check = False if len(module_profiles) == 0 else True
	return {"role_profiles": role_profiles, "module_profiles": module_profiles, "role_profile_check": role_profile_check, "module_profile_check": module_profile_check}
        
    