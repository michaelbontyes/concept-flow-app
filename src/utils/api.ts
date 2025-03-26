import { createBrowserClient } from '@/utils/supabase';

// Initialize Supabase client
const supabase = createBrowserClient();

// Example usage in an API utility
export const getApiBaseUrl = () => {
  // Use the environment-specific URL
  return process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_FRONTEND_URL_PROD 
    : process.env.NEXT_PUBLIC_FRONTEND_URL_DEV;
};

// Updated function to handle organization_id access with proper permissions
export const getOrganizationsForUser = async (userId: string) => {
  try {
    // Option 1: Use the auth.users() function if you have access
    const { data: authUser, error: authError } = await supabase
      .rpc('get_user_organizations', { user_id: userId });
      
    if (authError) {
      console.error('Error fetching user organizations via RPC:', authError);
      
      // Option 2: Try using a view if available
      const { data: viewData, error: viewError } = await supabase
        .from('user_organizations_view')
        .select('organization_id')
        .eq('user_id', userId)
        .single();
        
      if (viewError) {
        console.error('Error fetching from view:', viewError);
        
        // Option 3: Last resort - use the auth user's metadata if it contains org info
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        // If user metadata contains organization_ids
        const orgIds = user?.user_metadata?.organization_id || [];
        
        if (orgIds.length === 0) return [];
        
        // Fetch organizations using the IDs from metadata
        const { data: orgs, error: orgsError } = await supabase
          .from('organizations')
          .select('*')
          .in('id', orgIds)
          .order('created_at', { ascending: false });
          
        if (orgsError) throw orgsError;
        return orgs;
      }
      
      // If view data exists, use it
      if (!viewData?.organization_id || !viewData.organization_id.length) {
        return [];
      }
      
      const { data: orgs, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .in('id', viewData.organization_id)
        .order('created_at', { ascending: false });
        
      if (orgsError) throw orgsError;
      return orgs;
    }
    
    // If RPC function worked, use its data
    if (!authUser || !authUser.length) {
      return [];
    }
    
    // authUser might directly be the organizations or contain organization_ids
    if (authUser[0].id) {
      // If it's already the organizations
      return authUser;
    } else {
      // If it's just the IDs
      const { data: orgs, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .in('id', authUser)
        .order('created_at', { ascending: false });
        
      if (orgsError) throw orgsError;
      return orgs;
    }
  } catch (error) {
    console.error('Error in getOrganizationsForUser:', error);
    return [];
  }
};
