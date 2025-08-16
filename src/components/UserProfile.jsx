import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { FaUserCircle } from "react-icons/fa";
import EditProfileModal from "../components/EditProfileModal"; // import modal

const UserProfile = () => {
  const { userProfile, updateUserProfile } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (updatedData) => {
    updateUserProfile(updatedData); // calls your context API
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Top Banner */}
        <div className="bg-[#663333] h-32 relative">
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 md:left-10 md:translate-x-0">
            {userProfile?.profilePicture ? (
              <img
                src={userProfile.profilePicture}
                alt={`${userProfile?.firstName} ${userProfile?.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <FaUserCircle className="text-gray-300 w-24 h-24 border-4 border-white rounded-full shadow-lg" />
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 pb-10 px-6 md:px-10 flex flex-col md:flex-row gap-10">
          {/* Left Column */}
          <div className="md:w-1/3 text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#663333] capitalize">
              {userProfile?.firstName} {userProfile?.lastName}
            </h2>
            <p className="text-gray-500 mt-1 capitalize">{userProfile?.role || "User"}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 w-full md:w-auto bg-[#663333] hover:bg-[#4d2626] text-white py-2 px-6 rounded-lg font-medium transition shadow-md hover:shadow-lg"
            >
              Edit Profile
            </button>
          </div>

          {/* Right Column */}
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ProfileField label="Email" value={userProfile?.email} />
            <ProfileField label="Phone" value={userProfile?.phone || "Not provided"} />
            <ProfileField label="Street Address" value={userProfile?.address.street || "Not provided"} />
            <ProfileField label="City" value={userProfile?.address.city || "Not provided"} />
            <ProfileField label="State" value={userProfile?.address.state || "Not provided"} />
            <ProfileField
              label="Joined"
              value={
                userProfile?.dateJoined
                  ? new Date(userProfile.dateJoined).toLocaleDateString()
                  : "—"
              }
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={userProfile}
        onSave={handleSave}
      />
    </div>
  );
};

// Reusable profile field component
const ProfileField = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

export default UserProfile;
