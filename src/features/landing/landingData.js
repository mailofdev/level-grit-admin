import { FaComments, FaChartBar, FaRocket, FaUserPlus, FaEye, FaHeart } from "react-icons/fa";

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
];

export const features = [
  {
    icon: <FaComments size={32} />,
    title: "💬 Engage Clients Daily",
    desc: "Chat, motivate, and inspire consistency without juggling multiple apps. Keep your clients connected and accountable.",
    bg: "bg-primary",
  },
  {
    icon: <FaChartBar size={32} />,
    title: "📊 Track Progress Effortlessly",
    desc: "Macro tracking, meal snapshots, and fitness logs in one clear view. Data visualization that makes sense.",
    bg: "bg-success",
  },
  {
    icon: <FaRocket size={32} />,
    title: "🚀 Save Time, Coach More",
    desc: "AI handles the data grunt work so you can focus on personal coaching. Scale your impact without burning out.",
    bg: "bg-warning",
  },
];

export const steps = [
  {
    number: "1",
    icon: <FaUserPlus size={40} className="text-primary" />,
    title: "Onboard Clients Easily",
    desc: "No messy spreadsheets, just simple client profiles. Get your clients set up in minutes, not hours.",
    color: "bg-primary",
  },
  {
    number: "2",
    icon: <FaEye size={40} className="text-success" />,
    title: "Monitor & Motivate",
    desc: "Daily check-ins, chats, and progress snapshots. Stay connected with your clients every step of the way.",
    color: "bg-success",
  },
  {
    number: "3",
    icon: <FaHeart size={40} className="text-warning" />,
    title: "Grow Your Impact",
    desc: "Deliver results at scale while building deeper relationships. Transform lives, not just bodies.",
    color: "bg-warning",
  },
];

export const testimonial = {
  name: "Jessica Martinez",
  role: "Certified Personal Trainer",
  text: `"This tool cut my admin time in half — now I coach more people and they love the daily check-ins. My clients are more engaged than ever, and I can focus on what I do best: coaching."`,
};
