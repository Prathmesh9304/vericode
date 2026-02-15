import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, ArrowLeft, Loader2, User, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CropModal from '../Components/CropModal';
import { getImageUrl } from '../../utils/imageUtils';

const Settings = () => {
  const { user, login } = useAuth(); // login is effectively 'updateUser'
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: ''
  });
  
  const [profileImage, setProfileImage] = useState(null); // URL or Base64 for preview
  const [imageFile, setImageFile] = useState(null); // Actual file to upload
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || ''
      });
      setProfileImage(user.profileImage || null);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setTempImageSrc(reader.result);
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
      // Clear input so same file selection triggers change again if needed
      e.target.value = '';
    }
  };

  const handleCropComplete = async (croppedImageBlob) => {
    // croppedImageBlob is a Data URL (base64)
    setProfileImage(croppedImageBlob);
    setShowCropModal(false);

    // Convert Data URL to Blob/File for upload
    const res = await fetch(croppedImageBlob);
    const blob = await res.blob();
    const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
    setImageFile(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImageFile(null); // Clear pending upload
    // Logic to mark for deletion is handled inhandleSubmit if imageFile is null and profileImage is null
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('bio', formData.bio);
      
      if (imageFile) {
        data.append('profileImage', imageFile);
      } else if (!profileImage && user.profileImage) {
         // User removed the image
         data.append('removeProfileImage', 'true');
      }

      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Content-Type is set automatically by browser for FormData
        },
        body: data
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update context
        login(updatedUser, token); // Reuse login to update user state
        // navigate('/chat'); // Optional: redirect back
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 justify-center flex"> 
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
             onClick={() => navigate('/chat')}
             className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Profile Image Section */}
          <div className="flex flex-col items-center gap-4 py-6 border-b border-white/10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 bg-[#1a1a1a] flex items-center justify-center">
                {profileImage ? (
                  <img src={getImageUrl(profileImage)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-gray-500" />
                )}
              </div>
              
              <label className="absolute bottom-0 right-0 p-2 bg-emerald-600 rounded-full hover:bg-emerald-500 cursor-pointer transition-colors shadow-lg">
                <Camera size={18} className="text-white" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            <div className="flex gap-3">
               <span className="text-sm text-gray-400">Allowed: JPG, PNG, max 5MB</span>
               {profileImage && (
                  <button 
                    type="button" 
                    onClick={handleRemoveImage}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded"
                  >
                     <Trash2 size={12} /> Remove
                  </button>
               )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">Email Address (Read Only)</label>
               <input
                 type="email"
                 value={formData.email}
                 readOnly
                 className="w-full bg-black/20 border border-white/5 rounded-lg p-3 text-gray-500 cursor-not-allowed"
               />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                placeholder="Tell us a little about yourself..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              Save Changes
            </button>
          </div>
        </form>

        {/* Crop Modal */}
        <CropModal
          open={showCropModal}
          imageSrc={tempImageSrc}
          onCancel={() => setShowCropModal(false)}
          onCropComplete={handleCropComplete}
        />
      </div>
    </div>
  );
};

export default Settings;
