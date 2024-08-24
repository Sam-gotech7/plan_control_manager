from frappe.core.doctype.user.user import User
import frappe

class CustomUser(User):
    def before_insert(self):
        pcm = frappe.get_doc("PCM Setting")
        print("pcm", pcm.as_dict())

        if pcm.enable_pcm:
            # Ensure existing role profiles are preserved
            if not self.role_profiles:
                self.role_profiles = []

            # Convert any existing dict entries to document objects
            self.role_profiles = [
                frappe.get_doc(d) if isinstance(d, dict) else d
                for d in self.role_profiles
            ]

            # Check if the default role profile already exists
            existing_profiles = [role.role_profile for role in self.role_profiles]
            
            if pcm.default_role_profile not in existing_profiles:
                # Create a new role profile object
                new_role_profile = frappe.get_doc({
                    'doctype': 'User Role Profile',
                    'role_profile': pcm.default_role_profile,
                    'parent': self.name,
                    'parentfield': 'role_profiles',
                    'parenttype': 'User'
                })

                # Add the new role profile object to the role_profiles list
                self.role_profiles.append(new_role_profile)

            # Set the module profile
            self.module_profile = pcm.default_module_profile
        
        super().before_insert() 
    def before_naming(self):
        print('before_naming')    
        
        
        

            
        