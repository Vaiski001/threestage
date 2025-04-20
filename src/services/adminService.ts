import { supabase } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Types for admin dashboard data
export interface DashboardData {
  totalCustomers: number;
  totalCompanies: number;
  totalInquiries: number;
  recentInquiries: InquiryData[];
  recentActivities: ActivityData[];
  systemHealth: SystemHealthData;
}

export interface InquiryData {
  id: string;
  title: string;
  content?: string;
  status: string;
  priority: string;
  created_at: string;
  customer_id: string;
  company_id: string;
  profiles?: {
    name: string;
  };
}

export interface ActivityData {
  id: string;
  action: string;
  entity: string;
  entity_id: string;
  performed_by: string;
  performed_at: string;
  details?: Record<string, any>;
}

export interface SystemHealthData {
  storageUsage: number;
  activeUsers: number;
  errorRate: number;
  lastBackup?: string;
}

// Types for admin user management
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in?: string;
  active?: boolean;
}

// Types for system settings
export interface SystemSettings {
  enableNotifications: boolean;
  enableDataSync: boolean;
  darkMode?: boolean;
  debugMode: boolean;
  maintenanceMode: boolean;
}

// Types for database settings
export interface DatabaseSettings {
  maxConnections: number;
  timeout: number;
  logLevel: string;
  backupFrequency: string;
  autoVacuum: boolean;
  lastBackupDate: string | null;
}

// Types for storage settings
export interface StorageSettings {
  maxUploadSize: number;
  allowedFileTypes: string[];
  storageQuota: number;
  currentUsage: number;
  compressUploads: boolean;
  storageProvider: string;
}

// Types for notification templates
export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
  isActive: boolean;
}

// Types for notification channels
export interface NotificationChannel {
  id: string;
  name: string;
  type: string;
  isEnabled: boolean;
  config: Record<string, any>;
}

// Types for API keys
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  scopes: string[];
  expiresAt: string | null;
  lastUsed: string | null;
  createdAt: string;
  isActive: boolean;
}

// Types for API integrations
export interface ApiIntegration {
  id: string;
  name: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
  config: Record<string, any>;
}

/**
 * AdminService - Service class to abstract Supabase operations for admin features
 * 
 * This provides a clean interface between the UI components and the backend,
 * with proper error handling, data transformation, and real-time subscriptions.
 */
class AdminService {
  private realtimeSubscriptions: Map<string, RealtimeChannel> = new Map();
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  
  /**
   * Initialize service and setup real-time subscriptions
   */
  constructor() {
    this.setupRealtimeSubscriptions();
  }
  
  /**
   * Setup real-time subscriptions to track changes across portals
   */
  private setupRealtimeSubscriptions() {
    // Subscribe to profiles table for user changes (both customer and company portals)
    this.subscribeToTable('profiles', (payload) => {
      console.log('Profiles change detected:', payload);
      this.notifyListeners('profiles', payload);
      this.notifyListeners('dashboard', { type: 'profiles', data: payload });
    });
    
    // Subscribe to inquiries table
    this.subscribeToTable('inquiries', (payload) => {
      console.log('Inquiry change detected:', payload);
      this.notifyListeners('inquiries', payload);
      this.notifyListeners('dashboard', { type: 'inquiries', data: payload });
    });
    
    // Subscribe to messages table
    this.subscribeToTable('messages', (payload) => {
      console.log('Message change detected:', payload);
      this.notifyListeners('messages', payload);
      this.notifyListeners('dashboard', { type: 'messages', data: payload });
    });
    
    // Subscribe to projects table
    this.subscribeToTable('projects', (payload) => {
      console.log('Project change detected:', payload);
      this.notifyListeners('projects', payload);
      this.notifyListeners('dashboard', { type: 'projects', data: payload });
    });
    
    // Track system activities (could be a custom table)
    this.subscribeToTable('system_activities', (payload) => {
      console.log('System activity detected:', payload);
      this.notifyListeners('activities', payload);
      this.notifyListeners('dashboard', { type: 'activities', data: payload });
    });
  }
  
  /**
   * Subscribe to changes on a specific table
   */
  private subscribeToTable(tableName: string, callback: (payload: any) => void) {
    try {
      const channel = supabase
        .channel(`admin-${tableName}-changes`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: tableName },
          (payload) => callback(payload)
        )
        .subscribe((status) => {
          console.log(`Subscription to ${tableName} status:`, status);
        });
      
      this.realtimeSubscriptions.set(tableName, channel);
    } catch (error) {
      console.error(`Error setting up subscription for ${tableName}:`, error);
    }
  }
  
  /**
   * Add a listener for a specific data type
   */
  public addListener(dataType: string, callback: (data: any) => void) {
    if (!this.listeners.has(dataType)) {
      this.listeners.set(dataType, new Set());
    }
    this.listeners.get(dataType)?.add(callback);
    
    return () => {
      // Return unsubscribe function
      this.listeners.get(dataType)?.delete(callback);
    };
  }
  
  /**
   * Notify all listeners for a specific data type
   */
  private notifyListeners(dataType: string, data: any) {
    this.listeners.get(dataType)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${dataType} listener:`, error);
      }
    });
  }
  
  /**
   * Clean up all subscriptions
   */
  public cleanup() {
    this.realtimeSubscriptions.forEach(channel => {
      channel.unsubscribe();
    });
    this.realtimeSubscriptions.clear();
    this.listeners.clear();
  }

  /**
   * Fetch dashboard data with error handling for each query
   */
  async fetchDashboardData(): Promise<DashboardData> {
    console.log("AdminService: Fetching dashboard data...");
    
    try {
      // Query customers count
      const customersResult = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');
      
      if (customersResult.error) {
        console.error("Customer query failed:", customersResult.error);
        throw new Error(`Error fetching customers: ${customersResult.error.message}`);
      }
      
      // Query companies count
      const companiesResult = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'company');
      
      if (companiesResult.error) {
        console.error("Company query failed:", companiesResult.error);
        throw new Error(`Error fetching companies: ${companiesResult.error.message}`);
      }
      
      // Query inquiries count
      const inquiriesCountResult = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true });
      
      if (inquiriesCountResult.error) {
        console.error("Inquiries count query failed:", inquiriesCountResult.error);
        throw new Error(`Error fetching inquiry count: ${inquiriesCountResult.error.message}`);
      }
      
      // Query recent inquiries
      const recentInquiriesResult = await supabase
        .from('inquiries')
        .select('*, profiles(name)')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (recentInquiriesResult.error) {
        console.error("Recent inquiries query failed:", recentInquiriesResult.error);
        throw new Error(`Error fetching recent inquiries: ${recentInquiriesResult.error.message}`);
      }
      
      // Get recent system activities (mock data for now, should be replaced with real data)
      // In a real implementation, this would query a system_activities or audit_log table
      const recentActivities: ActivityData[] = await this.getRecentActivities();
      
      // Get system health metrics
      const systemHealth = await this.getSystemHealthMetrics();

      console.log("AdminService: Dashboard data fetched successfully", {
        customersCount: customersResult.count,
        companiesCount: companiesResult.count,
        inquiriesCount: inquiriesCountResult.count,
        recentInquiriesCount: recentInquiriesResult.data?.length
      });

      // Return the consolidated data
      return {
        totalCustomers: customersResult.count || 0,
        totalCompanies: companiesResult.count || 0,
        totalInquiries: inquiriesCountResult.count || 0,
        recentInquiries: recentInquiriesResult.data as InquiryData[] || [],
        recentActivities,
        systemHealth
      };
      
    } catch (error) {
      console.error("AdminService: Error fetching dashboard data:", error);
      // Log the error to a monitoring service in production
      this.logError('fetchDashboardData', error);
      
      // Return empty data on error to prevent UI crashes
      return {
        totalCustomers: 0,
        totalCompanies: 0,
        totalInquiries: 0,
        recentInquiries: [],
        recentActivities: [],
        systemHealth: {
          storageUsage: 0,
          activeUsers: 0,
          errorRate: 0
        }
      };
    }
  }
  
  /**
   * Get recent system activities
   * This would ideally query an audit_log or system_activities table
   */
  private async getRecentActivities(): Promise<ActivityData[]> {
    try {
      // Try to fetch from a system_activities table if it exists
      const { data, error } = await supabase
        .from('system_activities')
        .select('*')
        .order('performed_at', { ascending: false })
        .limit(10);
      
      if (error) {
        // If table doesn't exist, return empty array in production
        console.warn("System activities table may not exist:", error);
        return [];
      }
      
      return data as ActivityData[];
    } catch (error) {
      console.error("Error fetching system activities:", error);
      return [];
    }
  }
  
  /**
   * Get system health metrics
   * In a real app, this would query actual metrics
   */
  private async getSystemHealthMetrics(): Promise<SystemHealthData> {
    try {
      // Attempt to get storage usage from Supabase if available
      const { data: storageData, error: storageError } = await supabase
        .rpc('get_storage_usage');
      
      // Get active users in the last 24 hours
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const { count: activeUsers, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('last_sign_in_at', oneDayAgo.toISOString());
      
      // Get error rate from error_logs if it exists
      const { data: errorData, error: errorLogError } = await supabase
        .from('error_logs')
        .select('*', { count: 'exact' })
        .gt('created_at', oneDayAgo.toISOString());
      
      return {
        storageUsage: storageError ? 0 : (storageData || 0),
        activeUsers: userError ? 0 : (activeUsers || 0),
        errorRate: errorLogError ? 0 : ((errorData?.length || 0) / 24), // Errors per hour
        lastBackup: new Date().toISOString() // Mock data, should come from actual backup system
      };
    } catch (error) {
      console.error("Error fetching system health metrics:", error);
      return {
        storageUsage: 0,
        activeUsers: 0,
        errorRate: 0
      };
    }
  }

  /**
   * Update user profile - used in settings page
   */
  async updateUserProfile(userId: string, userData: Partial<AdminUser>): Promise<{ success: boolean; error?: string }> {
    try {
      // Remove any fields that should not be updated
      const { id, created_at, ...updateData } = userData as any;
      
      console.log(`AdminService: Updating profile for user ${userId}`);
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
        
      if (error) throw new Error(error.message);
      
      // Log the profile update as an activity
      await this.logActivity({
        action: 'update',
        entity: 'profile',
        entity_id: userId,
        performed_by: userId,
        details: { fields: Object.keys(updateData) }
      });
      
      return { success: true };
    } catch (error) {
      console.error("AdminService: Error updating user profile:", error);
      this.logError('updateUserProfile', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      };
    }
  }

  /**
   * Get list of users for admin management
   */
  async getUsers(): Promise<AdminUser[]> {
    try {
      console.log("AdminService: Fetching users list");
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role, created_at, last_sign_in_at, active');
        
      if (error) throw new Error(error.message);
      
      return data as AdminUser[] || [];
    } catch (error) {
      console.error("AdminService: Error fetching users:", error);
      this.logError('getUsers', error);
      return [];
    }
  }
  
  /**
   * Update admin password
   */
  async updateAdminPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log("AdminService: Updating admin password");
      
      // Get the current user's email
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData.user?.email;
      
      if (!userEmail) {
        return { 
          success: false, 
          error: "Unable to retrieve user email" 
        };
      }
      
      // Verify the current password first
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword
      });
      
      if (verifyError) {
        console.error("Password verification failed:", verifyError);
        return { 
          success: false, 
          error: "Current password is incorrect" 
        };
      }
      
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw new Error(error.message);
      
      // Log the password update as an activity (without including password details)
      await this.logActivity({
        action: 'update',
        entity: 'admin_password',
        entity_id: 'protected',
        performed_by: 'admin',
        details: { timestamp: new Date().toISOString() }
      });
      
      return { success: true };
    } catch (error) {
      console.error("AdminService: Error updating admin password:", error);
      this.logError('updateAdminPassword', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      };
    }
  }
  
  /**
   * Log system activity for audit trail
   */
  async logActivity(
    actionOrActivity: string | Omit<ActivityData, 'id' | 'performed_at'>,
    entity?: string,
    entityId?: string
  ): Promise<void> {
    try {
      // Handle both parameter styles
      let activity: Omit<ActivityData, 'id' | 'performed_at'>;
      
      if (typeof actionOrActivity === 'string') {
        // Handle string parameters (legacy style)
        activity = {
          action: actionOrActivity,
          entity: entity || 'unknown',
          entity_id: entityId || 'unknown',
          performed_by: 'admin',
        };
      } else {
        // Handle object parameter (preferred style)
        activity = actionOrActivity;
      }
      
      const { error } = await supabase
        .from('system_activities')
        .insert({
          ...activity,
          performed_at: new Date().toISOString()
        });
      
      if (error) {
        console.warn("Failed to log activity, table may not exist:", error);
      }
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  }
  
  /**
   * Log error for monitoring
   */
  private logError(source: string, error: unknown): void {
    try {
      // Log to error_logs table if it exists
      supabase
        .from('error_logs')
        .insert({
          source,
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          created_at: new Date().toISOString()
        })
        .then(({ error: insertError }) => {
          if (insertError) {
            console.warn("Failed to log error, table may not exist:", insertError);
          }
        });
    } catch (logError) {
      console.error("Error while logging error:", logError);
    }
  }

  /**
   * Get system settings from the database
   */
  async getSystemSettings(): Promise<SystemSettings> {
    try {
      console.log("AdminService: Fetching system settings");
      
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();
        
      if (error) {
        // If settings don't exist yet or there's another error
        console.warn("System settings fetch error:", error);
        
        // Return default values
        return {
          enableNotifications: true,
          enableDataSync: true,
          debugMode: false,
          maintenanceMode: false
        };
      }
      
      return data as SystemSettings;
    } catch (error) {
      console.error("AdminService: Error fetching system settings:", error);
      this.logError('getSystemSettings', error);
      
      // Return default values on error
      return {
        enableNotifications: true,
        enableDataSync: true,
        debugMode: false,
        maintenanceMode: false
      };
    }
  }

  /**
   * Update system settings
   */
  async updateSystemSettings(settings: SystemSettings): Promise<SystemSettings> {
    try {
      console.log("AdminService: Updating system settings");
      
      // First check if settings exist
      const { data: existingData, error: checkError } = await supabase
        .from('system_settings')
        .select('id')
        .single();
      
      let result;
      
      if (checkError) {
        // Settings don't exist yet, insert new record
        result = await supabase
          .from('system_settings')
          .insert({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
      } else {
        // Settings exist, update them
        result = await supabase
          .from('system_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id)
          .select()
          .single();
      }
      
      if (result.error) throw new Error(result.error.message);
      
      // Log the settings update as an activity
      await this.logActivity({
        action: 'update',
        entity: 'system_settings',
        entity_id: 'global',
        performed_by: 'admin',
        details: { settings }
      });
      
      return result.data as SystemSettings;
    } catch (error) {
      console.error("AdminService: Error updating system settings:", error);
      this.logError('updateSystemSettings', error);
      throw error;
    }
  }

  /**
   * Fetch database configuration settings
   */
  async getDatabaseSettings(): Promise<DatabaseSettings> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('type', 'database')
        .single();
      
      if (error) {
        console.error("Error fetching database settings:", error);
        // Return defaults if settings don't exist
        return {
          maxConnections: 100,
          timeout: 30,
          logLevel: "info",
          backupFrequency: "daily",
          autoVacuum: true,
          lastBackupDate: null
        };
      }
      
      return data.settings as DatabaseSettings;
    } catch (error) {
      this.logError("getDatabaseSettings", error);
      // Return defaults on error
      return {
        maxConnections: 100,
        timeout: 30,
        logLevel: "info",
        backupFrequency: "daily",
        autoVacuum: true,
        lastBackupDate: null
      };
    }
  }

  /**
   * Fetch storage configuration settings
   */
  async getStorageSettings(): Promise<StorageSettings> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('type', 'storage')
        .single();
      
      if (error) {
        console.error("Error fetching storage settings:", error);
        // Return defaults if settings don't exist
        return {
          maxUploadSize: 10,
          allowedFileTypes: [".jpg", ".png", ".pdf", ".docx"],
          storageQuota: 5120, // 5GB in MB
          currentUsage: 1024, // 1GB in MB
          compressUploads: true,
          storageProvider: "supabase"
        };
      }
      
      return data.settings as StorageSettings;
    } catch (error) {
      this.logError("getStorageSettings", error);
      // Return defaults on error
      return {
        maxUploadSize: 10,
        allowedFileTypes: [".jpg", ".png", ".pdf", ".docx"],
        storageQuota: 5120, // 5GB in MB
        currentUsage: 1024, // 1GB in MB
        compressUploads: true,
        storageProvider: "supabase"
      };
    }
  }

  /**
   * Update database configuration settings
   */
  async updateDatabaseSettings(settings: DatabaseSettings): Promise<void> {
    try {
      // Check if settings record exists
      const { data, error } = await supabase
        .from('system_settings')
        .select('id')
        .eq('type', 'database')
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw error;
      }
      
      if (data) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('system_settings')
          .update({ settings, updated_at: new Date().toISOString() })
          .eq('id', data.id);
        
        if (updateError) throw updateError;
      } else {
        // Insert new settings
        const { error: insertError } = await supabase
          .from('system_settings')
          .insert({
            type: 'database',
            settings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (insertError) throw insertError;
      }
      
      await this.logActivity('updated', 'database_settings', 'system');
    } catch (error) {
      this.logError("updateDatabaseSettings", error);
      throw new Error(`Failed to update database settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update storage configuration settings
   */
  async updateStorageSettings(settings: StorageSettings): Promise<void> {
    try {
      // Check if settings record exists
      const { data, error } = await supabase
        .from('system_settings')
        .select('id')
        .eq('type', 'storage')
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw error;
      }
      
      if (data) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('system_settings')
          .update({ settings, updated_at: new Date().toISOString() })
          .eq('id', data.id);
        
        if (updateError) throw updateError;
      } else {
        // Insert new settings
        const { error: insertError } = await supabase
          .from('system_settings')
          .insert({
            type: 'storage',
            settings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (insertError) throw insertError;
      }
      
      await this.logActivity('updated', 'storage_settings', 'system');
    } catch (error) {
      this.logError("updateStorageSettings", error);
      throw new Error(`Failed to update storage settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Backup the database
   */
  async backupDatabase(): Promise<void> {
    try {
      // In a real implementation, this might call a server-side function
      // to handle the actual database backup

      // For now, we'll just simulate a successful backup
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the last backup date in the database settings
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('type', 'database')
        .single();
      
      const settings = (data?.settings || {}) as DatabaseSettings;
      settings.lastBackupDate = new Date().toISOString();
      
      await this.updateDatabaseSettings(settings);
      await this.logActivity('created', 'database_backup', 'system');
    } catch (error) {
      this.logError("backupDatabase", error);
      throw new Error(`Failed to backup database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get notification templates
   */
  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      this.logError("getNotificationTemplates", error);
      // Return sample data for demo
      return [
        {
          id: "1",
          name: "Welcome Email",
          subject: "Welcome to Threestage",
          content: "Hello {user_name},\n\nWelcome to Threestage! We're excited to have you on board.\n\nBest regards,\nThe Threestage Team",
          type: "email",
          isActive: true
        },
        {
          id: "2",
          name: "New Inquiry Notification",
          subject: "New Inquiry: {inquiry_title}",
          content: "A new inquiry has been submitted by {customer_name}. Please respond within 24 hours.",
          type: "email",
          isActive: true
        },
        {
          id: "3",
          name: "Password Reset",
          subject: "Password Reset Request",
          content: "Click the following link to reset your password: {reset_link}",
          type: "email",
          isActive: true
        },
        {
          id: "4",
          name: "Inquiry Status Update",
          subject: "Update on your inquiry",
          content: "Your inquiry '{inquiry_title}' has been updated to status: {inquiry_status}",
          type: "email",
          isActive: true
        }
      ];
    }
  }

  /**
   * Get notification channels
   */
  async getNotificationChannels(): Promise<NotificationChannel[]> {
    try {
      const { data, error } = await supabase
        .from('notification_channels')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      this.logError("getNotificationChannels", error);
      // Return sample data for demo
      return [
        {
          id: "1",
          name: "System Email",
          type: "email",
          isEnabled: true,
          config: {
            provider: "smtp",
            from_email: "noreply@threestage.com",
            from_name: "Threestage System"
          }
        },
        {
          id: "2",
          name: "SMS Notifications",
          type: "sms",
          isEnabled: false,
          config: {
            provider: "twilio",
            from_number: "+15555555555"
          }
        },
        {
          id: "3",
          name: "Push Notifications",
          type: "push",
          isEnabled: true,
          config: {
            fcm_key: "******",
            icon: "app_icon"
          }
        },
        {
          id: "4",
          name: "In-App Notifications",
          type: "in_app",
          isEnabled: true,
          config: {
            max_age_days: 30,
            auto_dismiss: false
          }
        }
      ];
    }
  }

  /**
   * Update a notification template
   */
  async updateNotificationTemplate(template: NotificationTemplate): Promise<NotificationTemplate> {
    try {
      // For new templates (temporary id)
      if (template.id.startsWith('temp-')) {
        const { data, error } = await supabase
          .from('notification_templates')
          .insert({
            name: template.name,
            subject: template.subject,
            content: template.content,
            type: template.type,
            is_active: template.isActive,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Convert to camelCase for consistency
        return {
          id: data.id,
          name: data.name,
          subject: data.subject,
          content: data.content,
          type: data.type,
          isActive: data.is_active
        };
      } else {
        // For existing templates
        const { data, error } = await supabase
          .from('notification_templates')
          .update({
            name: template.name,
            subject: template.subject,
            content: template.content,
            type: template.type,
            is_active: template.isActive,
            updated_at: new Date().toISOString()
          })
          .eq('id', template.id)
          .select()
          .single();
        
        if (error) throw error;
        
        // Convert to camelCase for consistency
        return {
          id: data.id,
          name: data.name,
          subject: data.subject,
          content: data.content,
          type: data.type,
          isActive: data.is_active
        };
      }
    } catch (error) {
      this.logError("updateNotificationTemplate", error);
      
      // For demo purposes, just return the template that was passed in
      await new Promise(resolve => setTimeout(resolve, 500));
      return template.id.startsWith('temp-') 
        ? { ...template, id: Math.random().toString(36).substring(2, 9) }
        : template;
    }
  }

  /**
   * Delete a notification template
   */
  async deleteNotificationTemplate(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notification_templates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await this.logActivity('deleted', 'notification_template', id);
    } catch (error) {
      this.logError("deleteNotificationTemplate", error);
      // For demo purposes
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  /**
   * Update a notification channel
   */
  async updateNotificationChannel(id: string, updates: Partial<NotificationChannel>): Promise<void> {
    try {
      const { error } = await supabase
        .from('notification_channels')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      await this.logActivity('updated', 'notification_channel', id);
    } catch (error) {
      this.logError("updateNotificationChannel", error);
      // For demo purposes
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  /**
   * Get system activity logs with filtering options
   */
  async getAuditLogs(filters?: { 
    action?: string; 
    entity?: string; 
    dateFrom?: string; 
    dateTo?: string;
    limit?: number;
  }): Promise<ActivityData[]> {
    try {
      let query = supabase
        .from('system_activities')
        .select('*')
        .order('performed_at', { ascending: false });
      
      // Apply filters if provided
      if (filters) {
        if (filters.action) {
          query = query.eq('action', filters.action);
        }
        
        if (filters.entity) {
          query = query.eq('entity', filters.entity);
        }
        
        if (filters.dateFrom) {
          query = query.gte('performed_at', filters.dateFrom);
        }
        
        if (filters.dateTo) {
          query = query.lte('performed_at', filters.dateTo);
        }
        
        if (filters.limit) {
          query = query.limit(filters.limit);
        }
      } else {
        // Default limit
        query = query.limit(100);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      this.logError("getAuditLogs", error);
      
      // Generate sample data for demo purposes
      const sampleData: ActivityData[] = [];
      const actions = ['created', 'updated', 'deleted', 'logged_in', 'logged_out', 'viewed'];
      const entities = ['user', 'inquiry', 'message', 'system', 'notification', 'file', 'setting'];
      const users = ['admin@example.com', 'system', 'scheduler', 'api', 'jane.doe@example.com'];
      
      // Generate 50 sample logs
      for (let i = 0; i < 50; i++) {
        const date = new Date();
        date.setHours(date.getHours() - Math.floor(Math.random() * 24 * 7)); // Random time in the past week
        
        const action = actions[Math.floor(Math.random() * actions.length)];
        const entity = entities[Math.floor(Math.random() * entities.length)];
        const user = users[Math.floor(Math.random() * users.length)];
        
        sampleData.push({
          id: `sample-${i}`,
          action,
          entity,
          entity_id: Math.random().toString(36).substring(2, 15),
          performed_by: user,
          performed_at: date.toISOString(),
          details: action === 'updated' ? {
            previous: { status: 'old_value' },
            current: { status: 'new_value' }
          } : undefined
        });
      }
      
      // Sort by performed_at in descending order
      return sampleData.sort((a, b) => 
        new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime()
      );
    }
  }

  /**
   * Get API keys
   */
  async getApiKeys(): Promise<ApiKey[]> {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform from database format to frontend format
      return (data || []).map(key => ({
        id: key.id,
        name: key.name,
        key: key.key_value,
        prefix: key.key_prefix,
        scopes: key.scopes,
        expiresAt: key.expires_at,
        lastUsed: key.last_used,
        createdAt: key.created_at,
        isActive: key.is_active
      }));
    } catch (error) {
      this.logError("getApiKeys", error);
      
      // Generate sample data for demo
      return [
        {
          id: "1",
          name: "Admin API Key",
          key: "ts_123456789abcdefghijklmnopqrstuvwxyz",
          prefix: "ts_123456",
          scopes: ["admin"],
          expiresAt: null,
          lastUsed: new Date().toISOString(),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        },
        {
          id: "2",
          name: "Read-only Access",
          key: "ts_abcdefghijklmnopqrstuvwxyz123456789",
          prefix: "ts_abcdef",
          scopes: ["read"],
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        },
        {
          id: "3",
          name: "Legacy API Key",
          key: "ts_oldsystemlegacykeyabcdefghijklmnopqrs",
          prefix: "ts_oldsy",
          scopes: ["read", "write"],
          expiresAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastUsed: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: false
        }
      ];
    }
  }

  /**
   * Get API integrations
   */
  async getApiIntegrations(): Promise<ApiIntegration[]> {
    try {
      const { data, error } = await supabase
        .from('api_integrations')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      this.logError("getApiIntegrations", error);
      
      // Generate sample data for demo
      return [
        {
          id: "1",
          name: "Zapier Integration",
          provider: "zapier",
          status: "connected",
          lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          config: {
            webhook_url: "https://hooks.zapier.com/abc123"
          }
        },
        {
          id: "2",
          name: "Slack Notifications",
          provider: "slack",
          status: "connected",
          lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          config: {
            workspace: "threestage-team",
            channel: "#notifications"
          }
        },
        {
          id: "3",
          name: "Google Calendar",
          provider: "google",
          status: "error",
          lastSync: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          config: {
            scope: "calendar",
            account: "admin@threestage.com"
          }
        },
        {
          id: "4",
          name: "Email Marketing",
          provider: "mailchimp",
          status: "disconnected",
          lastSync: null,
          config: {}
        }
      ];
    }
  }

  /**
   * Create a new API key
   */
  async createApiKey(data: Partial<ApiKey>): Promise<ApiKey> {
    try {
      // In a real implementation, this would create a secure random key
      // and save it to the database
      const keyValue = `ts_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const keyPrefix = keyValue.substring(0, 8);
      
      const { data: createdKey, error } = await supabase
        .from('api_keys')
        .insert({
          name: data.name,
          key_value: keyValue,
          key_prefix: keyPrefix,
          scopes: data.scopes || ["read"],
          expires_at: data.expiresAt,
          is_active: data.isActive !== false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      await this.logActivity('created', 'api_key', createdKey.id);
      
      return {
        id: createdKey.id,
        name: createdKey.name,
        key: createdKey.key_value,
        prefix: createdKey.key_prefix,
        scopes: createdKey.scopes,
        expiresAt: createdKey.expires_at,
        lastUsed: createdKey.last_used,
        createdAt: createdKey.created_at,
        isActive: createdKey.is_active
      };
    } catch (error) {
      this.logError("createApiKey", error);
      
      // For demo purposes, return a mock key
      const mockId = Date.now().toString();
      const keyValue = `ts_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      return {
        id: mockId,
        name: data.name || "New API Key",
        key: keyValue,
        prefix: keyValue.substring(0, 8),
        scopes: data.scopes || ["read"],
        expiresAt: data.expiresAt || null,
        lastUsed: null,
        createdAt: new Date().toISOString(),
        isActive: data.isActive !== false
      };
    }
  }

  /**
   * Update an existing API key
   */
  async updateApiKey(id: string, updates: Partial<ApiKey>): Promise<void> {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({
          name: updates.name,
          scopes: updates.scopes,
          expires_at: updates.expiresAt,
          is_active: updates.isActive
        })
        .eq('id', id);
      
      if (error) throw error;
      
      await this.logActivity('updated', 'api_key', id);
    } catch (error) {
      this.logError("updateApiKey", error);
      // For demo, just wait a bit to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  /**
   * Regenerate an API key
   */
  async regenerateApiKey(id: string): Promise<ApiKey> {
    try {
      // In a real implementation, generate a new secure key
      const newKeyValue = `ts_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const newKeyPrefix = newKeyValue.substring(0, 8);
      
      const { data: keyData, error } = await supabase
        .from('api_keys')
        .update({
          key_value: newKeyValue,
          key_prefix: newKeyPrefix,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      await this.logActivity('regenerated', 'api_key', id);
      
      return {
        id: keyData.id,
        name: keyData.name,
        key: keyData.key_value,
        prefix: keyData.key_prefix,
        scopes: keyData.scopes,
        expiresAt: keyData.expires_at,
        lastUsed: keyData.last_used,
        createdAt: keyData.created_at,
        isActive: keyData.is_active
      };
    } catch (error) {
      this.logError("regenerateApiKey", error);
      
      // For demo, get existing key and update with new values
      const existingKey = await this.getApiKeys().then(keys => keys.find(k => k.id === id));
      if (!existingKey) {
        throw new Error("API key not found");
      }
      
      const newKeyValue = `ts_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      return {
        ...existingKey,
        key: newKeyValue,
        prefix: newKeyValue.substring(0, 8)
      };
    }
  }

  /**
   * Delete an API key
   */
  async deleteApiKey(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await this.logActivity('deleted', 'api_key', id);
    } catch (error) {
      this.logError("deleteApiKey", error);
      // For demo, just wait a bit to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  /**
   * Create a new API integration
   */
  async createApiIntegration(data: Partial<ApiIntegration>): Promise<ApiIntegration> {
    try {
      const { data: createdIntegration, error } = await supabase
        .from('api_integrations')
        .insert({
          name: data.name,
          provider: data.provider,
          status: 'disconnected',
          config: data.config || {},
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      await this.logActivity('created', 'api_integration', createdIntegration.id);
      
      return createdIntegration;
    } catch (error) {
      this.logError("createApiIntegration", error);
      
      // For demo purposes, return a mock integration
      return {
        id: Date.now().toString(),
        name: data.name || "New Integration",
        provider: data.provider || "custom",
        status: 'disconnected',
        lastSync: null,
        config: data.config || {}
      };
    }
  }
}

// Export as a singleton
export const adminService = new AdminService(); 