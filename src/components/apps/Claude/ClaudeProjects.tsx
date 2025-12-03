import React from 'react';
import { Plus, Book, Code, Sparkles } from 'lucide-react';

export const ClaudeProjects: React.FC = () => {
  const projects = [
    { id: 1, title: "Personal Website Redesign", description: "Context and assets for the new portfolio site", icon: Sparkles, color: "bg-amber-100 text-amber-700", date: "Updated 2 hours ago" },
    { id: 2, title: "React Component Library", description: "Design system documentation and snippets", icon: Code, color: "bg-blue-100 text-blue-700", date: "Updated yesterday" },
    { id: 3, title: "Creative Writing Helper", description: "Character sheets and plot outlines", icon: Book, color: "bg-emerald-100 text-emerald-700", date: "Updated 3 days ago" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-white p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-medium text-gray-900">Projects</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your knowledge bases and focused chats</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#D97757] text-white rounded-lg hover:bg-[#c56a4c] transition-colors text-sm font-medium shadow-sm">
            <Plus size={16} />
            Create Project
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {projects.map((project) => (
             <div key={project.id} className="p-5 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all cursor-pointer bg-white group">
                <div className={`w-10 h-10 ${project.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <project.icon size={20} />
                </div>
                <h3 className="font-medium text-gray-900 text-lg">{project.title}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{project.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>{project.date}</span>
                </div>
             </div>
           ))}
           
           <button className="p-5 border border-dashed border-gray-300 rounded-xl hover:border-[#D97757] hover:bg-[#D97757]/5 transition-all cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-[#D97757] gap-2 min-h-[200px]">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus size={20} />
              </div>
              <span className="font-medium">New Project</span>
           </button>
        </div>
      </div>
    </div>
  );
};
