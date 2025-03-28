
import { supabase } from './client';

/**
 * Submit a form entry to Supabase
 */
export const submitFormEntry = async (formId: string, formData: Record<string, any>) => {
  const { data, error } = await supabase
    .from('form_submissions')
    .insert({
      form_id: formId,
      data: formData,
      submitted_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting form:', error);
    throw error;
  }

  return data;
};

/**
 * Get form submissions for a specific form
 */
export const getFormSubmissions = async (formId: string) => {
  const { data, error } = await supabase
    .from('form_submissions')
    .select('*')
    .eq('form_id', formId)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching form submissions:', error);
    throw error;
  }

  return data;
};

/**
 * Get form submissions for a company
 */
export const getCompanySubmissions = async (companyId: string) => {
  // First get all forms for this company
  const { data: forms, error: formsError } = await supabase
    .from('forms')
    .select('id')
    .eq('company_id', companyId);

  if (formsError) {
    console.error('Error fetching company forms:', formsError);
    throw formsError;
  }

  if (!forms || forms.length === 0) {
    return [];
  }

  const formIds = forms.map(form => form.id);

  // Then get all submissions for these forms
  const { data, error } = await supabase
    .from('form_submissions')
    .select('*, forms(name)')
    .in('form_id', formIds)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching form submissions:', error);
    throw error;
  }

  return data;
};
