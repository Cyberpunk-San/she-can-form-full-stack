import React, { useState } from 'react';
import api from '../services/api';
import { Submission } from '../types';
import toast from 'react-hot-toast';

interface SubmissionsTableProps {
  submissions: Submission[];
  onUpdate: () => void;
}

const SubmissionsTable: React.FC<SubmissionsTableProps> = ({ submissions, onUpdate }) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [filter, setFilter] = useState<'pending' | 'reviewed' | 'discarded'>('pending');

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/submissions/${id}`, { status });
      toast.success(`Letter status updated to ${status}`);
      onUpdate();
      if (selectedSubmission?._id === id) {
        setSelectedSubmission(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getFieldValue = (formData: Record<string, any>, possibleKeys: string[]): string => {
    for (const key of possibleKeys) {
      if (formData[key] !== undefined) return String(formData[key]);
      const lowerKey = key.toLowerCase();
      const found = Object.entries(formData).find(([k]) => k.toLowerCase() === lowerKey);
      if (found) return String(found[1]);
    }
    return '';
  };

  const filteredSubmissions = submissions.filter(sub => {
    const status = sub.status || 'pending';
    if (filter === 'pending') {
      return status !== 'reviewed' && status !== 'discarded';
    }
    return status === filter;
  });

  return (
    <div className="space-y-8">
      {/* Header, Summary and Filter Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-dashed border-[#1e201e]/30 pb-6 gap-4">
        <div>
          <h2 className="font-serif-indie text-3xl font-bold text-[#1e201e]">
            {filter === 'pending' ? 'Inbox' : filter === 'reviewed' ? 'Approved Letters' : 'Discarded Letters'}
          </h2>
          <p className="font-mono-indie text-xs uppercase tracking-wider text-neutral-500 mt-1">
            Total count: {filteredSubmissions.length}
          </p>
        </div>

        {/* Filter Sub-Tabs */}
        <div className="flex border border-[#1e201e] p-1 bg-white">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 font-mono-indie text-xs uppercase tracking-wider font-bold transition-all ${
              filter === 'pending'
                ? 'bg-[#1e201e] text-white'
                : 'bg-transparent text-neutral-500 hover:text-[#1e201e]'
            }`}
          >
            Inbox ({submissions.filter(s => (s.status || 'pending') !== 'reviewed' && (s.status || 'pending') !== 'discarded').length})
          </button>
          <button
            onClick={() => setFilter('reviewed')}
            className={`px-4 py-2 font-mono-indie text-xs uppercase tracking-wider font-bold transition-all ${
              filter === 'reviewed'
                ? 'bg-[#1e201e] text-white'
                : 'bg-transparent text-neutral-500 hover:text-[#1e201e]'
            }`}
          >
            Approved ({submissions.filter(s => s.status === 'reviewed').length})
          </button>
          <button
            onClick={() => setFilter('discarded')}
            className={`px-4 py-2 font-mono-indie text-xs uppercase tracking-wider font-bold transition-all ${
              filter === 'discarded'
                ? 'bg-[#1e201e] text-white'
                : 'bg-transparent text-neutral-500 hover:text-[#1e201e]'
            }`}
          >
            Discarded ({submissions.filter(s => s.status === 'discarded').length})
          </button>
        </div>
      </div>

      {/* Grid of Envelopes */}
      {filteredSubmissions.length === 0 ? (
        <div className="border-2 border-dashed border-[#1e201e]/40 p-12 text-center bg-white/50">
          <p className="font-serif-indie italic text-lg text-neutral-500">
            {filter === 'pending' 
              ? 'No unopened letters in the inbox' 
              : filter === 'reviewed' 
                ? 'No approved letters in the archive' 
                : 'No discarded letters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSubmissions.map((sub) => {
            const name = getFieldValue(sub.formData, ['name', 'Name', 'fullName']) || 'Anonymous';
            const email = getFieldValue(sub.formData, ['email', 'Email']) || 'No Email';
            const currentStatus = sub.status || 'pending';

            return (
              <div
                key={sub._id}
                onClick={() => setSelectedSubmission(sub)}
                className={`group relative bg-white border-2 border-[#1e201e] p-6 cursor-pointer indie-shadow transition-all duration-200 hover:-translate-y-1 hover:indie-shadow-lg flex flex-col justify-between min-h-[220px] ${
                  currentStatus !== 'pending' ? 'opacity-70 bg-[#faf9f6]' : ''
                }`}
              >
                {/* Envelope details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    {/* Postmark stamp simulation */}
                    <div className="border border-dashed border-[#1e201e]/40 px-2.5 py-1 text-[10px] font-mono-indie text-neutral-500 uppercase tracking-widest bg-[#faf9f6]">
                      {new Date(sub.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                    <span
                      className={`font-mono-indie text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[#1e201e] ${
                        currentStatus === 'reviewed' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : currentStatus === 'discarded'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-[#f4f1ea] text-[#1e201e]'
                      }`}
                    >
                      {currentStatus === 'reviewed' ? 'approved' : currentStatus}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="font-serif-indie text-xs italic text-neutral-400">From</p>
                    <h3 className="font-serif-indie text-xl font-bold text-[#1e201e] truncate group-hover:underline">
                      {name}
                    </h3>
                    <p className="font-mono-indie text-xs text-neutral-600 truncate">{email}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center border-t border-dashed border-[#1e201e]/30 pt-4">
                  <span className="font-mono-indie text-[10px] uppercase tracking-widest text-[#1e201e] font-bold group-hover:underline">
                    Open Letter →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Letter Modal (Open style) */}
      {selectedSubmission && (() => {
        const name = getFieldValue(selectedSubmission.formData, ['name', 'Name', 'fullName']) || 'Anonymous';
        const email = getFieldValue(selectedSubmission.formData, ['email', 'Email']) || 'No Email';
        const message = getFieldValue(selectedSubmission.formData, ['message', 'Message', 'content']) || 'No message content provided.';
        const currentStatus = selectedSubmission.status || 'pending';

        return (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="max-w-2xl w-full bg-[#f4f1ea] border-2 border-[#1e201e] p-1.5 indie-shadow-lg animate-slide-up">
              {/* Outer Envelope Wrapper */}
              <div className="border border-dashed border-[#1e201e]/50 bg-white p-6 md:p-10 relative">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="absolute top-4 right-4 font-mono-indie text-xs tracking-wider uppercase border border-[#1e201e] hover:bg-[#1e201e] hover:text-white px-3 py-1 transition-all"
                >
                  Close
                </button>

                {/* Letter Header */}
                <div className="border-b border-[#1e201e]/20 pb-4 mb-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                    <p className="font-mono-indie text-xs uppercase tracking-wider text-neutral-500">
                      Postmark: {new Date(selectedSubmission.submittedAt).toLocaleString()}
                    </p>
                    <span className="font-mono-indie text-xs uppercase tracking-widest text-neutral-600">
                      Status: {currentStatus === 'reviewed' ? 'approved' : currentStatus}
                    </span>
                  </div>
                  <h2 className="font-serif-indie text-2xl font-bold text-[#1e201e] mt-2">
                    Sender: {name}
                  </h2>
                  <p className="font-mono-indie text-sm text-neutral-600">{email}</p>
                </div>

                {/* Lined Paper sheet styling */}
                <div
                  className="p-6 md:p-8 bg-[#fbfbf9] border border-[#1e201e]/30 indie-shadow-sm h-[224px] overflow-y-auto"
                  style={{
                    backgroundImage: 'linear-gradient(#e1ded6 1px, transparent 1px)',
                    backgroundSize: '100% 2rem',
                    lineHeight: '2rem'
                  }}
                >
                  <div className="font-serif-indie text-lg text-neutral-800 whitespace-pre-line leading-[2rem]">
                    {message}
                  </div>

                  {/* Other fields if they exist */}
                  {Object.entries(selectedSubmission.formData).map(([key, value]) => {
                    const lKey = key.toLowerCase();
                    if (['name', 'email', 'message'].includes(lKey)) return null;
                    return (
                      <div key={key} className="mt-4 font-mono-indie text-xs leading-5 border-t border-dashed border-[#1e201e]/20 pt-2 text-neutral-600">
                        <span className="font-bold">{key}:</span> {String(value)}
                      </div>
                    );
                  })}
                </div>

                {/* Letter Footer Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-dashed border-[#1e201e]/30 pt-6 w-full">
                  <div className="flex flex-wrap gap-3">
                    {currentStatus !== 'reviewed' && (
                      <button
                        onClick={() => updateStatus(selectedSubmission._id, 'reviewed')}
                        className="bg-green-700 hover:bg-green-800 text-white font-mono-indie text-xs tracking-widest uppercase font-bold px-5 py-2.5 border-2 border-green-800 transition-all duration-200 indie-shadow-sm"
                      >
                        Approve & Publish
                      </button>
                    )}
                    
                    {currentStatus !== 'discarded' && (
                      <button
                        onClick={() => updateStatus(selectedSubmission._id, 'discarded')}
                        className="bg-red-700 hover:bg-red-800 text-white font-mono-indie text-xs tracking-widest uppercase font-bold px-5 py-2.5 border-2 border-red-800 transition-all duration-200 indie-shadow-sm"
                      >
                        Discard
                      </button>
                    )}

                    {currentStatus !== 'pending' && (
                      <button
                        onClick={() => updateStatus(selectedSubmission._id, 'pending')}
                        className="bg-white hover:bg-neutral-100 text-neutral-700 font-mono-indie text-xs tracking-widest uppercase font-bold px-5 py-2.5 border-2 border-indie-dark transition-all duration-200 indie-shadow-sm"
                      >
                        Return to Inbox
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="font-mono-indie text-xs tracking-wider uppercase text-neutral-500 hover:text-neutral-800 self-end sm:self-center"
                  >
                    Back to Inbox
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default SubmissionsTable;