"use client";
import React, { useState, useEffect, useRef } from 'react';
import { User, Briefcase, MapPin, Save, Award, Clock } from 'lucide-react';

const COUNTRIES = [
  "Philippines", "United States", "United Kingdom", "Canada", 
  "Australia", "India", "Germany", "France", "Japan", "Brazil", "Other"
];

const EXPERIENCE_LEVELS = [
  "Beginner", "Intermediate", "Advanced", "Expert"
];

export default function UserProfile({ state, setters, actions }: any) {
  const [formData, setFormData] = useState(() => ({
    name: state.userName || "",
    bio: state.userProfile?.bio || "",
    title: state.userProfile?.title || "",
    location: state.userProfile?.location || COUNTRIES[0],
    experienceLevel: state.userProfile?.experienceLevel || EXPERIENCE_LEVELS[0],
    availability: state.userProfile?.availability || "Flexible"
  }));

  // Track values in a mutable ref to ensure the unmount cleanup can auto-save cleanly
  const latestForm = useRef(formData);
  useEffect(() => {
    latestForm.current = formData;
  }, [formData]);

  // Accidental Navigation Auto-Save Mechanism
  useEffect(() => {
    const initialForm = {
      name: state.userName || "",
      bio: state.userProfile?.bio || "",
      title: state.userProfile?.title || "",
      location: state.userProfile?.location || COUNTRIES[0],
      experienceLevel: state.userProfile?.experienceLevel || EXPERIENCE_LEVELS[0],
      availability: state.userProfile?.availability || "Flexible"
    };

    return () => {
      const current = latestForm.current;
      const hasChanged = 
        current.name !== initialForm.name ||
        current.bio !== initialForm.bio ||
        current.title !== initialForm.title ||
        current.location !== initialForm.location ||
        current.experienceLevel !== initialForm.experienceLevel ||
        current.availability !== initialForm.availability;

      if (hasChanged) {
        // Silently saves details to Supabase when switching tabs away
        actions.saveProfile({
          name: current.name,
          bio: current.bio,
          title: current.title,
          location: current.location,
          experienceLevel: current.experienceLevel,
          availability: current.availability
        }, true);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.target.name === 'bio' && e.target.value.length > 100) return;
    if (e.target.name === 'name' && e.target.value.length > 25) return;
    if (e.target.name === 'title' && e.target.value.length > 40) return;
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await actions.saveProfile({
      name: formData.name,
      bio: formData.bio,
      title: formData.title,
      location: formData.location,
      experienceLevel: formData.experienceLevel,
      availability: formData.availability
    }, false); // Normal save triggers instant redirect to dashboard
  };

  return (
    <section className="container mx-auto px-5 py-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border-2 border-slate-50">
        <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <User className="text-indigo-600" size={32} />
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          
          {/* DISPLAY NAME */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Display Name</label>
              <span className={`text-[10px] font-black uppercase tracking-wider ${formData.name.length >= 22 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                {formData.name.length} / 25
              </span>
            </div>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              maxLength={25}
              className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-800"
              placeholder="Your Name"
            />
          </div>

          {/* PROFESSIONAL TITLE */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Briefcase size={14}/> Professional Title
              </label>
              <span className={`text-[10px] font-black uppercase tracking-wider ${formData.title.length >= 35 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                {formData.title.length} / 40
              </span>
            </div>
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              maxLength={40}
              className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-800"
              placeholder="e.g. Senior React Developer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Clock size={14}/> Availability
              </label>
              <select 
                name="availability" value={formData.availability} onChange={handleChange}
                className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-800 cursor-pointer"
              >
                <option value="Flexible">Flexible</option>
                <option value="Weekends">Weekends</option>
                <option value="Evenings Only">Evenings Only</option>
                <option value="Mornings">Mornings</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Bio / What you teach</label>
              <span className={`text-[10px] font-black uppercase tracking-wider ${formData.bio.length > 85 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                {formData.bio.length} / 100
              </span>
            </div>
            <textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              maxLength={100} 
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