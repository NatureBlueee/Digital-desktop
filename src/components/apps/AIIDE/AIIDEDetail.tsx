import React from 'react';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Check,
  Users,
  Calendar,
  Laptop2,
  Code2,
  Cpu,
  Bot,
  Wand2,
  Search,
  Server,
  Sparkles,
  CheckCircle,
  Layers,
  LayoutDashboard,
  FileBox,
  Settings2,
  Import,
  GitBranch,
  Files,
  Zap,
  Eye,
  Shield,
  Puzzle,
  Gauge,
  Github,
  Lightbulb,
  Lock,
  HardDrive,
  Wrench,
  Mic,
  GitPullRequest
} from 'lucide-react';
import type { AIIDEInfo } from '@/types/ai-ide';

interface AIIDEDetailProps {
  ide: AIIDEInfo;
  onBack: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users size={18} />,
  Wand2: <Wand2 size={18} />,
  Search: <Search size={18} />,
  Server: <Server size={18} />,
  Sparkles: <Sparkles size={18} />,
  CheckCircle: <CheckCircle size={18} />,
  Bot: <Bot size={18} />,
  Layers: <Layers size={18} />,
  LayoutDashboard: <LayoutDashboard size={18} />,
  FileBox: <FileBox size={18} />,
  Settings2: <Settings2 size={18} />,
  Import: <Import size={18} />,
  GitBranch: <GitBranch size={18} />,
  Files: <Files size={18} />,
  Zap: <Zap size={18} />,
  Eye: <Eye size={18} />,
  Shield: <Shield size={18} />,
  Puzzle: <Puzzle size={18} />,
  Gauge: <Gauge size={18} />,
  Github: <Github size={18} />,
  Lightbulb: <Lightbulb size={18} />,
  Lock: <Lock size={18} />,
  HardDrive: <HardDrive size={18} />,
  Wrench: <Wrench size={18} />,
  Laptop2: <Laptop2 size={18} />,
  Mic: <Mic size={18} />,
  GitPullRequest: <GitPullRequest size={18} />,
};

export const AIIDEDetail: React.FC<AIIDEDetailProps> = ({ ide, onBack }) => {
  return (
    <div className="flex-1 overflow-auto">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-slate-900 border-b border-slate-700/50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-5" />

        <div className="relative p-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back to all IDEs</span>
          </button>

          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-slate-800/80 border border-slate-700/50 p-3 flex items-center justify-center">
              <img
                src={ide.logo}
                alt={ide.name}
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://img.icons8.com/fluency/96/code.png';
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{ide.name}</h1>
                {ide.stats?.rating && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm">
                    <Star size={14} fill="currentColor" />
                    {ide.stats.rating}
                  </div>
                )}
              </div>

              <p className="text-slate-400 mb-1">{ide.company}</p>
              <p className="text-lg text-violet-300 font-medium mb-4">{ide.tagline}</p>

              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  Since {ide.releaseYear}
                </span>
                <span className="flex items-center gap-1.5">
                  <Laptop2 size={14} />
                  {ide.platform.join(', ')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Code2 size={14} />
                  {ide.baseEditor}
                </span>
                {ide.stats?.users && (
                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {ide.stats.users} users
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <a
              href={ide.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors font-medium"
            >
              Visit Website
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          {/* Description */}
          <div className="mb-10">
            <p className="text-slate-300 text-lg leading-relaxed">{ide.description}</p>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {ide.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-2 text-violet-400 mb-1">
                  <Sparkles size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Highlight</span>
                </div>
                <p className="text-sm text-slate-300">{highlight}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu size={20} className="text-violet-400" />
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ide.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-violet-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center">
                      {iconMap[feature.icon] || <Bot size={18} />}
                    </div>
                    <h3 className="font-medium text-white">{feature.name}</h3>
                  </div>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Zap size={20} className="text-violet-400" />
              Pricing Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ide.pricing.map((tier, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-5 rounded-xl border transition-colors",
                    tier.recommended
                      ? "bg-violet-500/10 border-violet-500/50"
                      : "bg-slate-800/30 border-slate-700/30"
                  )}
                >
                  {tier.recommended && (
                    <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-violet-500 text-white rounded mb-2">
                      Recommended
                    </span>
                  )}
                  <h3 className="font-medium text-white">{tier.name}</h3>
                  <div className="text-2xl font-bold text-white mt-1 mb-3">{tier.price}</div>
                  <ul className="space-y-2">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                        <Check size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Models */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Bot size={20} className="text-violet-400" />
              Supported AI Models
            </h2>
            <div className="flex flex-wrap gap-2">
              {ide.models.map((model, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700/50 text-sm text-slate-300"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
