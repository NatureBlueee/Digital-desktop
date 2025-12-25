import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, X, Star, ExternalLink } from 'lucide-react';
import { aiIDEData } from '@/lib/data/ai-ide-data';

export const AIIDECompare: React.FC = () => {
  const [selectedIDEs, setSelectedIDEs] = useState<string[]>(['cursor', 'windsurf', 'antigravity']);

  const toggleIDE = (id: string) => {
    if (selectedIDEs.includes(id)) {
      if (selectedIDEs.length > 2) {
        setSelectedIDEs(selectedIDEs.filter(i => i !== id));
      }
    } else {
      setSelectedIDEs([...selectedIDEs, id]);
    }
  };

  const compareIDEs = aiIDEData.filter(ide => selectedIDEs.includes(ide.id));

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        {/* IDE Selector */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Select IDEs to Compare</h2>
          <div className="flex flex-wrap gap-2">
            {aiIDEData.map((ide) => (
              <button
                key={ide.id}
                onClick={() => toggleIDE(ide.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
                  selectedIDEs.includes(ide.id)
                    ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600"
                )}
              >
                <img
                  src={ide.logo}
                  alt={ide.name}
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://img.icons8.com/fluency/96/code.png';
                  }}
                />
                <span className="text-sm font-medium">{ide.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 bg-slate-800/50 border-b border-slate-700/50 text-slate-400 font-medium w-48">
                  Feature
                </th>
                {compareIDEs.map((ide) => (
                  <th
                    key={ide.id}
                    className="p-4 bg-slate-800/50 border-b border-slate-700/50 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={ide.logo}
                        alt={ide.name}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://img.icons8.com/fluency/96/code.png';
                        }}
                      />
                      <span className="text-white font-semibold">{ide.name}</span>
                      <span className="text-xs text-slate-500">{ide.company}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Rating */}
              <CompareRow label="Rating">
                {compareIDEs.map((ide) => (
                  <td key={ide.id} className="p-4 border-b border-slate-700/30 text-center">
                    {ide.stats?.rating ? (
                      <div className="flex items-center justify-center gap-1 text-amber-400">
                        <Star size={16} fill="currentColor" />
                        <span className="font-semibold">{ide.stats.rating}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                ))}
              </CompareRow>

              {/* Price */}
              <CompareRow label="Price (Pro)">
                {compareIDEs.map((ide) => {
                  const proPlan = ide.pricing.find(p => p.recommended) || ide.pricing[0];
                  return (
                    <td key={ide.id} className="p-4 border-b border-slate-700/30 text-center">
                      <span className={cn(
                        "font-semibold",
                        proPlan.price === 'Free' ? "text-green-400" : "text-white"
                      )}>
                        {proPlan.price}
                      </span>
                    </td>
                  );
                })}
              </CompareRow>

              {/* Base Editor */}
              <CompareRow label="Base Editor">
                {compareIDEs.map((ide) => (
                  <td key={ide.id} className="p-4 border-b border-slate-700/30 text-center text-slate-300">
                    {ide.baseEditor}
                  </td>
                ))}
              </CompareRow>

              {/* Users */}
              <CompareRow label="Users">
                {compareIDEs.map((ide) => (
                  <td key={ide.id} className="p-4 border-b border-slate-700/30 text-center text-slate-300">
                    {ide.stats?.users || '-'}
                  </td>
                ))}
              </CompareRow>

              {/* Release Year */}
              <CompareRow label="Release Year">
                {compareIDEs.map((ide) => (
                  <td key={ide.id} className="p-4 border-b border-slate-700/30 text-center text-slate-300">
                    {ide.releaseYear}
                  </td>
                ))}
              </CompareRow>

              {/* Multi-Agent */}
              <CompareRow label="Multi-Agent">
                {compareIDEs.map((ide) => (
                  <td key={ide.id} className="p-4 border-b border-slate-700/30 text-center">
                    <FeatureCheck
                      value={
                        ide.id === 'cursor' ? '8 parallel' :
                        ide.id === 'antigravity' ? 'Unlimited' :
                        ide.id === 'windsurf' ? 'Yes' :
                        ide.id === 'copilot' ? 'Yes' :
                        'Yes'
                      }
                    />
                  </td>
                ))}
              </CompareRow>

              {/* Background Agents */}
              <CompareRow label="Background Agents">
                {compareIDEs.map((ide) => (
                  <td key={ide.id} className="p-4 border-b border-slate-700/30 text-center">
                    <FeatureCheck
                      value={ide.id === 'cursor' || ide.id === 'copilot'}
                    />
                  </td>
                ))}
              </CompareRow>

              {/* Local Models */}
              <CompareRow label="Local Models">
                {compareIDEs.map((ide) => (
                  <td key={ide.id} className="p-4 border-b border-slate-700/30 text-center">
                    <FeatureCheck
                      value={ide.id !== 'antigravity'}
                    />
                  </td>
                ))}
              </CompareRow>

              {/* Enterprise/Self-Host */}
              <CompareRow label="Self-Host Option">
                {compareIDEs.map((ide) => (
                  <td key={ide.id} className="p-4 border-b border-slate-700/30 text-center">
                    <FeatureCheck
                      value={ide.id === 'windsurf' || ide.id === 'zed'}
                    />
                  </td>
                ))}
              </CompareRow>

              {/* Open Source */}
              <CompareRow label="Open Source">
                {compareIDEs.map((ide) => (
                  <td key={ide.id} className="p-4 border-b border-slate-700/30 text-center">
                    <FeatureCheck value={ide.id === 'zed'} />
                  </td>
                ))}
              </CompareRow>

              {/* Platforms */}
              <CompareRow label="Platforms">
                {compareIDEs.map((ide) => (
                  <td key={ide.id} className="p-4 border-b border-slate-700/30 text-center text-sm text-slate-300">
                    {ide.platform.join(', ')}
                  </td>
                ))}
              </CompareRow>

              {/* Models */}
              <CompareRow label="AI Models">
                {compareIDEs.map((ide) => (
                  <td key={ide.id} className="p-4 border-b border-slate-700/30 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {ide.models.slice(0, 3).map((model, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs rounded bg-slate-700/50 text-slate-300"
                        >
                          {model.split(' ')[0]}
                        </span>
                      ))}
                      {ide.models.length > 3 && (
                        <span className="text-xs text-slate-500">+{ide.models.length - 3}</span>
                      )}
                    </div>
                  </td>
                ))}
              </CompareRow>

              {/* Website */}
              <CompareRow label="Website">
                {compareIDEs.map((ide) => (
                  <td key={ide.id} className="p-4 border-b border-slate-700/30 text-center">
                    <a
                      href={ide.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 text-sm"
                    >
                      Visit
                      <ExternalLink size={12} />
                    </a>
                  </td>
                ))}
              </CompareRow>
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-green-400" />
            <span>Supported</span>
          </div>
          <div className="flex items-center gap-2">
            <X size={16} className="text-slate-600" />
            <span>Not Supported</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompareRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <tr className="hover:bg-slate-800/20">
    <td className="p-4 border-b border-slate-700/30 text-slate-400 font-medium">
      {label}
    </td>
    {children}
  </tr>
);

const FeatureCheck: React.FC<{ value: boolean | string }> = ({ value }) => {
  if (typeof value === 'string') {
    return <span className="text-green-400 font-medium">{value}</span>;
  }
  return value ? (
    <Check size={18} className="text-green-400 mx-auto" />
  ) : (
    <X size={18} className="text-slate-600 mx-auto" />
  );
};
