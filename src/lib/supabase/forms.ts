
import { supabase } from './client';
import { FormTemplate } from './types';

/**
 * Ensure the forms table exists in the database
 */
export const ensureFormsTableExists = async () => {
  console.log('Checking if forms table exists...');
  
  try {
    // Check if the table exists by querying it
    const { error } = await supabase
      .from('forms')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') { // PostgreSQL code for "relation does not exist"
      console.log('Forms table does not exist, creating it...');
      
      // Create the forms table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS public.forms (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          fields JSONB DEFAULT '[]'::jsonb,
          branding JSONB DEFAULT '{"primaryColor":"#0070f3","fontFamily":"Inter"}'::jsonb,
          company_id UUID NOT NULL,
          is_public BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      const { error: createError } = await supabase.rpc('execute_sql', { 
        query: createTableQuery 
      });
      
      if (createError) {
        console.error('Error creating forms table:', createError);
        throw new Error(`Failed to create forms table: ${createError.message}`);
      }
      
      console.log('Forms table created successfully');
      return true;
    } else if (error) {
      console.error('Error checking forms table:', error);
      throw error;
    }
    
    console.log('Forms table already exists');
    return true;
  } catch (error) {
    console.error('Error ensuring forms table exists:', error);
    throw error;
  }
};

/**
 * Fetch all forms for a company
 */
export const getCompanyForms = async (companyId: string) => {
  console.log('Fetching forms for company:', companyId);
  
  if (!companyId) {
    console.error('Error: No company ID provided to getCompanyForms');
    throw new Error('Company ID is required to fetch forms');
  }
  
  // First ensure the table exists
  try {
    await ensureFormsTableExists();
  } catch (error) {
    console.warn('Could not verify forms table:', error);
    // Continue anyway, in case the error is not related to table existence
  }
  
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching forms:', error);
    throw error;
  }

  console.log('Forms fetched successfully:', data?.length || 0, 'forms found');
  return data as unknown as FormTemplate[];
};

/**
 * Fetch a single form by ID
 */
export const getFormById = async (formId: string) => {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', formId)
    .single();

  if (error) {
    console.error('Error fetching form:', error);
    throw error;
  }

  return data as unknown as FormTemplate;
};

/**
 * Create a new form
 */
export const createForm = async (form: Partial<FormTemplate>) => {
  console.log('Creating form with data:', JSON.stringify(form, null, 2));
  
  // Ensure required fields are present
  if (!form.company_id) {
    console.error('Error creating form: company_id is required');
    throw new Error('Company ID is required to create a form');
  }
  
  if (!form.name) {
    console.error('Error creating form: name is required');
    throw new Error('Form name is required');
  }

  // First ensure the table exists
  try {
    await ensureFormsTableExists();
  } catch (error) {
    console.error('Error ensuring forms table exists:', error);
    throw new Error(`Could not create form: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Process form data before sending to Supabase
  let formToInsert: Partial<FormTemplate> = {
    ...form,
    created_at: form.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_public: form.is_public !== undefined ? form.is_public : false
  };

  // Check if the fields array exists and is valid
  if (!formToInsert.fields || !Array.isArray(formToInsert.fields)) {
    console.log('Initializing empty fields array for form');
    formToInsert.fields = [];
  }

  // If there's a temporary ID, remove it as Supabase will generate a UUID
  if (formToInsert.id && (formToInsert.id.startsWith('form-') || formToInsert.id.startsWith('temp-'))) {
    console.log('Removing temporary ID:', formToInsert.id);
    const { id, ...formDataWithoutId } = formToInsert;
    formToInsert = formDataWithoutId;
  }

  console.log('Sending form data to Supabase:', JSON.stringify(formToInsert, null, 2));

  try {
    const { data, error } = await supabase
      .from('forms')
      .insert(formToInsert)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating form:', error);
      throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`);
    }

    console.log('Form created successfully:', data);
    return data as unknown as FormTemplate;
  } catch (error) {
    console.error('Exception creating form:', error);
    throw error;
  }
};

/**
 * Update an existing form
 */
export const updateForm = async (formId: string, updates: Partial<FormTemplate>) => {
  console.log('Updating form:', formId, 'with data:', updates);
  
  if (!formId) {
    console.error('Error: No form ID provided for update');
    throw new Error('Form ID is required to update a form');
  }
  
  // Always update the timestamp
  const formUpdates = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('forms')
      .update(formUpdates)
      .eq('id', formId)
      .select()
      .single();

    if (error) {
      console.error('Error updating form:', error);
      throw error;
    }

    console.log('Form updated successfully:', data);
    return data as unknown as FormTemplate;
  } catch (error) {
    console.error('Error updating form:', error);
    throw error;
  }
};

/**
 * Delete a form
 */
export const deleteForm = async (formId: string) => {
  console.log('Deleting form:', formId);
  
  if (!formId) {
    console.error('Error: No form ID provided for deletion');
    throw new Error('Form ID is required to delete a form');
  }
  
  const { error } = await supabase
    .from('forms')
    .delete()
    .eq('id', formId);

  if (error) {
    console.error('Error deleting form:', error);
    throw error;
  }

  console.log('Form deleted successfully');
  return true;
};

/**
 * Toggle form active status
 */
export const toggleFormActive = async (formId: string, isActive: boolean) => {
  console.log('Toggling form status:', formId, 'to:', isActive);
  
  if (!formId) {
    console.error('Error: No form ID provided for toggle');
    throw new Error('Form ID is required to toggle form status');
  }
  
  try {
    const { data, error } = await supabase
      .from('forms')
      .update({ 
        is_public: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', formId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling form status:', error);
      throw error;
    }

    console.log('Form status toggled successfully:', data);
    return data as unknown as FormTemplate;
  } catch (error) {
    console.error('Error toggling form status:', error);
    throw error;
  }
};
