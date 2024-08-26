// Function Declaration (Hoisted)
async function get_pcm_doc() {
    return await frappe.db.get_doc('PCM Setting');
}

frappe.provide("frappe.ui.form");

frappe.ui.form.UserQuickEntryForm = class UserQuickEntryForm extends frappe.ui.form.QuickEntryForm {
    constructor(doctype, after_insert, init_callback, doc, force) {
        super(doctype, after_insert, init_callback, doc, force);
    }

    async render_dialog() {
        // Customize the dialog rendering if needed
        super.render_dialog();
        console.log('Quick Entry form rendered');

        if (frappe.session.user !== 'Administrator') {
            let pcm_doc = await get_pcm_doc();
            if (pcm_doc.enable_pcm == 1 && pcm_doc.active_plan) {
                let data = await frappe.call({
                    method: 'plan_control_manager.plan_control_manager.doctype.pcm_plans.pcm_plans.get_plan_details',
                    args: {
                        plan: pcm_doc.active_plan
                    }
                });

                if (data.message && data.message.role_profile_check) {
                    // Ensure the field is defined before trying to set the query
                    if (this.dialog.fields_dict.role_profiles) {
                        this.dialog.fields_dict.role_profiles.get_query = function(doc, cdt, cdn) {
                            return {
                                filters: {
                                    name: ['in', data.message.role_profiles]
                                }
                            };
                        };
                    }
                    if (this.dialog.fields_dict.role_profile_name) {
                        this.dialog.fields_dict.role_profile_name.get_query = function(doc, cdt, cdn) {
                            return {
                                filters: {
                                    name: ['in', data.message.role_profiles]
                                }
                            };
                        };
                    }
                }
            }
        }
    }

    insert() {
        // Custom insert logic if needed
        return super.insert();
    }
};

// Override the existing Quick Entry form for the User Doctype
frappe.quick_entry_map['User'] = frappe.ui.form.UserQuickEntryForm;