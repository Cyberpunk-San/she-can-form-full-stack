import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useForm } from '../hooks/useForm';
import { FormField } from '../types';
import SuccessModal from './SuccessModal';

interface PublicFormProps {
  onAdminClick: () => void;
}

const defaultFields: FormField[] = [
  { _id: 'default-name', fieldName: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter your name', order: 1, isActive: true },
  { _id: 'default-email', fieldName: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter your email address', order: 2, isActive: true },
  { _id: 'default-message', fieldName: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Write your message here...', order: 3, isActive: true }
];

const PublicForm: React.FC<PublicFormProps> = ({ onAdminClick }) => {
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reviewedSubmissions, setReviewedSubmissions] = useState<any[]>([]);
  const [showPublicBoard, setShowPublicBoard] = useState(false);
  const [selectedPublicSub, setSelectedPublicSub] = useState<any | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState({ text: '', author: '' });

  const quotes = [
    { text: "They said boxing is only for men. I decided to step into the ring and show them what a woman's fist can do. I chose to fight.", author: "Mary Kom" },
    { text: "Throw away the chains of social slavery. Rise, learn, and break down the walls of ignorance that bind you.", author: "Savitribai Phule" },
    { text: "There is nothing more powerful than a woman determined to rise and smash the barriers built around her.", author: "Kiran Bedi" },
    { text: "We want deeper sincerity of motive, a greater courage in speech and earnestness in action to break the chains.", author: "Sarojini Naidu" },
    { text: "If you don't stand up for yourself, no one else will. Your strength is your own to claim.", author: "Sudha Murty" },
    { text: "To respect strength, never power. We will fight them with our stories, our voices, and our survival.", author: "Arundhati Roy" },
    { text: "We cannot all succeed when half of us are held back. We will speak until our voices break down the silence.", author: "Malala Yousafzai" },
    { text: "You may shoot me with your words, you may cut me with your eyes... but still, like air, I'll rise.", author: "Maya Angelou" },
    { text: "I am deliberate and afraid of nothing.", author: "Audre Lorde" },
    { text: "Never let your background or gender dictate your capacity to achieve. Reach for the stars and break every ceiling along the way.", author: "Kalpana Chawla" }
  ];

  const handleBadgeClick = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
    setShowQuoteModal(true);
  };

  const handleRandomRead = () => {
    if (reviewedSubmissions.length === 0) return;
    const randomSub = reviewedSubmissions[Math.floor(Math.random() * reviewedSubmissions.length)];
    setSelectedPublicSub(randomSub);
  };
  
  const { formData, errors, isSubmitting, handleChange, submitForm, initializeForm } = useForm(fields);

  useEffect(() => {
    fetchFields();
    fetchReviewedSubmissions();
  }, []);

  useEffect(() => {
    if (fields.length > 0) {
      initializeForm();
    }
  }, [fields]);

  const fetchFields = async () => {
    try {
      const response = await api.get('/form-fields');
      if (response.data && response.data.length > 0) {
        setFields(response.data);
      } else {
        setFields(defaultFields);
      }
    } catch (error) {
      console.error('Error fetching fields:', error);
      setFields(defaultFields);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewedSubmissions = async () => {
    try {
      const response = await api.get('/submissions/public');
      setReviewedSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching reviewed submissions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitForm(() => {
      setShowSuccess(true);
      fetchReviewedSubmissions(); // reload public list
    });
    if (success) {
      setTimeout(() => setShowSuccess(false), 3000);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ef] flex items-center justify-center font-mono-indie text-[#1e201e]">
        <div>loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indie-bg flex flex-col text-indie-dark overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b-2 border-dotted border-indie-dark py-4 px-4 md:py-5 md:px-12 flex justify-between items-center bg-indie-bg/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-3 select-none">
          <img src="/shecanfoundation.avif" alt="She Can Logo" className="w-10 h-10 object-contain rounded-md" />
          <div className="flex flex-col text-left">
            <div className="flex items-baseline">
              <span className="font-sans font-extrabold text-2xl md:text-4xl text-indie-dark tracking-tight">She</span>
              <span className="font-script-indie text-3xl md:text-5xl text-indie-terracotta font-bold ml-1 transform rotate-[-3deg] inline-block">Can!</span>
            </div>
            <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-neutral-500 font-bold -mt-0.5 block">Foundation</span>
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-4 items-center">
          <span className="hidden sm:inline font-serif-indie text-xs italic text-neutral-500 mr-1">
            The Archive of Voices:
          </span>
          <button
            onClick={() => setShowPublicBoard(true)}
            className="font-mono-indie text-[10px] sm:text-xs tracking-wider uppercase bg-white hover:bg-indie-dark hover:text-white px-2.5 py-1.5 sm:px-4 sm:py-2 border-2 border-indie-dark transition-all duration-200 indie-shadow-sm indie-shadow-active flex items-center gap-1.5"
          >
            {/* SVG Letters icon */}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
              <line x1="16" y1="8" x2="2" y2="22"></line>
              <line x1="17.5" y1="15" x2="9" y2="15"></line>
            </svg>
            Letters ({reviewedSubmissions.length})
          </button>
          <button
            onClick={onAdminClick}
            className="font-mono-indie text-[10px] sm:text-xs tracking-wider uppercase text-neutral-500 hover:text-indie-dark px-1.5 py-2"
          >
            Admin
          </button>
        </div>
      </nav>
 
      {/* Main Content Area - Split responsive layout */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* Section Reference Header */}
        <div className="border-b border-indie-dark/15 pb-2 mb-6 md:pb-3 md:mb-8 flex justify-between items-baseline select-none">
          <span className="font-mono-indie text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-bold">
            Portal // Solidarity & Action
          </span>
          <span className="font-serif-indie text-[10px] md:text-xs italic text-neutral-400">
            Form Page
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between lg:gap-12 w-full">
        {/* Left Side: Massive Hero Illustration ("Main Character") */}
        <div className="w-full lg:w-[52%] flex flex-col items-center justify-start lg:sticky lg:top-24 animate-slide-up mb-8 lg:mb-0">
          <div className="relative w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[620px] aspect-square flex items-center justify-center">
            
            {/* Custom Layered Botanical Branch (Symbol: Natural Growth & Unity - Blooming upward for positivity) */}
            <div className="absolute -left-6 sm:-left-12 bottom-12 sm:bottom-16 w-20 sm:w-28 h-40 sm:h-56 opacity-90 z-0 pointer-events-none transform -rotate-12 origin-bottom-left">
              <svg viewBox="0 0 120 240" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Sand-colored background wheat/leaves (pointing up) */}
                <path d="M55,230 Q60,140 65,40" stroke="#ebd3b2" strokeWidth="6" strokeLinecap="round" />
                <path d="M62,190 C78,190 85,170 80,155 C72,145 64,165 62,190" fill="#ebd3b2" />
                <path d="M58,150 C42,150 35,130 40,115 C48,105 56,125 58,150" fill="#ebd3b2" />
                <path d="M62,110 C78,110 85,90 80,75 C72,65 64,85 62,110" fill="#ebd3b2" />
                <path d="M60,70 C50,50 60,30 60,30 C60,30 70,50 60,70" fill="#ebd3b2" />

                {/* Terracotta Foreground Leafy Branch (pointing up) */}
                <path d="M40,230 Q45,150 50,50" stroke="#935338" strokeWidth="3" strokeLinecap="round" />
                <path d="M48,180 C32,180 25,160 30,145 C38,135 50,155 48,180" fill="#d47345" />
                <path d="M50,150 C68,150 75,130 70,115 C62,105 52,125 50,150" fill="#d47345" />
                <path d="M48,120 C32,120 25,100 30,85 C38,75 50,95 48,120" fill="#d47345" />
                <path d="M50,90 C68,90 75,70 70,55 C62,45 52,65 50,90" fill="#d47345" />
                <path d="M50,60 C40,40 50,20 50,20 C50,20 60,40 50,60" fill="#d47345" />
                
                {/* Solid accent dot */}
                <circle cx="28" cy="180" r="5" fill="#935338" />
              </svg>
            </div>

            {/* Single Four-Point Diamond Star Sparkle (Symbol: Hope & Aspiration) */}
            <div className="absolute top-6 left-6 sm:top-10 sm:left-10 w-5 h-5 sm:w-6 sm:h-6 text-indie-terracotta fill-current animate-pulse pointer-events-none z-20" style={{ animationDuration: '3.5s' }}>
              <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M12 0 L15.5 8.5 L24 12 L15.5 15.5 L12 24 L8.5 15.5 L0 12 L8.5 8.5 Z" /></svg>
            </div>

            {/* Massive background warm circles / organic blobs */}
            <div className="absolute w-[85%] h-[85%] bg-indie-sand/30 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '0s' }} />
            <div className="absolute w-[60%] h-[60%] bg-indie-terracotta/5 rounded-full filter blur-2xl animate-float" style={{ animationDelay: '1.5s', left: '10%' }} />
            
            {/* Circular Rotating Text Stamp Badge - Overlapping on Top-Right */}
            <button
              onClick={handleBadgeClick}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-6 md:right-6 z-20 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center bg-white border-2 border-indie-dark rounded-full indie-shadow transition-all hover:scale-105 active:translate-y-0.5 active:translate-x-0.5 duration-200 cursor-pointer focus:outline-none"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full animate-slow-spin">
                <defs>
                  <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                </defs>
                <text className="font-mono-indie text-[5.8px] fill-indie-clay uppercase tracking-[1.4px] font-bold">
                  <textPath href="#circlePath">
                    She Can Foundation • Empower • Inspire •
                  </textPath>
                </text>
              </svg>
              <div className="absolute inset-5 sm:inset-6 bg-indie-terracotta border border-indie-dark rounded-full flex items-center justify-center text-white">
                <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 fill-current text-indie-bg" viewBox="0 0 24 24">
                  <path d="M12 0 L15.5 8.5 L24 12 L15.5 15.5 L12 24 L8.5 15.5 L0 12 L8.5 8.5 Z" />
                </svg>
              </div>
            </button>

            {/* Bottom-Left decorative badge */}
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-20 inline-flex items-center gap-1.5 border-2 border-indie-dark px-2 py-1 sm:px-3 sm:py-1.5 bg-white font-mono-indie text-[8px] sm:text-[9px] uppercase tracking-widest text-indie-dark font-bold indie-shadow-sm">
              <svg className="w-2.5 h-2.5 fill-current text-indie-terracotta" viewBox="0 0 24 24">
                <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
              </svg>
              empowerment
            </div>

            {/* The Main Character Illustration */}
            <img src="/animations/women.svg" alt="She Can Art" className="w-full h-full object-contain relative z-10 hover:scale-[1.02] transition-transform duration-500" />
          </div>

          {/* Small Decorative Graphic elements matching the illustration style */}
          <div className="flex gap-3 pt-3 items-center">
            {/* Leaf/wheat sketch */}
            <svg className="w-8 h-8 sm:w-12 sm:h-12 text-indie-terracotta animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8 6 6 12 12 22C18 12 16 6 12 2ZM11 18c-2-2-3-5-2-8 1 2 2 4 4 6-1 1-1.5 1.5-2 2Z" />
            </svg>
            <div className="font-mono-indie text-[10px] sm:text-xs uppercase tracking-wider text-neutral-500">
              natural growth & unity
            </div>
          </div>

          {/* Quote & Social Links Card (Desktop only) */}
          <div className="hidden lg:block mt-8 pt-6 border-t-2 border-dotted border-indie-dark/15 w-full max-w-[620px] text-left space-y-4">
            <h3 className="font-serif-indie text-2xl sm:text-3xl font-bold text-indie-dark tracking-tight">
              Join the movement.
            </h3>
            <blockquote className="border-l-2 border-indie-terracotta pl-4 italic text-neutral-600 font-serif-indie text-sm sm:text-base leading-relaxed">
              "Awake, arise, and educate yourself. Stand on your own feet, break the chains of oppression, and change this society from its roots."
              <span className="block font-mono-indie text-[9px] uppercase tracking-wider text-neutral-400 font-bold mt-1.5">
                — Savitribai Phule
              </span>
            </blockquote>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-4 border-t border-dashed border-indie-dark/10">
              <div className="space-y-1">
                <span className="font-mono-indie text-[8px] uppercase tracking-widest text-neutral-400 font-bold block">
                  Official Website
                </span>
                <a 
                  href="https://shecanfoundation.org/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-serif-indie text-xs text-indie-clay hover:text-indie-terracotta hover:underline font-bold transition-colors"
                >
                  shecanfoundation.org
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <a 
                  href="https://www.instagram.com/_shecanfoundation_" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 border border-indie-dark/15 hover:border-indie-dark bg-white hover:bg-indie-bg transition-all duration-200 text-neutral-600 hover:text-indie-dark"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://www.linkedin.com/company/shecanfoundation" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 border border-indie-dark/15 hover:border-indie-dark bg-white hover:bg-indie-bg transition-all duration-200 text-neutral-600 hover:text-indie-dark"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Editorial Branding & Form */}
        <div className="w-full lg:w-[44%] text-left space-y-6 sm:space-y-8 lg:pl-6 animate-slide-up flex flex-col items-start relative">
          {/* Subtle art accents at the top-right portion below the navbar (Symbol: hope, inspiration & growth) */}
          <div className="absolute -top-6 right-2 sm:-top-10 sm:right-6 w-24 sm:w-32 h-8 sm:h-10 flex items-center justify-end gap-2 sm:gap-3 pointer-events-none z-0">
            {/* Sparkle 1 (Large, Terracotta) */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-indie-terracotta animate-pulse" style={{ animationDuration: '3s' }}><path d="M12 0 L15.5 8.5 L24 12 L15.5 15.5 L12 24 L8.5 15.5 L0 12 L8.5 8.5 Z" /></svg>
            {/* Sparkle 2 (Medium, Clay) */}
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-indie-clay animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}><path d="M12 0 L15.5 8.5 L24 12 L15.5 15.5 L12 24 L8.5 15.5 L0 12 L8.5 8.5 Z" /></svg>
            {/* Sparkle 3 (Small, Sand) */}
            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current text-indie-sand animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}><path d="M12 0 L15.5 8.5 L24 12 L15.5 15.5 L12 24 L8.5 15.5 L0 12 L8.5 8.5 Z" /></svg>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <h1 className="font-serif-indie text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-indie-dark leading-[1.15] relative w-full">
              We break barriers. <br />
              <span className="text-indie-terracotta italic font-normal">We write</span> our own stories.
            </h1>
            
            <p className="font-serif-indie text-sm sm:text-base text-neutral-600 leading-relaxed max-w-lg">
              We are the <strong>She Can Foundation</strong> (registered under the Indian Society Act, 1860)—a global force built to smash social barriers. We equip women worldwide with training, resources, and advocacy to lead and reclaim their power. Together, we will revolutionize society and build a better world. Leave a letter below to join the movement.
            </p>
          </div>

          {/* Form Container on the right side */}
          <div className="w-full bg-white border-2 border-indie-dark p-5 sm:p-6 md:p-8 indie-shadow relative">
            {/* Whimsical dotted looping line (Symbol: The Path of Sharing a Story/Letter) */}
            <div className="absolute -top-6 -left-10 sm:-top-8 sm:-left-14 w-32 sm:w-44 h-12 sm:h-16 text-indie-terracotta/80 pointer-events-none z-20">
              <svg viewBox="0 0 150 60" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M 10 15 C 30 15, 40 45, 20 45 C 5 45, 15 15, 50 15 C 80 15, 90 45, 110 45 C 122 45, 132 15, 140 18 C 144 20, 146 26, 145 32" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeDasharray="1 7" 
                />
              </svg>
            </div>
            
            {/* Offset dotted decorative outline frame */}
            <div className="absolute -inset-1.5 border-2 border-dotted border-indie-clay/40 pointer-events-none z-0 rounded-sm" />
            
            <div className="border-b-2 border-dashed border-indie-dark/20 pb-4 mb-6 relative z-10">
              <span className="font-mono-indie text-[9px] uppercase tracking-widest text-indie-terracotta font-bold block mb-1">
                Letter Submission Form
              </span>
              <h2 className="font-serif-indie text-xl font-bold">Leave a message</h2>
              <p className="font-serif-indie italic text-xs text-neutral-500">Your voice matters to us.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {fields.map((field) => (
                <div key={field._id} className="flex flex-col space-y-1.5">
                  <label className="font-mono-indie text-[9px] tracking-wider uppercase font-bold text-neutral-500">
                    {field.label} {field.required && <span className="text-indie-terracotta font-sans">*</span>}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.fieldName] || ''}
                      onChange={(e) => handleChange(field.fieldName, e.target.value)}
                      className={`w-full px-4 py-2.5 border-2 border-indie-dark bg-indie-bg/30 font-sans focus:outline-none transition-all text-sm ${errors[field.fieldName] ? 'bg-red-50/50' : 'focus:bg-white focus:border-indie-blue'}`}
                      rows={3}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.fieldName] || ''}
                      onChange={(e) => handleChange(field.fieldName, e.target.value)}
                      className={`w-full px-4 py-2.5 border-2 border-indie-dark bg-indie-bg/30 font-sans focus:outline-none transition-all text-sm ${errors[field.fieldName] ? 'bg-red-50/50' : 'focus:bg-white focus:border-indie-blue'}`}
                      placeholder={field.placeholder}
                    />
                  )}

                  {errors[field.fieldName] && (
                    <p className="font-mono-indie text-[10px] text-red-600 mt-1">{errors[field.fieldName]}</p>
                  )}
                </div>
              ))}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indie-terracotta hover:bg-indie-clay text-white font-mono-indie text-xs tracking-widest uppercase font-bold py-3.5 border-2 border-indie-dark transition-all duration-200 indie-shadow indie-shadow-active disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Letter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Quote & Social Links Card (Mobile only - renders at the very bottom below the grid) */}
      <div className="block lg:hidden mt-8 mb-12 p-4 mx-4 border-t-2 border-dotted border-indie-dark/15 text-left space-y-4">
        <h3 className="font-serif-indie text-2xl font-bold text-indie-dark tracking-tight">
          Join the movement.
        </h3>
        <blockquote className="border-l-2 border-indie-terracotta pl-4 italic text-neutral-600 font-serif-indie text-sm leading-relaxed">
          "Awake, arise, and educate yourself. Stand on your own feet, break the chains of oppression, and change this society from its roots."
          <span className="block font-mono-indie text-[9px] uppercase tracking-wider text-neutral-400 font-bold mt-1.5">
            — Savitribai Phule
          </span>
        </blockquote>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-4 border-t border-dashed border-indie-dark/10">
          <div className="space-y-1">
            <span className="font-mono-indie text-[8px] uppercase tracking-widest text-neutral-400 font-bold block">
              Official Website
            </span>
            <a 
              href="https://shecanfoundation.org/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-serif-indie text-xs text-indie-clay hover:text-indie-terracotta hover:underline font-bold transition-colors"
            >
              shecanfoundation.org
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="https://www.instagram.com/_shecanfoundation_" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 border border-indie-dark/15 hover:border-indie-dark bg-white hover:bg-indie-bg transition-all duration-200 text-neutral-600 hover:text-indie-dark"
              title="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            
            <a 
              href="https://www.linkedin.com/company/shecanfoundation" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 border border-indie-dark/15 hover:border-indie-dark bg-white hover:bg-indie-bg transition-all duration-200 text-neutral-600 hover:text-indie-dark"
              title="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

      {/* Public Board Modal */}
      {showPublicBoard && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-40 animate-fade-in">
          <div className="max-w-4xl w-full h-[540px] max-h-[85vh] bg-[#f7f4ef] border-2 border-[#1e201e] p-6 md:p-8 indie-shadow-lg animate-slide-up relative flex flex-col">
            {/* Close */}
            <button
              onClick={() => setShowPublicBoard(false)}
              className="absolute top-4 right-4 font-mono-indie text-xs tracking-wider uppercase border border-[#1e201e] hover:bg-[#1e201e] hover:text-white px-3 py-1 transition-all"
            >
              Close
            </button>

            <div className="border-b-2 border-dashed border-[#1e201e]/30 pb-4 mb-6 text-left flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <h2 className="font-serif-indie text-3xl font-bold">Public Letters</h2>
                <div className="flex flex-col md:flex-row md:items-baseline mt-1.5 gap-2">
                  <p className="font-mono-indie text-xs uppercase tracking-wider text-neutral-500">
                    Approved letters shared by visitors: {reviewedSubmissions.length}
                  </p>
                  <span className="font-serif-indie italic text-[11px] text-neutral-600 bg-indie-sand/40 border border-indie-dark/15 px-2.5 py-1 rounded-sm block md:inline-block">
                    the letters should be reviewed and approved by admin to be shown here, (login to admin and click reviewed to be shown here)
                  </span>
                </div>
              </div>
              <button
                onClick={handleRandomRead}
                disabled={reviewedSubmissions.length === 0}
                className="font-mono-indie text-[10px] sm:text-xs tracking-wider uppercase bg-white hover:bg-indie-dark hover:text-white px-3 py-1.5 border-2 border-indie-dark transition-all duration-200 indie-shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"></path>
                </svg>
                Random Read
              </button>
            </div>

            {/* Grid of Letters */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
              {reviewedSubmissions.length === 0 ? (
                <div className="col-span-full border-2 border-dashed border-[#1e201e]/30 p-12 text-center bg-white/40">
                  <p className="font-serif-indie italic text-neutral-500">No reviewed letters to show yet.</p>
                </div>
              ) : (
                reviewedSubmissions.map((sub) => {
                  const name = getFieldValue(sub.formData, ['name', 'Name', 'fullName']) || 'Anonymous';
                  const email = getFieldValue(sub.formData, ['email', 'Email']) || 'No Email';
                  const msgPreview = getFieldValue(sub.formData, ['message', 'Message', 'content']) || '';

                  return (
                    <div
                      key={sub._id}
                      onClick={() => setSelectedPublicSub(sub)}
                      className="bg-white border-2 border-[#1e201e] p-5 cursor-pointer indie-shadow transition-all hover:-translate-y-0.5 hover:indie-shadow-lg flex flex-col justify-between min-h-[160px]"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-mono-indie text-[9px] uppercase tracking-widest text-neutral-400">
                            {new Date(sub.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="font-mono-indie text-[9px] uppercase tracking-widest text-neutral-400">
                            POSTMARK
                          </span>
                        </div>
                        <h4 className="font-serif-indie text-lg font-bold text-[#1e201e] truncate">{name}</h4>
                        <p className="font-serif-indie italic text-sm text-neutral-600 line-clamp-2 mt-2">
                          "{msgPreview}"
                        </p>
                      </div>
                      <span className="font-mono-indie text-[10px] uppercase font-bold tracking-wider text-[#1e201e] mt-4 self-start hover:underline">
                        Read Letter →
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Individual Public Letter View Modal */}
      {selectedPublicSub && (() => {
        const name = getFieldValue(selectedPublicSub.formData, ['name', 'Name', 'fullName']) || 'Anonymous';
        const message = getFieldValue(selectedPublicSub.formData, ['message', 'Message', 'content']) || 'No message content.';

        return (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="max-w-2xl w-full bg-[#f4f1ea] border-2 border-[#1e201e] p-1.5 indie-shadow-lg animate-slide-up">
              <div className="border border-dashed border-[#1e201e]/50 bg-white p-6 md:p-10 relative">
                <button
                  onClick={() => setSelectedPublicSub(null)}
                  className="absolute top-4 right-4 font-mono-indie text-xs tracking-wider uppercase border border-[#1e201e] hover:bg-[#1e201e] hover:text-white px-3 py-1 transition-all"
                >
                  Close
                </button>

                <div className="border-b border-[#1e201e]/20 pb-4 mb-6">
                  <p className="font-mono-indie text-xs uppercase tracking-wider text-neutral-500">
                    Postmark: {new Date(selectedPublicSub.submittedAt).toLocaleDateString()}
                  </p>
                  <h3 className="font-serif-indie text-2xl font-bold text-[#1e201e] mt-2">
                    Sender: {name}
                  </h3>
                </div>

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
                </div>

                <div className="mt-8 flex justify-end border-t border-dashed border-[#1e201e]/30 pt-6">
                  <button
                    onClick={() => setSelectedPublicSub(null)}
                    className="font-mono-indie text-xs tracking-wider uppercase text-neutral-500 hover:text-[#1e201e]"
                  >
                    Back to Board
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}

      {/* Whimsical Inspiration Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="max-w-md w-full bg-[#f4f1ea] border-2 border-indie-dark p-1.5 indie-shadow-lg animate-slide-up">
            <div className="border border-dashed border-indie-dark/50 bg-white p-6 md:p-8 relative text-center">
              <button
                onClick={() => setShowQuoteModal(false)}
                className="absolute top-3 right-3 font-mono-indie text-[10px] tracking-wider uppercase border border-indie-dark hover:bg-indie-dark hover:text-white px-2.5 py-0.5 transition-all"
              >
                Close
              </button>

              <div className="w-10 h-10 mx-auto mb-4 text-indie-terracotta">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <blockquote className="space-y-4">
                <p className="font-serif-indie text-xl italic text-neutral-800 leading-relaxed">
                  "{currentQuote.text}"
                </p>
                <cite className="block font-mono-indie text-xs uppercase tracking-wider text-neutral-500 font-bold not-italic">
                  — {currentQuote.author}
                </cite>
              </blockquote>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicForm;