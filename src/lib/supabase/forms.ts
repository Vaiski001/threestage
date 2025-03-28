
import { supabase } from './client';
import { FormTemplate } from './types';

/**
 * Fetch all forms for a company
 */
export const getCompanyForms = async (companyId: string) => {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching forms:', error);
    throw error;
  }

  return data as FormTemplate[];
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

  return data as FormTemplate;
};

/**
 * Create a new form
 */
export const createForm = async (form: Partial<FormTemplate>) => {
  const { data, error } = await supabase
    .from('forms')
    .insert(form)
    .select()
    .single();

  if (error) {
    console.error('Error creating form:', error);
    throw error;
  }

  return data as FormTemplate;
};

/**
 * Update an existing form
 */
export const updateForm = async (formId: string, updates: Partial<FormTemplate>) => {
  const { data, error } = await supabase
    .from('forms')
    .update(updates)
    .eq('id', formId)
    .select()
    .single();

  if (error) {
    console.error('Error updating form:', error);
    throw error;
  }

  return data as FormTemplate;
};

/**
 * Delete a form
 */
export const deleteForm = async (formId: string) => {
  const { error } = await supabase
    .from('forms')
    .delete()
    .eq('id', formId);

  if (error) {
    console.error('Error deleting form:', error);
    throw error;
  }

  return true;
};

/**
 * Toggle form active status
 */
export const toggleFormActive = async (formId: string, isActive: boolean) => {
  const { data, error } = await supabase
    .from('forms')
    .update({ is_public: isActive })
    .eq('id', formId)
    .select()
    .single();

  if (error) {
    console.error('Error toggling form status:', error);
    throw error;
  }

  return data as FormTemplate;
};
