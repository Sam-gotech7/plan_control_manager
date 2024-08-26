frappe.ui.form.on('User', {
    setup:async function(frm) {
        if (frappe.session.user !== 'Administrator') {
            let pcm_doc = await  get_pcm_doc();
            if(pcm_doc.enable_pcm == 1 && pcm_doc.active_plan){
               let data = await frappe.call({
                   method: 'plan_control_manager.plan_control_manager.doctype.pcm_plans.pcm_plans.get_plan_details',
                   args: {
                       plan: pcm_doc.active_plan
                   }
               })
               if (data.message && data.message.role_profile_check) {
                    frm.set_query('role_profiles', function (doc, cdt, cdn) {
                        let d = locals[cdt][cdn];
                        return {
                            filters: {
                                name: ['in', data.message.role_profiles]
                            }
                        };
                    })
                    frm.set_query('role_profile', function (doc, cdt, cdn) {
                        let d = locals[cdt][cdn];
                        return {
                            filters: {
                                name: ['in', data.message.role_profiles]
                            }
                        };
                    })
                  
               }
               if(data.message && data.message.module_profile_check){
                   frm.set_query('module_profile', function () {
                       return {
                           filters: {
                               name: ['in', data.message.module_profiles]
                           }
                       };
                   })
               }
            }
        }
    },
    refresh: async function(frm) {
        if (frappe.session.user !== 'Administrator' && !frm.is_new()) {
            let enabled = await has_pcm_enabled();
            enabled = parseInt(enabled)
            if (enabled) {
                console.log('not admin');
                frm.roles_editor && (frm.roles_editor.disable = 1);

                if (frm.doc.role_profiles && frm.doc.role_profiles.length) {
                    await frm.call("populate_role_profile_roles");
                    frm.roles_editor.show();
                } else {
                    frm.roles_editor.show();
                }

                frm.set_df_property('module_profile', 'reqd', 1);
            }
        }
    }

});
const get_pcm_doc = async ()=>{
    return await frappe.db.get_doc('PCM Setting');
}

const has_pcm_enabled = async () => {
    const enabled = await frappe.db.get_single_value('PCM Setting', 'enable_pcm');
    return enabled;
};