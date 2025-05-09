
import { supabase } from './client';
import { Enquiry } from './types';

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

  // After successfully submitting the form, create an enquiry
  const formResult = await supabase
    .from('forms')
    .select('company_id, name')
    .eq('id', formId)
    .single();
    
  if (formResult.error) {
    console.error('Error fetching form details:', formResult.error);
    // Still return the form submission data even if enquiry creation fails
    return data;
  }
  
  // Create an enquiry based on the form submission
  const enquiryData = {
    title: formData.subject || `Enquiry from ${formData.name || 'Website'}`,
    customer_name: formData.name || 'Anonymous',
    customer_email: formData.email || '',
    company_id: formResult.data.company_id,
    form_id: formId,
    form_name: formResult.data.name,
    submission_id: data.id,
    content: formData.message || JSON.stringify(formData),
    status: 'new', // Initial status is "new"
    created_at: new Date().toISOString(),
  };
  
  const { data: enquiryResult, error: enquiryError } = await supabase
    .from('enquiries')
    .insert(enquiryData)
    .select()
    .single();
    
  if (enquiryError) {
    console.error('Error creating enquiry:', enquiryError);
    // Still return the form submission data even if enquiry creation fails
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

/**
 * Get all enquiries for a company
 */
export const getCompanyEnquiries = async (companyId: string): Promise<Enquiry[]> => {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching company enquiries:', error);
    throw error;
  }

  // Explicitly convert the response data to match the Enquiry type
  if (!data) return [];
  
  const typedEnquiries: Enquiry[] = data.map(item => ({
    id: String(item.id),
    title: String(item.title),
    customer_name: String(item.customer_name),
    customer_email: String(item.customer_email),
    company_id: String(item.company_id),
    form_id: item.form_id ? String(item.form_id) : undefined,
    form_name: item.form_name ? String(item.form_name) : undefined,
    submission_id: item.submission_id ? String(item.submission_id) : undefined,
    content: String(item.content),
    status: (item.status || 'new') as 'new' | 'pending' | 'completed',
    priority: item.priority ? (String(item.priority) as 'high' | 'medium' | 'low') : undefined,
    created_at: String(item.created_at),
    updated_at: item.updated_at ? String(item.updated_at) : undefined
  }));

  return typedEnquiries;
};

/**
 * Get enquiries for a customer by email
 */
export const getCustomerEnquiries = async (customerEmail: string): Promise<Enquiry[]> => {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .eq('customer_email', customerEmail)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customer enquiries:', error);
    throw error;
  }

  // Explicitly convert the response data to match the Enquiry type
  if (!data) return [];
  
  const typedEnquiries: Enquiry[] = data.map(item => ({
    id: String(item.id),
    title: String(item.title),
    customer_name: String(item.customer_name),
    customer_email: String(item.customer_email),
    company_id: String(item.company_id),
    form_id: item.form_id ? String(item.form_id) : undefined,
    form_name: item.form_name ? String(item.form_name) : undefined,
    submission_id: item.submission_id ? String(item.submission_id) : undefined,
    content: String(item.content),
    status: (item.status || 'new') as 'new' | 'pending' | 'completed',
    priority: item.priority ? (String(item.priority) as 'high' | 'medium' | 'low') : undefined,
    created_at: String(item.created_at),
    updated_at: item.updated_at ? String(item.updated_at) : undefined
  }));

  return typedEnquiries;
};

/**
 * Update enquiry status
 */
export const updateEnquiryStatus = async (enquiryId: string, status: 'new' | 'pending' | 'completed'): Promise<Enquiry> => {
  const { data, error } = await supabase
    .from('enquiries')
    .update({ status })
    .eq('id', enquiryId)
    .select()
    .single();

  if (error) {
    console.error('Error updating enquiry status:', error);
    throw error;
  }

  // Explicitly convert the response data to match the Enquiry type
  if (!data) throw new Error('No data returned from update operation');
  
  const typedEnquiry: Enquiry = {
    id: String(data.id),
    title: String(data.title),
    customer_name: String(data.customer_name),
    customer_email: String(data.customer_email),
    company_id: String(data.company_id),
    form_id: data.form_id ? String(data.form_id) : undefined,
    form_name: data.form_name ? String(data.form_name) : undefined,
    submission_id: data.submission_id ? String(data.submission_id) : undefined,
    content: String(data.content),
    status: (data.status || 'new') as 'new' | 'pending' | 'completed',
    priority: data.priority ? (String(data.priority) as 'high' | 'medium' | 'low') : undefined,
    created_at: String(data.created_at),
    updated_at: data.updated_at ? String(data.updated_at) : undefined
  };

  return typedEnquiry;
};
