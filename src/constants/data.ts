import { Match, Category } from "../types";

// Randomly assign availability for testing
const AVAIL = ["Flexible", "Weekdays", "Weekends", "Evenings Only", "Mornings Only"];
const getA = (i: number) => AVAIL[i % AVAIL.length];

export const matches: Match[] = [
  // --- ORIGINAL & CORE TESTERS (1-12) ---
  { id: 1, name: "Elena Rossi", teaching: "Python", needs: "Design", rating: 4.9, avatar: "ER", status: "Online", category: "Development", title: "Senior Dev", availability: getA(1) },
  { id: 2, name: "Marcus Thorne", teaching: "Figma", needs: "French", rating: 4.8, avatar: "MT", status: "Away", category: "Languages", title: "UI Designer", availability: getA(2) },
  { id: 3, name: "Sarah Chen", teaching: "Marketing", needs: "Figma", rating: 5.0, avatar: "SC", status: "Online", category: "Marketing", title: "Growth Lead", availability: getA(3) },
  { id: 4, name: "Julian Voss", teaching: "Figma", needs: "Python", rating: 4.7, avatar: "JV", status: "Online", category: "Design", title: "Product Designer", availability: getA(4) },
  { id: 5, name: "Alex Rivera", teaching: "React", needs: "SEO", rating: 4.6, avatar: "AR", status: "Online", category: "Development", title: "Frontend Dev", availability: getA(0) },
  { id: 6, name: "David Kim", teaching: "C++", needs: "Spanish", rating: 4.9, avatar: "DK", status: "Online", category: "Development", title: "Software Engineer", availability: getA(1) },
  { id: 7, name: "Maria Garcia", teaching: "Spanish", needs: "C++", rating: 4.8, avatar: "MG", status: "Away", category: "Languages", title: "Language Tutor", availability: getA(2) },
  { id: 8, name: "Liam Smith", teaching: "UI/UX", needs: "SEO", rating: 5.0, avatar: "LS", status: "Online", category: "Design", title: "UX Researcher", availability: getA(3) },
  { id: 9, name: "Chloe Jones", teaching: "SEO", needs: "DevOps", rating: 4.5, avatar: "CJ", status: "Online", category: "Marketing", title: "SEO Specialist", availability: getA(4) },
  { id: 10, name: "Noah Williams", teaching: "DevOps", needs: "UI/UX", rating: 4.7, avatar: "NW", status: "Offline", category: "Development", title: "Cloud Architect", availability: getA(0) },
  { id: 11, name: "Aisha Patel", teaching: "3D Modeling", needs: "Copywriting", rating: 4.9, avatar: "AP", status: "Online", category: "Design", title: "3D Artist", availability: getA(1) },
  { id: 12, name: "Kenji Tanaka", teaching: "Japanese", needs: "Web Apps", rating: 4.6, avatar: "KT", status: "Online", category: "Languages", title: "Translator", availability: getA(2) },

  // --- BATCH 2: EXPANDED NETWORK (13-25) ---
  { id: 13, name: "Sophie Clark", teaching: "Mobile", needs: "Branding", rating: 4.8, avatar: "SC", status: "Online", category: "Development", title: "iOS Developer", availability: getA(3) },
  { id: 14, name: "Omar Farooq", teaching: "Branding", needs: "Mobile", rating: 4.9, avatar: "OF", status: "Online", category: "Design", title: "Brand Strategist", availability: getA(4) },
  { id: 15, name: "Emma Wilson", teaching: "Cybersecurity", needs: "Mandarin", rating: 5.0, avatar: "EW", status: "Offline", category: "Development", title: "Security Analyst", availability: getA(0) },
  { id: 16, name: "Wei Chen", teaching: "Mandarin", needs: "Cybersecurity", rating: 4.7, avatar: "WC", status: "Online", category: "Languages", title: "Native Speaker", availability: getA(1) },
  { id: 17, name: "James Taylor", teaching: "Analytics", needs: "Email Marketing", rating: 4.6, avatar: "JT", status: "Online", category: "Marketing", title: "Data Analyst", availability: getA(2) },
  { id: 18, name: "Mia Davis", teaching: "Email Marketing", needs: "Web Apps", rating: 4.8, avatar: "MD", status: "Away", category: "Marketing", title: "Campaign Manager", availability: getA(3) },
  { id: 19, name: "Lucas Brown", teaching: "Web Apps", needs: "Analytics", rating: 4.9, avatar: "LB", status: "Online", category: "Development", title: "Full Stack Dev", availability: getA(4) },
  { id: 20, name: "Isabella Martinez", teaching: "Typography", needs: "Ads", rating: 4.5, avatar: "IM", status: "Online", category: "Design", title: "Graphic Designer", availability: getA(0) },
  { id: 21, name: "Ethan White", teaching: "Ads", needs: "German", rating: 4.7, avatar: "EW", status: "Offline", category: "Marketing", title: "PPC Specialist", availability: getA(1) },
  { id: 22, name: "Anna Müller", teaching: "German", needs: "3D Modeling", rating: 5.0, avatar: "AM", status: "Online", category: "Languages", title: "Native Speaker", availability: getA(2) },
  { id: 23, name: "Jackson Lee", teaching: "Prototyping", needs: "Python", rating: 4.8, avatar: "JL", status: "Online", category: "Design", title: "UX Designer", availability: getA(3) },
  { id: 24, name: "Fatima Ali", teaching: "Arabic", needs: "Copywriting", rating: 4.9, avatar: "FA", status: "Away", category: "Languages", title: "Linguist", availability: getA(4) },
  { id: 25, name: "Daniel Harris", teaching: "Strategy", needs: "Mobile", rating: 4.6, avatar: "DH", status: "Online", category: "Marketing", title: "Marketing Director", availability: getA(0) },

  // --- BATCH 3: DUPLICATE SKILLS FOR MARKETPLACE CHOICES (26-35) ---
  { id: 26, name: "Maya Lin", teaching: "Figma", needs: "Mobile", rating: 4.9, avatar: "ML", status: "Online", category: "Design", title: "UI Designer", availability: getA(1) },
  { id: 27, name: "Carlos Ruiz", teaching: "Figma", needs: "SEO", rating: 4.5, avatar: "CR", status: "Away", category: "Design", title: "Web Designer", availability: getA(2) },
  { id: 28, name: "Rachel Green", teaching: "Python", needs: "UI/UX", rating: 5.0, avatar: "RG", status: "Online", category: "Development", title: "Data Scientist", availability: getA(3) },
  { id: 29, name: "Samir Patel", teaching: "Python", needs: "Ads", rating: 4.8, avatar: "SP", status: "Offline", category: "Development", title: "Backend Dev", availability: getA(4) },
  { id: 30, name: "Jessica Wu", teaching: "SEO", needs: "Figma", rating: 4.7, avatar: "JW", status: "Online", category: "Marketing", title: "Growth Hacker", availability: getA(0) },
  { id: 31, name: "Tom Baker", teaching: "SEO", needs: "C++", rating: 4.6, avatar: "TB", status: "Online", category: "Marketing", title: "Digital Marketer", availability: getA(1) },
  { id: 32, name: "Elena Gomez", teaching: "Spanish", needs: "Web Apps", rating: 4.9, avatar: "EG", status: "Online", category: "Languages", title: "Professor", availability: getA(2) },
  { id: 33, name: "Diego Silva", teaching: "Spanish", needs: "Python", rating: 4.8, avatar: "DS", status: "Away", category: "Languages", title: "Translator", availability: getA(3) },
  { id: 34, name: "Nina Ivanova", teaching: "UI/UX", needs: "Python", rating: 5.0, avatar: "NI", status: "Online", category: "Design", title: "Product Manager", availability: getA(4) },
  { id: 35, name: "Chris Evans", teaching: "UI/UX", needs: "Spanish", rating: 4.7, avatar: "CE", status: "Online", category: "Design", title: "Creative Director", availability: getA(0) },

  // --- BATCH 4: THE MASSIVE EXPANSION (36-60) ---
  { id: 36, name: "Kevin Tran", teaching: "Web Apps", needs: "Typography", rating: 4.8, avatar: "KT", status: "Online", category: "Development", title: "React Specialist", availability: getA(1) },
  { id: 37, name: "Laura Croft", teaching: "Web Apps", needs: "Strategy", rating: 4.9, avatar: "LC", status: "Offline", category: "Development", title: "Web Developer", availability: getA(2) },
  { id: 38, name: "Marcus Johnson", teaching: "Mobile", needs: "3D Modeling", rating: 4.4, avatar: "MJ", status: "Online", category: "Development", title: "Android Dev", availability: getA(3) },
  { id: 39, name: "Sarah Connor", teaching: "Mobile", needs: "French", rating: 4.7, avatar: "SC", status: "Away", category: "Development", title: "Flutter Engineer", availability: getA(4) },
  { id: 40, name: "Felix Wagner", teaching: "Copywriting", needs: "Web Apps", rating: 4.9, avatar: "FW", status: "Online", category: "Marketing", title: "Content Writer", availability: getA(0) },
  { id: 41, name: "Amira Hassan", teaching: "Copywriting", needs: "Python", rating: 4.6, avatar: "AH", status: "Online", category: "Marketing", title: "Technical Writer", availability: getA(1) },
  { id: 42, name: "Zack Miller", teaching: "Ads", needs: "Mobile", rating: 4.5, avatar: "ZM", status: "Online", category: "Marketing", title: "Ad Buyer", availability: getA(2) },
  { id: 43, name: "Penelope Cruz", teaching: "Ads", needs: "Prototyping", rating: 4.8, avatar: "PC", status: "Offline", category: "Marketing", title: "Marketing Exec", availability: getA(3) },
  { id: 44, name: "Yuto Takahashi", teaching: "Japanese", needs: "Cybersecurity", rating: 5.0, avatar: "YT", status: "Online", category: "Languages", title: "Localization Expert", availability: getA(4) },
  { id: 45, name: "Camille Laurent", teaching: "French", needs: "Branding", rating: 4.9, avatar: "CL", status: "Online", category: "Languages", title: "French Tutor", availability: getA(0) },
  { id: 46, name: "Antoine Dupont", teaching: "French", needs: "C++", rating: 4.7, avatar: "AD", status: "Away", category: "Languages", title: "Software Engineer", availability: getA(1) },
  { id: 47, name: "Hassan Rey", teaching: "Arabic", needs: "DevOps", rating: 4.8, avatar: "HR", status: "Online", category: "Languages", title: "IT Consultant", availability: getA(2) },
  { id: 48, name: "Leo Vance", teaching: "3D Modeling", needs: "Web Apps", rating: 4.9, avatar: "LV", status: "Online", category: "Design", title: "Game Designer", availability: getA(3) },
  { id: 49, name: "Priya Sharma", teaching: "3D Modeling", needs: "Analytics", rating: 4.6, avatar: "PS", status: "Offline", category: "Design", title: "CGI Artist", availability: getA(4) },
  { id: 50, name: "Tariq Ali", teaching: "Branding", needs: "Email Marketing", rating: 4.5, avatar: "TA", status: "Online", category: "Design", title: "Art Director", availability: getA(0) },
  { id: 51, name: "Diana Prince", teaching: "Branding", needs: "Copywriting", rating: 5.0, avatar: "DP", status: "Online", category: "Design", title: "Brand Consultant", availability: getA(1) },
  { id: 52, name: "Bruce Wayne", teaching: "Typography", needs: "Strategy", rating: 4.8, avatar: "BW", status: "Away", category: "Design", title: "Print Designer", availability: getA(2) },
  { id: 53, name: "Clark Kent", teaching: "Prototyping", needs: "DevOps", rating: 4.7, avatar: "CK", status: "Online", category: "Design", title: "Product Manager", availability: getA(3) },
  { id: 54, name: "Lin Zhao", teaching: "C++", needs: "Analytics", rating: 4.9, avatar: "LZ", status: "Online", category: "Development", title: "Systems Programmer", availability: getA(4) },
  { id: 55, name: "Rajesh Koothrappali", teaching: "Python", needs: "Japanese", rating: 4.8, avatar: "RK", status: "Offline", category: "Development", title: "Astrophysicist", availability: getA(0) },
  { id: 56, name: "Sheldon Cooper", teaching: "DevOps", needs: "Mandarin", rating: 4.6, avatar: "SC", status: "Online", category: "Development", title: "Server Admin", availability: getA(1) },
  { id: 57, name: "Howard Wolowitz", teaching: "Cybersecurity", needs: "Prototyping", rating: 4.5, avatar: "HW", status: "Online", category: "Development", title: "Network Security", availability: getA(2) },
  { id: 58, name: "Leonard Hofstadter", teaching: "Analytics", needs: "Figma", rating: 4.7, avatar: "LH", status: "Away", category: "Marketing", title: "Data Scientist", availability: getA(3) },
  { id: 59, name: "Penny Teller", teaching: "Email Marketing", needs: "Typography", rating: 4.9, avatar: "PT", status: "Online", category: "Marketing", title: "Comms Director", availability: getA(4) },
  { id: 60, name: "Amy Fowler", teaching: "Strategy", needs: "French", rating: 5.0, avatar: "AF", status: "Online", category: "Marketing", title: "Operations Lead", availability: getA(0) }
];

export const categories: Category[] = [
  { title: 'Development', desc: 'Web Apps, Mobile, & AI.', color: 'bg-blue-600', text: 'text-blue-600', icon: '🚀', skills: ['Web Apps', 'Mobile', 'C++', 'Python', 'DevOps', 'Cybersecurity'] },
  { title: 'Design', desc: 'UI/UX, Motion, & 3D.', color: 'bg-purple-600', text: 'text-purple-600', icon: '🎨', skills: ['UI/UX', 'Figma', '3D Modeling', 'Branding', 'Typography', 'Prototyping'] },
  { title: 'Languages', desc: 'Spanish, French, & Japanese.', color: 'bg-orange-500', text: 'text-orange-500', icon: '🌍', skills: ['Spanish', 'Mandarin', 'French', 'Japanese', 'German', 'Arabic'] },
  { title: 'Marketing', desc: 'SEO, Content, & Strategy.', color: 'bg-emerald-500', text: 'text-emerald-500', icon: '📈', skills: ['SEO', 'Ads', 'Copywriting', 'Analytics', 'Email Marketing', 'Strategy'] }
];