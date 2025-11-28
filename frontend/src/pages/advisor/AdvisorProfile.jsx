import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createAdvisor, updateAdvisor } from '../../store/slices/advisorSlice';
import { FaRocket, FaArrowLeft, FaSave } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AdvisorProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // Get all advisors and derive the current user's advisor profile (same approach as StartupProfile)
  const { advisors, isLoading } = useSelector((state) => state.advisor);
  const myAdvisor = advisors?.find((a) => a.userId === user?._id) || null;

  const [formData, setFormData] = useState({
    advisorName: '',
    title: '',
    specializations: [],
    industries: [],
    yearsOfExperience: '',
    hourlyRate: '',
    availability: 'Available',
    bio: '',
    location: '',
    linkedin: '',
    website: '',
  });

  const specializationOptions = [
    'Growth Strategy',
    'Finance & Fundraising',
    'Marketing & Sales',
    'Product Development',
    'Technology & Engineering',
    'Operations',
    'Legal & Compliance',
    'HR & Talent',
    'Business Development',
    'International Expansion',
    'Other'
  ];

  const industryOptions = [
    'Fintech',
    'Edtech',
    'Healthtech',
    'E-commerce',
    'SaaS',
    'AI/ML',
    'Blockchain',
    'IoT',
    'Cleantech',
    'Agritech',
    'Foodtech',
    'Proptech',
    'Logistics',
    'Entertainment',
    'Other'
  ];

  const availabilityOptions = ['Available', 'Limited', 'Not Available'];

  useEffect(() => {
    if (myAdvisor) {
      setFormData({
        advisorName: myAdvisor.advisorName || '',
        title: myAdvisor.title || '',
        specializations: myAdvisor.specializations || [],
        industries: myAdvisor.industries || [],
        yearsOfExperience: myAdvisor.yearsOfExperience || '',
        hourlyRate: myAdvisor.hourlyRate?.amount || '',
        availability: myAdvisor.availability || 'Available',
        bio: myAdvisor.bio || '',
        location: myAdvisor.location || '',
        linkedin: myAdvisor.socialLinks?.linkedin || '',
        website: myAdvisor.website || '',
      });
    }
  }, [myAdvisor]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMultiSelect = (field, value) => {
    const current = formData[field];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter((item) => item !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.advisorName || !formData.bio) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields (Advisor Name and Bio)',
      });
      return;
    }

    if (!formData.yearsOfExperience) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please specify your years of experience',
      });
      return;
    }

    const years = Number(formData.yearsOfExperience);
    if (isNaN(years) || years < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Years of experience must be a valid positive number',
      });
      return;
    }

    if (formData.bio.length > 1000) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Bio cannot exceed 1000 characters',
      });
      return;
    }

    const hourlyRateAmount = formData.hourlyRate ? Number(formData.hourlyRate) : 0;
    if (isNaN(hourlyRateAmount) || hourlyRateAmount < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Hourly rate must be a valid positive number',
      });
      return;
    }

    const profileData = {
      advisorName: formData.advisorName.trim(),
      title: formData.title.trim(),
      specializations: formData.specializations,
      industries: formData.industries,
      yearsOfExperience: years,
      hourlyRate: {
        amount: hourlyRateAmount,
        currency: 'USD'
      },
      availability: formData.availability,
      bio: formData.bio.trim(),
      location: formData.location.trim(),
      socialLinks: {
        linkedin: formData.linkedin.trim()
      },
      website: formData.website.trim(),
    };

    try {
      if (myAdvisor) {
        await dispatch(updateAdvisor({ id: myAdvisor._id, data: profileData })).unwrap();
      } else {
        await dispatch(createAdvisor(profileData)).unwrap();
      }
      Swal.fire({
        icon: 'success',
        title: 'Profile Saved!',
        text: 'Your advisor profile has been updated successfully',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile save error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || error || 'Failed to save profile. Please check all required fields.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FaRocket className="text-3xl text-purple-600" />
              <span className="ml-2 text-2xl font-bold text-gradient">StartWise</span>
            </div>
            <Link to="/dashboard" className="text-gray-700 hover:text-purple-600 flex items-center">
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Advisor Profile</h1>
        <p className="text-gray-600 mb-8">Complete your profile to get matched with startups seeking your expertise</p>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Advisor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="advisorName"
                value={formData.advisorName}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                required
                placeholder="John Doe"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Senior Product Manager, Ex-Google"
              />
            </div>

            {/* Specializations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Specializations
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {specializationOptions.map((spec) => (
                  <label
                    key={spec}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      formData.specializations.includes(spec)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.specializations.includes(spec)}
                      onChange={() => handleMultiSelect('specializations', spec)}
                      className="sr-only"
                    />
                    <span
                      className={`text-sm font-medium ${
                        formData.specializations.includes(spec) ? 'text-purple-600' : 'text-gray-700'
                      }`}
                    >
                      {spec}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio *
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={onChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                required
                placeholder="Describe your background, expertise, and how you can help startups..."
                maxLength={1000}
              />
            </div>

            {/* Industries */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Industry Experience *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {industryOptions.map((industry) => (
                  <label
                    key={industry}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      formData.industries.includes(industry)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.industries.includes(industry)}
                      onChange={() => handleMultiSelect('industries', industry)}
                      className="sr-only"
                    />
                    <span
                      className={`text-sm font-medium ${
                        formData.industries.includes(industry) ? 'text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {industry}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience & Rate */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                  placeholder="10"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate ($) *
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                  placeholder="150"
                  min="0"
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability *
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                required
              >
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="San Francisco, CA"
              />
            </div>

            {/* LinkedIn & Website */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              <FaSave className="mr-2" />
              {isLoading ? 'Saving...' : myAdvisor ? 'Update Profile' : 'Save Profile'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdvisorProfile;
