"use client";
import React, { useState } from 'react';
import { Settings, Bell, Eye, Shield, Save } from 'lucide-react';

export default function UserSettings({ state, setters, actions }: any) {
  const [formData, setFormData] = useState({
    emailNotifications: state.userSettings.emailNotifications,
    showOnlineStatus: state.userSettings.showOnlineStatus,
    profileVisibility: state.userSettings.profileVisibility
  });

  const handleToggle = (key: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, profileVisibility: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.saveSettings(formData);
    setters.setActiveTab('hub'); // <-- Automatically go back to the Hub
  };

  return (
    <section className="container mx-auto px-5 py-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border-2 border-slate-50">
        <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <Settings className="text-indigo-600" size={32} />
          Account Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 pb-2">Notifications</h3>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl text-indigo-500 shadow-sm"><Bell size={20}/></div>
                <div>
                  <h4 className="font-black text-slate-800">Email Notifications</h4>
                  <p className="text-[11px] font-bold text-slate-500">Receive an email when you get a new match or message.</p>
                </div>
              </div>
              <button type="button" onClick={() => handleToggle('emailNotifications')} className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${formData.emailNotifications ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${formData.emailNotifications ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 pb-2">Privacy</h3>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl text-emerald-500 shadow-sm"><Eye size={20}/></div>
                <div>
                  <h4 className="font-black text-slate-800">Show Online Status</h4>
                  <p className="text-[11px] font-bold text-slate-500">Let others see when you are active on SkillSwap.</p>
                </div>
              </div>
              <button type="button" onClick={() => handleToggle('showOnlineStatus')} className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${formData.showOnlineStatus ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${formData.showOnlineStatus ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t-2 border-slate-100">
            <button type="submit" className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-200">
              <Save size={20} /> Save Preferences
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}