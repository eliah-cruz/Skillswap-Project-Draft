import { Match, Category, Review } from "../types";

export const SKILL_CATEGORIES = [
  "Development", "Design", "Languages", "Marketing", "Business", "Culinary", "Life Skills", "Music & Arts"
];

// Expanded with real-life skills
export const AVAILABLE_SKILLS = [
  "React", "Next.js", "Python", "JavaScript", "HTML/CSS", "C++", "Java", "Swift", "Kotlin", "Ruby", "PHP", "SQL", "DevOps", "Cybersecurity", "Blockchain",
  "Figma", "Photoshop", "UI/UX", "Video Editing", "Animation", "Illustrator", "Blender", "3D Modeling", "Branding", "Typography", "Prototyping",
  "SEO", "Copywriting", "Social Media", "Email Marketing", "Ads", "Strategy", "Content Creation", "Public Relations", "Analytics",
  "English", "Spanish", "Japanese", "Mandarin", "French", "German", "Arabic", "Korean", "Italian", "Portuguese", "Russian", "Sign Language",
  "Public Speaking", "Accounting", "Project Management", "Leadership", "Finance", "Sales", "Negotiation", "Startup Fundraising", "Business Law", "Math", "Science", "History", "Writing",
  "Baking", "Culinary Arts", "Vegan Cooking", "Meal Prep", "Sushi Making", "Cake Decorating", "Barista/Coffee Art", "Mixology", "BBQ & Grilling",
  "Carpentry", "Plumbing Basics", "Car Maintenance", "Gardening", "Sewing", "Knitting", "First Aid", "Fitness Training", "Yoga", "Meditation", "Personal Finance",
  "Piano", "Guitar", "Singing", "Photography", "Music Production", "Songwriting", "Violin", "Drums", "Painting", "Pottery", "Drawing"
];

const AVAIL = ["Flexible", "Weekdays", "Weekends", "Evenings Only", "Mornings Only"];
const LOCATIONS = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "Brazil", "Philippines"];
const LEVELS = ["Intermediate", "Advanced", "Expert"];

const getA = (i: number) => AVAIL[i % AVAIL.length];
const getL = (i: number) => LOCATIONS[i % LOCATIONS.length];
const getExp = (i: number) => LEVELS[i % LEVELS.length];

const generateReviews = (rating: number, name: string): Review[] => {
  if (rating < 4.0) {
    return [
      { id: Date.now().toString() + "1", reviewer: "Anonymous", rating: 2, comment: "Did not show up for the session." },
      { id: Date.now().toString() + "2", reviewer: "Alex", rating: 3, comment: "A bit unorganized, but okay." }
    ];
  }
  return [
    { id: Date.now().toString() + "3", reviewer: "Jamie", rating: 5, comment: `Amazing mentor! ${name} explains things perfectly.` },
    { id: Date.now().toString() + "4", reviewer: "Taylor", rating: 4, comment: "Very helpful and patient. I highly recommend!" }
  ];
};

const baseMatches = [
  { id: 1, name: "Elena Rossi", teaching: "Python", needs: "Design", rating: 4.9, avatar: "ER", status: "Online", category: "Development", title: "Senior Dev" },
  { id: 2, name: "Marcus Thorne", teaching: "Figma", needs: "French", rating: 4.8, avatar: "MT", status: "Away", category: "Design", title: "UI Designer" },
  { id: 3, name: "Spammer Steve", teaching: "Marketing", needs: "Figma", rating: 2.5, avatar: "SS", status: "Online", category: "Marketing", title: "Growth Lead" },
  { id: 4, name: "Julian Voss", teaching: "Figma", needs: "Python", rating: 4.7, avatar: "JV", status: "Online", category: "Design", title: "Product Designer" },
  { id: 5, name: "Alex Rivera", teaching: "React", needs: "SEO", rating: 4.6, avatar: "AR", status: "Online", category: "Development", title: "Frontend Dev" },
  { id: 6, name: "David Kim", teaching: "C++", needs: "Spanish", rating: 4.9, avatar: "DK", status: "Online", category: "Development", title: "Software Engineer" },
  { id: 7, name: "Maria Garcia", teaching: "Spanish", needs: "C++", rating: 4.8, avatar: "MG", status: "Away", category: "Languages", title: "Language Tutor" },
  { id: 8, name: "Olivia Pope", teaching: "Public Speaking", needs: "React", rating: 5.0, avatar: "OP", status: "Online", category: "Business", title: "Crisis Manager" },
  { id: 9, name: "Mark Cuban", teaching: "Startup Fundraising", needs: "Spanish", rating: 4.8, avatar: "MC", status: "Online", category: "Business", title: "Investor & Entrepreneur" },
  { id: 10, name: "Sarah Jenkins", teaching: "Accounting", needs: "Excel", rating: 4.7, avatar: "SJ", status: "Offline", category: "Business", title: "CPA" },
  { id: 11, name: "Rude User", teaching: "Sales", needs: "UI/UX", rating: 3.1, avatar: "RU", status: "Offline", category: "Business", title: "Sales Director" },
  { id: 12, name: "Gordon R.", teaching: "Culinary Arts", needs: "Yoga", rating: 4.9, avatar: "GR", status: "Online", category: "Culinary", title: "Executive Chef" },
  { id: 13, name: "Kenji Tanaka", teaching: "Sushi Making", needs: "English", rating: 4.6, avatar: "KT", status: "Online", category: "Culinary", title: "Sushi Chef" },
  { id: 14, name: "Bob Vila", teaching: "Carpentry", needs: "Social Media", rating: 4.8, avatar: "BV", status: "Away", category: "Life Skills", title: "Master Carpenter" },
  { id: 15, name: "Jane Fonda", teaching: "Fitness Training", needs: "Video Editing", rating: 5.0, avatar: "JF", status: "Online", category: "Life Skills", title: "Fitness Instructor" }
];

export const matches: Match[] = baseMatches.map((m, i) => ({
  ...m,
  status: m.status as "Online" | "Offline" | "Away",
  availability: getA(i),
  location: getL(i),
  experienceLevel: getExp(i),
  reviewCount: m.rating < 4.0 ? 2 : Math.floor(Math.random() * 20) + 5,
  reviews: generateReviews(m.rating, m.name)
}));

export const categories: Category[] = [
  { title: 'Development', desc: 'Web Apps, Mobile, & AI.', color: 'bg-blue-600', text: 'text-blue-600', icon: '🚀', skills: ['React', 'Next.js', 'Python', 'JavaScript', 'HTML/CSS', 'C++', 'Java', 'Swift', 'SQL', 'DevOps', 'Cybersecurity'] },
  { title: 'Design', desc: 'UI/UX, Motion, & 3D.', color: 'bg-purple-600', text: 'text-purple-600', icon: '🎨', skills: ['UI/UX', 'Figma', 'Photoshop', 'Video Editing', '3D Modeling', 'Branding', 'Typography', 'Prototyping'] },
  { title: 'Languages', desc: 'Spanish, French, & Japanese.', color: 'bg-orange-500', text: 'text-orange-500', icon: '🌍', skills: ['English', 'Spanish', 'Mandarin', 'French', 'Japanese', 'German', 'Arabic', 'Sign Language'] },
  { title: 'Business', desc: 'Leadership, Finance & Planning.', color: 'bg-slate-800', text: 'text-slate-800', icon: '💼', skills: ['Public Speaking', 'Accounting', 'Project Management', 'Leadership', 'Finance', 'Startup Fundraising', 'Sales'] },
  { title: 'Culinary', desc: 'Cooking, Baking, & Prep.', color: 'bg-rose-500', text: 'text-rose-500', icon: '🍳', skills: ['Baking', 'Culinary Arts', 'Vegan Cooking', 'Sushi Making', 'Barista/Coffee Art', 'BBQ & Grilling'] },
  { title: 'Life Skills', desc: 'Carpentry, Fitness, & DIY.', color: 'bg-teal-600', text: 'text-teal-600', icon: '🛠️', skills: ['Carpentry', 'Car Maintenance', 'Gardening', 'Fitness Training', 'Yoga', 'Personal Finance'] },
  { title: 'Marketing', desc: 'SEO, Content, & Strategy.', color: 'bg-emerald-500', text: 'text-emerald-500', icon: '📈', skills: ['SEO', 'Ads', 'Copywriting', 'Analytics', 'Email Marketing', 'Strategy', 'Social Media'] }
];