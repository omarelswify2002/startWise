import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRocket, FaArrowLeft } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { createStartup, updateStartup, getStartups } from '../../store/slices/startupSlice';
import Swal from 'sweetalert2';

const StartupProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { startups, myStartup: reduxMyStartup } = useSelector((state) => state.startup);

  // Find existing startup profile for current user - check Redux myStartup first, then startups array
  const myStartup = reduxMyStartup || startups?.find(s => s.userId === user?._id);

  const [formData, setFormData] = useState({
    companyName: '',
    tagline: '',
    description: '',
    sector: 'Fintech',
    stage: 'Seed',
    minFunding: '',
    maxFunding: '',
    website: '',
    location: '',
    teamSize: '',
    foundedYear: '',
    linkedin: '',
  });

  // Fetch startups on mount to check if user has existing profile
  useEffect(() => {
    if (user?._id) {
      dispatch(getStartups());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (myStartup) {
      setFormData({
        companyName: myStartup.companyName || '',
        tagline: myStartup.tagline || '',
        description: myStartup.description || '',
        sector: myStartup.sector || 'Fintech',
        stage: myStartup.stage || 'Seed',
        minFunding: myStartup.fundingRequired?.min || '',
        maxFunding: myStartup.fundingRequired?.max || '',
        website: myStartup.website || '',
        location: myStartup.location || '',
        teamSize: myStartup.teamSize || '',
        foundedYear: myStartup.foundedYear || '',
        linkedin: myStartup.socialLinks?.linkedin || '',
      });
    }
  }, [myStartup]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.companyName || !formData.description || !formData.sector || !formData.stage) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields (Company Name, Description, Sector, and Stage)',
      });
      return;
    }

    if (!formData.minFunding || !formData.maxFunding) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please specify both minimum and maximum funding required',
      });
      return;
    }

    const minFund = Number(formData.minFunding);
    const maxFund = Number(formData.maxFunding);

    if (isNaN(minFund) || isNaN(maxFund) || minFund <= 0 || maxFund <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Funding amounts must be valid positive numbers',
      });
      return;
    }

    if (minFund > maxFund) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Minimum funding cannot be greater than maximum funding',
      });
      return;
    }

    if (formData.description.length > 2000) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Description cannot exceed 2000 characters',
      });
      return;
    }

    const profileData = {
      companyName: formData.companyName.trim(),
      tagline: formData.tagline.trim(),
      description: formData.description.trim(),
      sector: formData.sector,
      stage: formData.stage,
      fundingRequired: {
        min: minFund,
        max: maxFund,
        currency: 'USD'
      },
      website: formData.website.trim(),
      location: formData.location.trim(),
      teamSize: formData.teamSize ? Number(formData.teamSize) : undefined,
      foundedYear: formData.foundedYear ? Number(formData.foundedYear) : undefined,
      socialLinks: {
        linkedin: formData.linkedin.trim()
      }
    };

    try {
      if (myStartup) {
        //editttttt-------------------------------------------------------------------------------_id
        await dispatch(updateStartup({ id: myStartup._id, data: profileData })).unwrap();
        console.log('Startup updated:', myStartup._id);
      } else {
        await dispatch(createStartup(profileData)).unwrap();
      }
      Swal.fire({
        icon: 'success',
        title: 'Profile Saved!',
        text: 'Your startup profile has been updated successfully',
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Startup Profile</h1>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                required
                placeholder="Your Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                placeholder="A brief tagline for your startup"
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                required
                placeholder="Describe your startup, what problem you're solving, and your unique value proposition..."
                maxLength={2000}
              />
              <p className="text-sm text-gray-500 mt-1">{formData.description.length}/2000 characters</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sector *</label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                  required
                >
                  <option>Fintech</option>
                  <option>Edtech</option>
                  <option>Healthtech</option>
                  <option>E-commerce</option>
                  <option>SaaS</option>
                  <option>AI/ML</option>
                  <option>Blockchain</option>
                  <option>IoT</option>
                  <option>Cleantech</option>
                  <option>Agritech</option>
                  <option>Foodtech</option>
                  <option>Proptech</option>
                  <option>Logistics</option>
                  <option>Entertainment</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stage *</label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                  required
                >
                  <option>Idea</option>
                  <option>Pre-seed</option>
                  <option>Seed</option>
                  <option>Series A</option>
                  <option>Series B</option>
                  <option>Series C+</option>
                  <option>Growth</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Funding Required ($) *
                </label>
                <input
                  type="number"
                  name="minFunding"
                  value={formData.minFunding}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                  required
                  min="0"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Funding Required ($) *
                </label>
                <input
                  type="number"
                  name="maxFunding"
                  value={formData.maxFunding}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                  required
                  min="0"
                  placeholder="500000"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                <input
                  type="number"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                  min="1"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
                <input
                  type="number"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="2023"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                placeholder="https://yourcompany.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              {myStartup ? 'Update Profile' : 'Create Profile'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default StartupProfile;

