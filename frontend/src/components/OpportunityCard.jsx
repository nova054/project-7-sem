import React from 'react';
import { MapPin, Clock, Users, Calendar, Check } from 'lucide-react';

const OpportunityCard = ({ opportunity, onApply, hasApplied = false, isApplying = false, score }) => {
  const {
    title,
    organization,
    location,
    description,
    requirements,
    timeCommitment,
    startDate,
    endDate,
    volunteersNeeded,
    tags,
    image
  } = opportunity;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users className="h-16 w-16 text-white opacity-50" />
          </div>
        )}
        {/* Score badge (only in recommended view when score provided) */}
        {typeof score === 'number' && (
          <div className="absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-semibold bg-black/70 text-white">
            {score.toFixed(2)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-indigo-600 font-medium">
            {typeof organization === 'object' ? organization.name : organization}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>

        {/* Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>{timeCommitment}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>{volunteersNeeded} volunteers needed</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              {formatDate(startDate)} - {formatDate(endDate)}
            </span>
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onApply(opportunity._id)}
          disabled={hasApplied || isApplying}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2 ${
            hasApplied
              ? 'bg-green-600 text-white cursor-not-allowed'
              : isApplying
              ? 'bg-indigo-400 text-white cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {hasApplied ? (
            <>
              <Check className="h-4 w-4" />
              Applied
            </>
          ) : isApplying ? (
            'Applying...'
          ) : (
            'Apply Now'
          )}
        </button>
      </div>
    </div>
  );
};

export default OpportunityCard;