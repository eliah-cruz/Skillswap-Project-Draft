"use client";
import React, { useState } from 'react';
import { User, Briefcase, MapPin, Save, Award } from 'lucide-react';
import { categories } from "../../constants/data"; 

const COUNTRIES = [
  "Philippines", "United States", "United Kingdom", "Canada", 
  "Australia", "India", "Germany", "France", "Japan", "Brazil", "Other"
];

const EXPERIENCE_LEVELS = [
  "Beginner", "Intermediate", "Advanced", "Expert"
];

export default function UserProfile({ state, setters, actions }: any) {
  const [formData, setFormData] = useState({
    name: state.userName,
    bio: state.userProfile?.bio || "",
    title: state.userProfile?.title || "",
    location: state.userProfile?.location || COUNTRIES[0],
    experienceLevel: state.userProfile?.experienceLevel || EXPERIENCE_LEVELS[1]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    actions.saveToPhoneBook({ name: formData.name }); 
    
    actions.saveProfile({
      bio: formData.bio,
      title: formData.title,
      location: formData.location,
      experienceLevel: formData.experienceLevel
    });

    setters.setActiveTab('hub'); 
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

          {/* Side-by-Side: Experience Level & Country */}
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
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Bio / What you teach</label>
            <textarea 
              name="bio" value={formData.bio} onChange={handleChange} rows={4}
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