// src/components/dashboard/usersettings.tsx

"use client";
import React, { useState } from 'react';
import { Settings, Bell, Eye, Save } from 'lucide-react';

export default function UserSettings({ state, setters, actions }: any) {
  const [formData, setFormData] = useState(() => ({
    emailNotifications: state.userSettings.emailNotifications,
    showOnlineStatus: state.userSettings.showOnlineStatus,
    profileVisibility: state.userSettings.profileVisibility
  }));

  const handleToggle = (key: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actions.saveSettings(formData); // Transition to dashboard handled instantly inside the action hook
  };

  return (
    <section className="container mx-auto px-4 md:px-5 py-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm border-2 border-slate-50 text-left">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 md:mb-8 flex items-center gap-2 md:gap-3">
          <Settings className="text-indigo-600 w-7 h-7 md:w-8 md:h-8" strokeWidth={2.5} />
          Account Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          
          {/* Notifications Section */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 pb-2">
              Notifications
            </h3>
            <div className="flex items-center justify-between p-4 md:p-5 bg-slate-50 rounded-xl md:rounded-2xl gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <div className="p-2.5 md:p-3 bg-white rounded-lg md:rounded-xl text-indigo-500 shadow-sm shrink-0">
                  <Bell className="w-5 h-5 md:w-5 md:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-800 text-sm md:text-base truncate">Email Notifications</h4>
                  <p className="text-[10px] md:text-[11px] font-bold text-slate-500 leading-snug mt-0.5 md:mt-1">
                    Receive an email when you get a new match or message.
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => handleToggle('emailNotifications')} 
                className={`shrink-0 w-12 h-7 md:w-14 md:h-8 rounded-full transition-colors relative cursor-pointer ${formData.emailNotifications ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full transition-all shadow-md ${formData.emailNotifications ? 'left-6 md:left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 pb-2">
              Privacy
            </h3>
            <div className="flex items-center justify-between p-4 md:p-5 bg-slate-50 rounded-xl md:rounded-2xl gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <div className="p-2.5 md:p-3 bg-white rounded-lg md:rounded-xl text-emerald-500 shadow-sm shrink-0">
                  <Eye className="w-5 h-5 md:w-5 md:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-800 text-sm md:text-base truncate">Show Online Status</h4>
                  <p className="text-[10px] md:text-[11px] font-bold text-slate-500 leading-snug mt-0.5 md:mt-1">
                    Let others see when you are active on SkillSwap.
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => handleToggle('showOnlineStatus')} 
                className={`shrink-0 w-12 h-7 md:w-14 md:h-8 rounded-full transition-colors relative cursor-pointer ${formData.showOnlineStatus ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full transition-all shadow-md ${formData.showOnlineStatus ? 'left-6 md:left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 md:pt-6 border-t-2 border-slate-100">
            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white p-4 md:p-5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-200 active:scale-95"
            >
              <Save size={18} className="md:w-5 md:h-5" /> Save Preferences
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}