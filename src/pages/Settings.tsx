import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Trash2, User, Shield, Lock, Mail, Calendar, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const Settings = () => {
  const { user, loading, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const { error } = await deleteAccount();
    if (error) {
      toast.error('Failed to delete account. Please try again.');
    } else {
      toast.success('Account deleted successfully.');
      navigate('/');
    }
    setIsDeleting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading your settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28 pb-16 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6 text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 ring-4 ring-primary/10 ring-offset-2 ring-offset-background">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-medium">
                  {getInitials(user.user_metadata?.full_name || user.email)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-serif font-medium tracking-tight">
                  {user.user_metadata?.full_name || 'Your Account'}
                </h1>
                <p className="text-muted-foreground mt-1">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-muted/30">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  Profile Information
                </CardTitle>
                <CardDescription>Your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-5">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border/30">
                    <div className="p-2.5 rounded-full bg-background">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
                      <p className="mt-0.5 font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border/30">
                    <div className="p-2.5 rounded-full bg-background">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Member Since</label>
                      <p className="mt-0.5 font-medium">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security Section */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-muted/30">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  Privacy & Security
                </CardTitle>
                <CardDescription>How we protect your data</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Your data stays local</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Your browsing history and tab data never leave your device. Only anonymous usage statistics are synced to provide you with insights.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">End-to-end encrypted</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      All data transfers are encrypted using industry-standard TLS encryption. Your account is protected with secure OAuth authentication.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <a href="/privacy" className="text-xs text-primary hover:underline flex items-center gap-1 transition-colors">
                    Privacy Policy <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="text-border">•</span>
                  <a href="/terms" className="text-xs text-primary hover:underline flex items-center gap-1 transition-colors">
                    Terms of Service <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-card/80 backdrop-blur-sm border-destructive/30 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-destructive/20 bg-destructive/5">
                <CardTitle className="text-destructive flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </div>
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions that affect your account
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">Delete your account</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Permanently remove your account and all associated data
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="shrink-0">
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove all your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? 'Deleting...' : 'Delete Account'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
