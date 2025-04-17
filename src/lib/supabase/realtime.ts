import { RealtimeChannel, RealtimePostgresChangesFilter } from '@supabase/supabase-js';
import { supabase } from './client';
import { TABLES, DatabaseSchema, Message, Profile, Notification, Project, ProjectMilestone, Inquiry } from './schema';

type SubscriptionCallback<T = any> = (payload: {
  new: T;
  old: T;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}) => void;

/**
 * Subscribe to real-time changes on a table
 * @param table The table to subscribe to
 * @param callback Function to call when changes occur
 * @param filter Optional filter function to apply on the channel
 * @returns A function to unsubscribe
 */
export function subscribeToTable<T extends keyof DatabaseSchema>(
  table: T,
  callback: SubscriptionCallback<DatabaseSchema[T]>,
  filter?: (channel: RealtimeChannel) => RealtimeChannel
): () => void {
  let channel = supabase
    .channel(`table-changes:${table}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
      },
      (payload) => {
        callback({
          new: payload.new as DatabaseSchema[T],
          old: payload.old as DatabaseSchema[T],
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
        });
      }
    );

  // Apply optional filter
  if (filter) {
    channel = filter(channel);
  }

  channel.subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}

// Type for the filter function used in subscription helpers
type FilterFunction = (field: string, operator: string, value: string) => RealtimeChannel;

/**
 * Subscribe to messages for a specific inquiry
 * @param inquiryId The inquiry ID to subscribe to messages for
 * @param callback Function to call when new messages arrive
 * @returns A function to unsubscribe
 */
export function subscribeToInquiryMessages(
  inquiryId: string,
  callback: SubscriptionCallback<Message>
): () => void {
  return subscribeToTable(
    TABLES.messages,
    callback,
    (channel) => {
      const typedChannel = channel as unknown as { filter: FilterFunction };
      return typedChannel.filter('inquiry_id', 'eq', inquiryId) as unknown as RealtimeChannel;
    }
  );
}

/**
 * Subscribe to changes on a specific profile
 * @param profileId The profile ID to subscribe to
 * @param callback Function to call when profile changes
 * @returns A function to unsubscribe
 */
export function subscribeToProfile(
  profileId: string,
  callback: SubscriptionCallback<Profile>
): () => void {
  return subscribeToTable(
    TABLES.profiles,
    callback,
    (channel) => {
      const typedChannel = channel as unknown as { filter: FilterFunction };
      return typedChannel.filter('id', 'eq', profileId) as unknown as RealtimeChannel;
    }
  );
}

/**
 * Subscribe to new notifications for the current user
 * @param userId The user ID to subscribe notifications for
 * @param callback Function to call when new notifications arrive
 * @returns A function to unsubscribe
 */
export function subscribeToNotifications(
  userId: string,
  callback: SubscriptionCallback<Notification>
): () => void {
  return subscribeToTable(
    TABLES.notifications,
    callback,
    (channel) => {
      const typedChannel = channel as unknown as { filter: FilterFunction };
      return typedChannel.filter('user_id', 'eq', userId) as unknown as RealtimeChannel;
    }
  );
}

/**
 * Subscribe to changes on a project
 * @param projectId The project ID to subscribe to
 * @param callback Function to call when project changes
 * @returns A function to unsubscribe
 */
export function subscribeToProject(
  projectId: string,
  callback: SubscriptionCallback<Project>
): () => void {
  return subscribeToTable(
    TABLES.projects,
    callback,
    (channel) => {
      const typedChannel = channel as unknown as { filter: FilterFunction };
      return typedChannel.filter('id', 'eq', projectId) as unknown as RealtimeChannel;
    }
  );
}

/**
 * Subscribe to milestone changes for a project
 * @param projectId The project ID to subscribe to milestones for
 * @param callback Function to call when milestones change
 * @returns A function to unsubscribe
 */
export function subscribeToProjectMilestones(
  projectId: string,
  callback: SubscriptionCallback<ProjectMilestone>
): () => void {
  return subscribeToTable(
    TABLES.project_milestones,
    callback,
    (channel) => {
      const typedChannel = channel as unknown as { filter: FilterFunction };
      return typedChannel.filter('project_id', 'eq', projectId) as unknown as RealtimeChannel;
    }
  );
}

/**
 * Subscribe to inquiries for a company
 * @param companyId The company ID to subscribe inquiries for
 * @param callback Function to call when inquiries change
 * @returns A function to unsubscribe
 */
export function subscribeToCompanyInquiries(
  companyId: string,
  callback: SubscriptionCallback<Inquiry>
): () => void {
  return subscribeToTable(
    TABLES.inquiries,
    callback,
    (channel) => {
      const typedChannel = channel as unknown as { filter: FilterFunction };
      return typedChannel.filter('company_id', 'eq', companyId) as unknown as RealtimeChannel;
    }
  );
}

/**
 * Subscribe to inquiries for a customer
 * @param customerId The customer ID to subscribe inquiries for
 * @param callback Function to call when inquiries change
 * @returns A function to unsubscribe
 */
export function subscribeToCustomerInquiries(
  customerId: string,
  callback: SubscriptionCallback<Inquiry>
): () => void {
  return subscribeToTable(
    TABLES.inquiries,
    callback,
    (channel) => {
      const typedChannel = channel as unknown as { filter: FilterFunction };
      return typedChannel.filter('customer_id', 'eq', customerId) as unknown as RealtimeChannel;
    }
  );
}

/**
 * Initialize real-time subscriptions with Supabase
 * This function should be called once when the app starts
 */
export function initializeRealtimeSubscriptions(): void {
  // Enable all Postgres changes by default
  supabase.channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
      },
      (payload) => {
        console.log('Database change detected:', payload);
      }
    )
    .subscribe();
  
  console.log('Supabase real-time subscriptions initialized');
} 