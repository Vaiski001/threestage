
import { supabase } from './client';
import { FormTemplate } from './types';

/**
 * Fetch all forms for a company
 */
export const getCompanyForms = async (companyId: string) => {
  console.log('Fetching forms for company:', companyId);
  
  if (!companyId) {
    console.error('Error: No company ID provided to getCompanyForms');
    throw new Error('Company ID is required to fetch forms');
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
  console.log('Creating form with data:', form);
  
  // Ensure required fields are present
  if (!form.company_id) {
    console.error('Error creating form: company_id is required');
    throw new Error('Company ID is required to create a form');
  }
  
  if (!form.name) {
    console.error('Error creating form: name is required');
    throw new Error('Form name is required');
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
  if (formToInsert.id && formToInsert.id.startsWith('form-')) {
    console.log('Removing temporary ID:', formToInsert.id);
    const { id, ...formDataWithoutId } = formToInsert;
    formToInsert = formDataWithoutId;
  }

  console.log('Sending form data to Supabase:', JSON.stringify(formToInsert));

  try {
    const { data, error } = await supabase
      .from('forms')
      .insert(formToInsert)
      .select()
      .single();

    if (error) {
      console.error('Error creating form:', error);
      throw error;
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
