
import { supabase } from './client';
import { FormTemplate } from './types';

/**
 * Fetch all forms for a company
 */
export const getCompanyForms = async (companyId: string) => {
  console.log('Fetching forms for company:', companyId);
  
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching forms:', error);
    throw error;
  }

  console.log('Forms fetched successfully:', data);
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

  // If there's a temporary ID, remove it as Supabase will generate a UUID
  if (formToInsert.id && formToInsert.id.startsWith('form-')) {
    const { id, ...formDataWithoutId } = formToInsert;
    formToInsert = formDataWithoutId;
  }

  console.log('Sending form data to Supabase:', formToInsert);

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
};

/**
 * Update an existing form
 */
export const updateForm = async (formId: string, updates: Partial<FormTemplate>) => {
  console.log('Updating form:', formId, 'with data:', updates);
  
  // Always update the timestamp
  const formUpdates = {
    ...updates,
    updated_at: new Date().toISOString()
  };

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
};

/**
 * Delete a form
 */
export const deleteForm = async (formId: string) => {
  console.log('Deleting form:', formId);
  
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
};
