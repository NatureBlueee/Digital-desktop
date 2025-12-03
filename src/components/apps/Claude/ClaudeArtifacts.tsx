import React from 'react';
import { Search, FileCode, FileText, Image as ImageIcon, Layout } from 'lucide-react';

export const ClaudeArtifacts: React.FC = () => {
  const artifacts = [
    { id: 1, title: "Claude App Sidebar Component", type: "React", icon: FileCode, date: "Just now", content: "React component for the collapsible sidebar..." },
    { id: 2, title: "Project Status Report", type: "Markdown", icon: FileText, date: "2 hours ago", content: "# Project Status\n\n## Overview\nAll systems operational..." },
    { id: 3, title: "Logo Concepts", type: "SVG", icon: ImageIcon, date: "Yesterday", content: "<svg>...</svg>" },
    { id: 4, title: "Dashboard Layout", type: "HTML/CSS", icon: Layout, date: "2 days ago", content: "<div class='dashboard'>...</div>" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-white p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-medium text-gray-900">Artifacts</h1>
            <p className="text-gray-500 text-sm mt-1">View and manage content created by Claude</p>
          </div>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input 
               type="text" 
               placeholder="Search artifacts..." 
               className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-300 focus:bg-white transition-colors w-64" 
             />
          </div>
        </div>
        
        <div className="space-y-3">
           {artifacts.map((artifact) => (
             <div key={artifact.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                   <artifact.icon size={24} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2">
                     <h3 className="font-medium text-gray-900 truncate">{artifact.title}</h3>
                     <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full uppercase tracking-wide font-medium">{artifact.type}</span>
                   </div>
                   <p className="text-sm text-gray-500 truncate mt-0.5">{artifact.content}</p>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {artifact.date}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
