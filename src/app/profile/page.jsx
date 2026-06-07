import Navbar from '@/components/Navbar';
import { User, Mail, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link href="/dashboard" className="flex items-center gap-2 text-accent-light hover:text-accent-primary font-medium mb-6">
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        {/* Profile Card */}
        <div className="bg-dark-bg-secondary rounded-lg shadow-dark-lg border border-dark-border p-8">
          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-dark-text mb-2">User Profile</h1>
              <p className="text-dark-text-secondary">Manage your account information</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6 border-t border-dark-border pt-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Username</label>
              <div className="p-3 bg-dark-bg-primary rounded-lg text-dark-text border border-dark-border">
                username_placeholder
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Email Address</label>
              <div className="flex items-center gap-3 p-3 bg-dark-bg-primary rounded-lg text-dark-text border border-dark-border">
                <Mail size={18} className="text-dark-text-muted" />
                user@example.com
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Account Type</label>
              <div className="p-3 bg-dark-bg-primary rounded-lg text-dark-text border border-dark-border">
                Individual
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Location</label>
              <div className="flex items-center gap-3 p-3 bg-dark-bg-primary rounded-lg text-dark-text border border-dark-border">
                <MapPin size={18} className="text-dark-text-muted" />
                All India
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-dark-border flex gap-4">
            <button className="flex-1 bg-accent-primary hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-lg transition shadow-dark-md">
              Edit Profile
            </button>
            <button className="flex-1 bg-dark-bg-tertiary hover:bg-dark-bg-hover text-dark-text font-semibold py-2 px-4 rounded-lg transition border border-dark-border">
              Change Password
            </button>
          </div>

          {/* Logout */}
          <button className="w-full mt-4 bg-red-950/30 hover:bg-red-950/50 text-red-400 hover:text-red-300 font-semibold py-2 px-4 rounded-lg transition border border-red-900/50">
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
