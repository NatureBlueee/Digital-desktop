import React, { useState } from 'react';
import { Plus, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  updatedAt: string;
}

export const ClaudeProjects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'activity' | 'name'>('activity');

  // Sample projects matching the screenshot
  const projects: Project[] = [
    { id: '1', title: 'Nature设计师', updatedAt: '2 days ago' },
    { id: '2', title: '聊天', updatedAt: '29 days ago' },
    { id: '3', title: '论文写作版晨曦', updatedAt: '8 days ago' },
    { id: '4', title: '元提示词', updatedAt: '6 days ago' },
  ];

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-900">Projects</h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
              <Plus size={16} />
              New project
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-11 pr-4 py-3 border-2 border-[#D97757] rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:border-[#D97757] transition-colors"
            />
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
            <span>Sort by</span>
            <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-md transition-colors">
              <span className="font-medium text-gray-700">Activity</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                className="p-5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all cursor-pointer text-left group"
              >
                <h3 className="font-medium text-gray-900 text-base mb-12">
                  {project.title}
                </h3>
                <div className="text-xs text-gray-400">
                  Updated {project.updatedAt}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
