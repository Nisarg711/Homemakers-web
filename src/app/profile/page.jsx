import Navbar from '@/components/Navbar';
import { User, Mail, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6">
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6 border-t border-gray-200 pt-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                username_placeholder
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-900">
                <Mail size={18} className="text-gray-400" />
                user@example.com
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                Individual
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-900">
                <MapPin size={18} className="text-gray-400" />
                All India
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
              Edit Profile
            </button>
            <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition">
              Change Password
            </button>
          </div>

          {/* Logout */}
          <button className="w-full mt-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg transition border border-red-200">
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
