import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createInvestor, updateInvestor } from '../../store/slices/investorSlice';
import { FaRocket, FaArrowLeft, FaSave } from 'react-icons/fa';
import Swal from 'sweetalert2';

const InvestorProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // Get all investors and derive the current user's investor profile (like StartupProfile does)
  const { investors, isLoading } = useSelector((state) => state.investor);
  const myInvestor = investors?.find((i) => i.userId === user?._id) || null;

  const [formData, setFormData] = useState({
    investorName: '',
    fundName: '',
    investorType: 'Angel Investor',
    bio: '',
    preferredStages: [],
    sectors: [],
    minInvestment: '',
    maxInvestment: '',
    geographicFocus: [],
    location: '',
    website: '',
    linkedin: '',
  });

  const stages = ['Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth'];
  const sectorOptions = ['Fintech', 'Edtech', 'Healthtech', 'E-commerce', 'SaaS', 'AI/ML', 'Blockchain', 'IoT', 'Cleantech', 'Agritech', 'Foodtech', 'Proptech', 'Logistics', 'Entertainment', 'Other'];
  const investorTypes = ['Angel Investor', 'Venture Capital', 'Private Equity', 'Corporate VC', 'Family Office', 'Accelerator', 'Other'];
  const regions = ['North America', 'Europe', 'Asia', 'Latin America', 'Middle East', 'Africa', 'Global'];

  useEffect(() => {
    if (myInvestor) {
      setFormData({
        investorName: myInvestor.investorName || '',
        fundName: myInvestor.fundName || '',
        investorType: myInvestor.investorType || 'Angel Investor',
        bio: myInvestor.bio || '',
        preferredStages: myInvestor.preferredStages || [],
        sectors: myInvestor.sectors || [],
        minInvestment: myInvestor.investmentRange?.min || '',
        maxInvestment: myInvestor.investmentRange?.max || '',
        geographicFocus: myInvestor.geographicFocus || [],
        location: myInvestor.location || '',
        website: myInvestor.website || '',
        linkedin: myInvestor.socialLinks?.linkedin || '',
      });
    }
  }, [myInvestor]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMultiSelect = (field, value) => {
    const current = formData[field];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter(item => item !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.investorName || !formData.investorType) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields (Investor Name and Type)',
      });
      return;
    }

    if (!formData.minInvestment || !formData.maxInvestment) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please specify both minimum and maximum investment amounts',
      });
      return;
    }

    const minInv = Number(formData.minInvestment);
    const maxInv = Number(formData.maxInvestment);

    if (isNaN(minInv) || isNaN(maxInv) || minInv <= 0 || maxInv <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Investment amounts must be valid positive numbers',
      });
      return;
    }

    if (minInv > maxInv) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Minimum investment cannot be greater than maximum investment',
      });
      return;
    }

    const profileData = {
      investorName: formData.investorName.trim(),
      fundName: formData.fundName.trim(),
      investorType: formData.investorType,
      bio: formData.bio.trim(),
      preferredStages: formData.preferredStages,
      sectors: formData.sectors,
      investmentRange: {
        min: minInv,
        max: maxInv,
        currency: 'USD'
      },
      geographicFocus: formData.geographicFocus,
      location: formData.location.trim(),
      website: formData.website.trim(),
      socialLinks: {
        linkedin: formData.linkedin.trim()
      }
    };

    try {
      if (myInvestor) {
        await dispatch(updateInvestor({ id: myInvestor._id, data: profileData })).unwrap();
      } else {
        await dispatch(createInvestor(profileData)).unwrap();
      }
      Swal.fire({
        icon: 'success',
        title: 'Profile Saved!',
        text: 'Your investor profile has been updated successfully',
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Investor Profile</h1>
        <p className="text-gray-600 mb-8">Complete your profile to get matched with promising startups</p>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Investor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="investorName"
                value={formData.investorName}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                required
                placeholder="John Doe"
              />
            </div>

            {/* Fund Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fund/Organization Name
              </label>
              <input
                type="text"
                name="fundName"
                value={formData.fundName}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Acme Ventures"
              />
            </div>

            {/* Investor Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investor Type *
              </label>
              <select
                name="investorType"
                value={formData.investorType}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                required
              >
                {investorTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Thesis/Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={onChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Describe your investment focus, philosophy, and what you look for in startups..."
                maxLength={1000}
              />
            </div>

            {/* Preferred Stages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Investment Stages
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stages.map((stage) => (
                  <label
                    key={stage}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      formData.preferredStages.includes(stage)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.preferredStages.includes(stage)}
                      onChange={() => handleMultiSelect('preferredStages', stage)}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${formData.preferredStages.includes(stage) ? 'text-purple-600' : 'text-gray-700'}`}>
                      {stage}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sectors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Sectors *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sectorOptions.map((sector) => (
                  <label
                    key={sector}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      formData.sectors.includes(sector)
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.sectors.includes(sector)}
                      onChange={() => handleMultiSelect('sectors', sector)}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${formData.sectors.includes(sector) ? 'text-green-600' : 'text-gray-700'}`}>
                      {sector}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Investment Range */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Investment ($) *
                </label>
                <input
                  type="number"
                  name="minInvestment"
                  value={formData.minInvestment}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Investment ($) *
                </label>
                <input
                  type="number"
                  name="maxInvestment"
                  value={formData.maxInvestment}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                  placeholder="5000000"
                />
              </div>
            </div>

            {/* Geographic Focus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Geographic Focus
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {regions.map((region) => (
                  <label
                    key={region}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      formData.geographicFocus.includes(region)
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.geographicFocus.includes(region)}
                      onChange={() => handleMultiSelect('geographicFocus', region)}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${formData.geographicFocus.includes(region) ? 'text-green-600' : 'text-gray-700'}`}>
                      {region}
                    </span>
                  </label>
                ))}
              </div>
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

            {/* Website & LinkedIn */}
            <div className="grid md:grid-cols-2 gap-6">
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
                  placeholder="https://yourfirm.com"
                />
              </div>

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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              <FaSave className="mr-2" />
              {isLoading ? 'Saving...' : myInvestor ? 'Update Profile' : 'Save Profile'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default InvestorProfile;
