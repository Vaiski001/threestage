
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const ProfileSection = () => {
  const { profile } = useAuth();
  
  return (
    <Container size="full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Profile Settings</h1>
          <p className="text-muted-foreground">Update your account information and preferences</p>
        </div>
        <Button variant="outline">Save Changes</Button>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-8">
        <h3 className="text-xl font-medium mb-4">Your Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input 
              type="text" 
              className="w-full p-2 rounded-md border border-input" 
              value={profile?.name || ''}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-2 rounded-md border border-input" 
              value={profile?.email || ''}
              readOnly
            />
          </div>
        </div>
      </div>
    </Container>
  );
};
