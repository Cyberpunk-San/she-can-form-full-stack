import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import FieldManager from './FieldManager';
import SubmissionsTable from './SubmissionsTable';
import { FormField, Submission } from '../types';

interface AdminPanelProps {
  onBackToForm: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToForm }) => {
  const { logout } = useAuth();
  const [fields, setFields] = useState<FormField[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeTab, setActiveTab] = useState<'submissions' | 'fields'>('submissions');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchFields(), fetchSubmissions()]);
  };

  const fetchFields = async () => {
    try {
      const response = await api.get('/form-fields/all');
      setFields(response.data);
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/submissions');
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleLogout = () => {
    logout();
    onBackToForm();
  };

  return (
    <div className="min-h-screen bg-indie-bg text-indie-dark flex flex-col relative overflow-x-hidden">
      {/* Two-color mid-century modern abstract art background */}
      {/* Left side composition */}
      <div className="absolute left-0 bottom-0 w-[240px] sm:w-[320px] h-[450px] bg-[#ebd3b2]/25 rounded-t-full pointer-events-none z-0" />
      <div className="absolute left-16 sm:left-24 bottom-24 w-[160px] sm:w-[200px] h-[160px] sm:h-[200px] bg-[#d47345]/8 rounded-full pointer-events-none z-0" />
      <div className="absolute left-[200px] sm:left-[280px] bottom-[280px] w-5 h-5 rounded-full border-2 border-indie-terracotta/30 pointer-events-none z-0" />
      <div className="absolute left-[25%] bottom-[12%] w-[200px] h-[100px] border-2 border-[#ebd3b2]/30 rounded-[50%] transform rotate-[15deg] pointer-events-none z-0 hidden md:block" />

      {/* Right side composition */}
      <div className="absolute right-0 top-[12%] w-[160px] sm:w-[220px] h-[340px] bg-[#ebd3b2]/20 rounded-l-full pointer-events-none z-0" />
      <div className="absolute right-12 top-[18%] w-[90px] h-[90px] rounded-full bg-[#d47345]/8 pointer-events-none z-0" />
      <div className="absolute right-[12%] top-[38%] w-[260px] h-[130px] border-2 border-[#935338]/12 rounded-[50%] transform rotate-[-25deg] pointer-events-none z-0 hidden md:block" />

      {/* Bottom right composition */}
      <div className="absolute right-[-5%] bottom-[-5%] w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full bg-[#ebd3b2]/15 pointer-events-none z-0" />
      <div className="absolute right-[15%] bottom-8 w-[110px] h-[110px] rounded-full bg-[#935338]/6 pointer-events-none z-0" />
      
      {/* Floating abstract dots & rings */}
      <div className="absolute top-[28%] right-[28%] w-3.5 h-3.5 rounded-full bg-indie-terracotta/30 pointer-events-none z-0" />
      <div className="absolute bottom-[24%] right-[38%] w-5 h-5 rounded-full border border-dashed border-indie-clay/35 pointer-events-none z-0" />

      <div className="absolute right-4 bottom-12 w-20 h-40 opacity-20 z-0 pointer-events-none transform -rotate-12 origin-bottom-right hidden lg:block">
        <svg viewBox="0 0 120 240" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M55,230 Q60,140 65,40" stroke="#935338" strokeWidth="4" strokeLinecap="round" />
          <path d="M62,190 C78,190 85,170 80,155 C72,145 64,165 62,190" fill="#ebd3b2" />
          <path d="M58,150 C42,150 35,130 40,115 C48,105 56,125 58,150" fill="#ebd3b2" />
          <path d="M62,110 C78,110 85,90 80,75 C72,65 64,85 62,110" fill="#ebd3b2" />
          <path d="M60,70 C50,50 60,30 60,30 C60,30 70,50 60,70" fill="#ebd3b2" />
        </svg>
      </div>

      {/* Navbar */}
      <nav className="border-b-2 border-dotted border-indie-dark py-4 px-4 md:py-5 md:px-12 flex justify-between items-center bg-indie-bg/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-3 select-none">
          <img src="/shecanfoundation.avif" alt="She Can Logo" className="w-10 h-10 object-contain rounded-md" />
          <div className="flex flex-col text-left">
            <div className="flex items-baseline">
              <span className="font-sans font-extrabold text-2xl md:text-4xl text-indie-dark tracking-tight">She</span>
              <span className="font-script-indie text-3xl md:text-5xl text-indie-terracotta font-bold ml-1 transform rotate-[-3deg] inline-block">Can!</span>
            </div>
            <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-neutral-500 font-bold -mt-0.5 block">Dashboard</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onBackToForm}
            className="font-mono-indie text-xs tracking-wider uppercase bg-white hover:bg-indie-dark hover:text-white px-4 py-2 border-2 border-indie-dark transition-all duration-200 indie-shadow-sm indie-shadow-active"
          >
            View Form
          </button>
          <button
            onClick={handleLogout}
            className="font-mono-indie text-xs tracking-wider uppercase bg-transparent text-neutral-500 hover:text-red-600 px-4 py-2 border-2 border-transparent hover:border-red-600/30 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Panel Content */}
      <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full relative z-10">
        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b-2 border-[#1e201e]/15 mb-10 pb-2">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`pb-2.5 font-mono-indie text-xs uppercase tracking-wider font-bold border-b-2 transition-all ${
              activeTab === 'submissions'
                ? 'border-[#1e201e] text-[#1e201e]'
                : 'border-transparent text-neutral-400 hover:text-[#1e201e]'
            }`}
          >
            Letters Received ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab('fields')}
            className={`pb-2.5 font-mono-indie text-xs uppercase tracking-wider font-bold border-b-2 transition-all ${
              activeTab === 'fields'
                ? 'border-[#1e201e] text-[#1e201e]'
                : 'border-transparent text-neutral-400 hover:text-[#1e201e]'
            }`}
          >
            Customize Form
          </button>
        </div>

        {/* Tab Panel render */}
        <div className="animate-slide-up relative z-10">
          {activeTab === 'fields' ? (
            <FieldManager fields={fields} onFieldsUpdate={fetchData} />
          ) : (
            <SubmissionsTable submissions={submissions} onUpdate={fetchSubmissions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;