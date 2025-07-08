// src/pages/EditProfile.jsx
import { UserProfile } from "@clerk/clerk-react";

const EditProfile = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Edit Profile
      </h1>
      <UserProfile path="/edit-profile" routing="path" />
    </div>
  );
};

export default EditProfile;
