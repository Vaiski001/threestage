import { supabase } from './client';

/**
 * Tests the connection to Supabase and returns status information
 * This can be used to verify that the database connection is working correctly
 * in the Vercel deployment
 */
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // 1. Check if we can connect to Supabase
    const { data: connectionData, error: connectionError } = await supabase
      .from('profiles')
      .select('count()')
      .limit(1);
    
    if (connectionError) {
      console.error('Connection test failed:', connectionError);
      return {
        success: false,
        message: `Connection error: ${connectionError.message}`,
        error: connectionError
      };
    }
    
    // 2. Check if we can access the forms table
    const { data: formsData, error: formsError } = await supabase
      .from('forms')
      .select('count()')
      .limit(1);
    
    if (formsError && formsError.code !== '42P01') { // Ignore "relation does not exist" error
      console.error('Forms table access test failed:', formsError);
      return {
        success: false,
        message: `Forms table error: ${formsError.message}`,
        error: formsError
      };
    }
    
    // 3. Check auth services
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Auth service test failed:', sessionError);
      return {
        success: false,
        message: `Auth error: ${sessionError.message}`,
        error: sessionError
      };
    }
    
    // 4. Check storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .getBucket('public');
    
    const storageStatus = storageError ? {
      success: false,
      message: `Storage error: ${storageError.message}`,
    } : {
      success: true, 
      message: 'Storage is accessible'
    };
    
    return {
      success: true,
      message: 'Supabase connection test passed',
      connectionStatus: 'Connected',
      profilesAccess: 'Success',
      formsAccess: formsError ? 'Table may need to be created' : 'Success',
      authStatus: sessionData ? 'Working' : 'No session found',
      storageStatus,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Unexpected error during connection test:', error);
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      error
    };
  }
};

/**
 * Tests form creation in Supabase
 */
export const testFormCreation = async (companyId: string) => {
  try {
    console.log('Testing form creation...');
    
    const testForm = {
      name: `Test Form ${new Date().toISOString()}`,
      description: 'This is a test form to verify database connectivity',
      company_id: companyId,
      fields: [],
      branding: {
        primaryColor: '#0070f3',
        fontFamily: 'Inter'
      },
      is_public: false
    };
    
    // Import from forms.ts to test that functionality
    const { createForm } = await import('./forms');
    
    const createdForm = await createForm(testForm);
    
    return {
      success: true,
      message: 'Form created successfully',
      form: createdForm
    };
  } catch (error) {
    console.error('Error testing form creation:', error);
    return {
      success: false,
      message: `Form creation failed: ${error instanceof Error ? error.message : String(error)}`,
      error
    };
  }
};

/**
 * Run all database tests at once
 */
export const runAllDatabaseTests = async (companyId?: string) => {
  const connectionTest = await testSupabaseConnection();
  
  let formTest = { success: false, message: 'Form test not run (no company ID provided)' };
  if (companyId) {
    formTest = await testFormCreation(companyId);
  }
  
  return {
    connectionTest,
    formTest,
    timestamp: new Date().toISOString(),
    environment: {
      hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      isProduction: import.meta.env.PROD,
      deployTarget: 'Vercel'
    }
  };
}; 