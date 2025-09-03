import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Users, Calendar, MapPin, Clock, ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const MyOpportunitiesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({}); // opportunityId => boolean
  const [applicantsByOpp, setApplicantsByOpp] = useState({}); // opportunityId => applicants[]

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMyOpportunities();
    }
  }, [isAuthenticated, user]);

  const fetchMyOpportunities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/opportunities/my', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch opportunities');
      }

      const data = await response.json();
      setOpportunities(data.opportunities || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch opportunities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (opportunityId) => {
    navigate(`/edit-opportunity/${opportunityId}`);
  };

  const handleDelete = async (opportunityId) => {
    if (!window.confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete opportunity');
      }

      // Remove the deleted opportunity from the list
      setOpportunities(prev => prev.filter(opp => opp._id !== opportunityId));
      alert('Opportunity deleted successfully!');
    } catch (err) {
      alert('Failed to delete opportunity: ' + err.message);
    }
  };

  const handleView = (opportunityId) => {
    navigate(`/opportunities/${opportunityId}`);
  };

  const toggleApplicants = async (opportunityId) => {
    setExpanded(prev => ({ ...prev, [opportunityId]: !prev[opportunityId] }));
    // Load applicants on first expand
    if (!applicantsByOpp[opportunityId]) {
      try {
        const res = await fetch(`/api/opportunities/${opportunityId}/applicants`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) throw new Error('Failed to load applicants');
        const data = await res.json();
        setApplicantsByOpp(prev => ({ ...prev, [opportunityId]: data.applicants || [] }));
      } catch (e) {
        alert(e.message || 'Failed to load applicants');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your opportunities.</p>
          <button
            onClick={() => navigate('/signin')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (user && user.role !== 'organization') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only organizations can view their posted opportunities.</p>
          <button
            onClick={() => navigate('/opportunities')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Opportunities
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner size="xl" className="py-20" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchMyOpportunities} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Opportunities</h1>
          <p className="text-gray-600">Manage the volunteer opportunities you've posted</p>
        </div>

        {/* Create New Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/create-opportunity')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Create New Opportunity
          </button>
        </div>

        {/* Content */}
        {opportunities.length === 0 ? (
          <EmptyState 
            type="opportunities" 
            onAction={() => navigate('/create-opportunity')}
          />
        ) : (
          <div className="space-y-6">
            {opportunities.map((opportunity) => (
              <div key={opportunity._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {opportunity.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">
                        {opportunity.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleView(opportunity._id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(opportunity._id)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Opportunity"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(opportunity._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Opportunity"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{opportunity.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{opportunity.timeCommitment}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{opportunity.volunteersNeeded} volunteers needed</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {formatDate(opportunity.startDate)} - {formatDate(opportunity.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Status and Tags */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        opportunity.status === 'active' 
                          ? 'bg-green-100 text-green-700'
                          : opportunity.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {opportunity.status}
                      </span>
                      
                      {opportunity.tags && opportunity.tags.length > 0 && (
                        <div className="flex space-x-1">
                          {opportunity.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {opportunity.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              +{opportunity.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      Posted {formatDate(opportunity.createdAt)}
                    </div>
                  </div>

                  {/* Applicants Section */}
                  <div className="mt-4 border-t pt-4">
                    <button
                      onClick={() => toggleApplicants(opportunity._id)}
                      className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      {expanded[opportunity._id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {expanded[opportunity._id] ? 'Hide Applicants' : 'Show Applicants'}
                    </button>

                    {expanded[opportunity._id] && (
                      <div className="mt-3 space-y-3">
                        {(applicantsByOpp[opportunity._id] || []).length === 0 ? (
                          <p className="text-sm text-gray-600">No applicants yet.</p>
                        ) : (
                          (applicantsByOpp[opportunity._id] || []).map(vol => (
                            <div key={vol._id} className="p-3 border rounded-lg">
                              <div className="font-medium">{vol.name}</div>
                              <div className="text-sm text-gray-700 inline-flex items-center gap-2"><Mail className="h-4 w-4" /> {vol.email}</div>
                              {vol.phone && (
                                <div className="text-sm text-gray-700 inline-flex items-center gap-2"><Phone className="h-4 w-4" /> {vol.phone}</div>
                              )}
                              {vol.location && (
                                <div className="text-sm text-gray-700">Location: {vol.location}</div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOpportunitiesPage;
