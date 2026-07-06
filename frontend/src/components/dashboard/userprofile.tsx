// components/dashboard/userprofile.tsx

"use client";
import React, { useState } from 'react';
import { User, Briefcase, MapPin, Save, Award } from 'lucide-react';

const COUNTRIES = [
  "Philippines", "United States", "United Kingdom", "Canada", 
  "Australia", "India", "Germany", "France", "Japan", "Brazil", "Other"
];

const EXPERIENCE_LEVELS = [
  "Beginner", "Intermediate", "Advanced", "Expert"
];

export default function UserProfile({ state, setters, actions }: any) {
  // Use a pristine state initializer to completely prevent the form inputs from clearing out while typing
  const [formData, setFormData] = useState(() => ({
    name: state.userName || "",
    bio: state.userProfile?.bio || "",
    title: state.userProfile?.title || "",
    location: state.userProfile?.location || COUNTRIES[0],
    experienceLevel: state.userProfile?.experienceLevel || EXPERIENCE_LEVELS[0]
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.target.name === 'bio' && e.target.value.length > 150) return;
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await actions.saveProfile({
      name: formData.name,
      bio: formData.bio,
      title: formData.title,
      location: formData.location,
      experienceLevel: formData.experienceLevel
    });

    setters.setActiveTab(state.isAdmin ? 'admin' : 'hub'); 
  };

  return (
    <section className="container mx-auto px-5 py-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border-2 border-slate-50">
        <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <User className="text-indigo-600" size={32} />
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Display Name</label>
            <input 
              name="name" value={formData.name} onChange={handleChange}
              className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-800"
              placeholder="Your Name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Briefcase size={14}/> Professional Title
            </label>
            <input 
              name="title" value={formData.title} onChange={handleChange}
              className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-800"
              placeholder="e.g. Senior React Developer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Award size={14}/> Experience Level
              </label>
              <select 
                name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}
                className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-800 cursor-pointer"
              >
                {EXPERIENCE_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <MapPin size={14}/> Country
              </label>
              <select 
                name="location" value={formData.location} onChange={handleChange}
                className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-800 cursor-pointer"
              >
                <option value="" disabled>Select your country...</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Bio / What you teach</label>
              <span className={`text-[10px] font-black uppercase tracking-wider ${formData.bio.length > 130 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                {formData.bio.length} / 150
              </span>
            </div>
            <textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              maxLength={150} 
              rows={4}
              className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-800 resize-none"
              placeholder="Tell others what you can teach them..."
            />
          </div>

          <div className="pt-6 border-t-2 border-slate-100">
            <button type="submit" className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-200">
              <Save size={20} /> Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}