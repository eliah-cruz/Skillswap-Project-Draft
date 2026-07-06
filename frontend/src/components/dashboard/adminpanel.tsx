// components/dashboard/adminpanel.tsx

"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Shield, Users, Repeat, Coins, Flag, AlertTriangle, ShieldCheck, Unlock, X } from 'lucide-react';

export default function AdminPanel({ state, setters, actions }: any) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMatches: 0,
    totalHoursInPool: 0,
    totalReports: 0
  });
  const [reports, setReports] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Filter out resolved or dismissed reports dynamically so they slide out of view
  const activeReports = reports.filter(report => report.status === 'Pending' || report.status === 'Reviewed');

  useEffect(() => {
    fetchAdminAnalytics();

    // Listen to real-time status updates of reports in the database
    const reportsChannel = supabase
      .channel('realtime-admin-reports')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'reports' }, (payload) => {
        const updatedReport = payload.new as any;
        if (updatedReport) {
          setReports((prev) =>
            prev.map((r) => {
              if (r.report_id === updatedReport.report_id) {
                return { ...r, status: updatedReport.status };
              }
              return r;
            })
          );
          fetchAdminAnalyticsCounters();
        }
      })
      .subscribe();

    // Real-time updates via Socket.io broadcast [15, 16]
    const s = state.socket;
    if (s) {
      s.on('report_status_changed', ({ report_id, status }: any) => {
        setReports((prev) =>
          prev.map((r) => {
            if (r.report_id === report_id) {
              return { ...r, status };
            }
            return r;
          })
        );
        fetchAdminAnalyticsCounters();
      });
    }

    return () => {
      supabase.removeChannel(reportsChannel);
      if (s) {
        s.off('report_status_changed');
      }
    };
  }, [state.socket]);

  const fetchAdminAnalyticsCounters = async () => {
    try {
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: matchesCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true });

      const { data: hoursData } = await supabase
        .from('users')
        .select('hours_balance');
      const totalHours = hoursData ? hoursData.reduce((sum, u) => sum + (u.hours_balance || 0), 0) : 0;

      const { data: reportsData } = await supabase
        .from('reports')
        .select('status');
      
      const activeCount = reportsData ? reportsData.filter(r => r.status === 'Pending' || r.status === 'Reviewed').length : 0;

      setStats((prev) => ({
        ...prev,
        totalUsers: usersCount || 0,
        totalMatches: matchesCount || 0,
        totalHoursInPool: totalHours,
        totalReports: activeCount
      }));
    } catch (err) {
      console.error('Error fetching counters:', err);
    }
  };

  const fetchAdminAnalytics = async () => {
    setLoadingStats(true);
    try {
      const { data: reportsList } = await supabase
        .from('reports')
        .select('*');

      const { data: usersList } = await supabase
        .from('users')
        .select('user_id, username');

      const formattedReports = (reportsList || []).map(report => {
        const reporterUser = usersList ? usersList.find(u => u.user_id === report.reporter_id) : null;
        const reportedUser = usersList ? usersList.find(u => u.user_id === report.reported_id) : null;
        return {
          ...report,
          reporter: { username: reporterUser ? reporterUser.username : "Anonymous" },
          reported: { username: reportedUser ? reportedUser.username : "Unknown" }
        };
      });

      const activeReportsCount = formattedReports.filter(r => r.status === 'Pending' || r.status === 'Reviewed').length;

      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: matchesCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true });

      const { data: hoursData } = await supabase
        .from('users')
        .select('hours_balance');
      const totalHours = hoursData ? hoursData.reduce((sum, u) => sum + (u.hours_balance || 0), 0) : 0;

      setStats({
        totalUsers: usersCount || 0,
        totalMatches: matchesCount || 0,
        totalHoursInPool: totalHours,
        totalReports: activeReportsCount
      });

      setReports(formattedReports);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Infraction confirmed: Mark as Resolved (Keep blocked) [19, 21]
  const handleResolveReport = async (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.report_id === reportId) {
          return { ...r, status: 'Resolved' };
        }
        return r;
      })
    );

    setStats((prev) => ({
      ...prev,
      totalReports: Math.max(0, prev.totalReports - 1)
    }));

    await actions.resolveReport(reportId, 'Resolved');
  };

  // False Alarm: Mark as Dismissed (Automatically unblock user) [19, 21]
  const handleDismissReport = async (reportId: string, reporterId: string, reportedId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.report_id === reportId) {
          return { ...r, status: 'Dismissed' };
        }
        return r;
      })
    );

    setStats((prev) => ({
      ...prev,
      totalReports: Math.max(0, prev.totalReports - 1)
    }));

    await actions.resolveReport(reportId, 'Dismissed', reporterId, reportedId);
  };

  return (
    <section className="container mx-auto px-5 py-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden border border-slate-800 text-left">
        <div className="absolute -right-8 -bottom-8 opacity-5 text-slate-400">
          <Shield size={180} />
        </div>
        <div className="relative z-10">
          <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
            Security Control Console
          </span>
          <h1 className="text-4xl font-black mt-4">System Administration</h1>
          <p className="text-slate-400 text-sm mt-2">Monitor system-wide barter hours, active matching links, and safety moderation reports.</p>
        </div>
      </div>

      {/* Analytics Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex items-center gap-6 text-left">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
            <Users size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Members</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{loadingStats ? "..." : stats.totalUsers}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex items-center gap-6 text-left">
          <div className="p-4 bg-teal-50 text-teal-600 rounded-2xl shrink-0">
            <Repeat size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Swaps</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{loadingStats ? "..." : stats.totalMatches}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex items-center gap-6 text-left">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
            <Coins size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Traded Hours Pool</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{loadingStats ? "..." : `${stats.totalHoursInPool} HR`}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex items-center gap-6 text-left">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl shrink-0">
            <Flag size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Reports</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{loadingStats ? "..." : stats.totalReports}</p>
          </div>
        </div>
      </div>

      {/* Moderation Section */}
      <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-sm text-left">
        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <Shield className="text-red-500" size={24} />
          Safety Moderation Queue
        </h3>

        {activeReports.length > 0 ? (
          <div className="space-y-4">
            {activeReports.map((report) => (
              <div key={report.report_id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-4">
                  <div className="p-3 bg-red-100 text-red-500 rounded-2xl shrink-0 h-fit">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-sm">
                      Report against: <span className="text-red-600 font-bold">{report.reported?.username || "Unknown"}</span>
                    </h5>
                    <p className="text-xs text-slate-500 mt-1">
                      Submitted by: <span className="text-slate-800 font-semibold">{report.reporter?.username || "Anonymous"}</span> • Reason: <span className="font-bold text-slate-700">{report.reason}</span>
                    </p>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mt-2">Status: {report.status}</p>
                  </div>
                </div>

                {/* Secure Resolution Buttons [20] */}
                <div className="flex flex-wrap gap-3 shrink-0 self-end sm:self-center">
                  
                  {/* Action 1: Dismiss Report (Programmatically deletes the block record on Supabase) [19] */}
                  <button 
                    onClick={() => handleDismissReport(report.report_id, report.reporter_id, report.reported_id)}
                    className="cursor-pointer bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-100 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    <Unlock size={16} /> Dismiss & Unblock
                  </button>

                  {/* Action 2: Uphold Report (Keeps block on the database) [19] */}
                  <button 
                    onClick={() => handleResolveReport(report.report_id)}
                    className="cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shadow-emerald-100"
                  >
                    <ShieldCheck size={16} /> Confirm & Resolve
                  </button>
                  
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border-4 border-dashed border-slate-100 rounded-[2rem]">
            <ShieldCheck size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Clear Queue</p>
            <p className="text-xs text-slate-400 font-medium mt-1">There are no active safety reports requiring administrative action.</p>
          </div>
        )}
      </div>

    </section>
  );
}