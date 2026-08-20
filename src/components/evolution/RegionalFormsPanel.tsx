import React from 'react';
import type { RegionalVariant, PokemonStat } from '../../types/pokemon';
import { TypeBadge } from '../pokemon/TypeBadge';
import { capitalize, getStatLabel } from '../../utils/formatters';
import { Compass } from 'lucide-react';

interface RegionalFormsPanelProps {
  regionalForms: RegionalVariant[];
  basePokemonStats?: PokemonStat[];
}

export const RegionalFormsPanel: React.FC<RegionalFormsPanelProps> = ({
  regionalForms,
  basePokemonStats = [],
}) => {
  const getBaseStatValue = (statName: string) => {
    return basePokemonStats.find((s) => s.stat.name === statName)?.base_stat || 0;
  };

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'Alola':
        return 'from-sky-500/20 via-amber-500/10 to-teal-500/20 border-sky-500/30 text-sky-500';
      case 'Galar':
        return 'from-rose-500/20 via-indigo-500/10 to-purple-500/20 border-rose-500/30 text-rose-500';
      case 'Hisui':
        return 'from-emerald-500/20 via-amber-500/10 to-yellow-500/20 border-emerald-500/30 text-emerald-500';
      case 'Paldea':
        return 'from-violet-500/20 via-pink-500/10 to-cyan-500/20 border-violet-500/30 text-violet-500';
      default:
        return 'from-slate-500/20 to-slate-800/20 border-slate-500/30 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sky-500 dark:text-sky-400 font-extrabold text-xs uppercase tracking-wider">
        <Compass className="w-4 h-4" />
        <span>Regional Variants ({regionalForms.length})</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {regionalForms.map((variant) => {
          const regionClass = getRegionColor(variant.region);
          const totalStat = variant.stats.reduce((acc, curr) => acc + curr.base_stat, 0);

          return (
            <div
              key={variant.name}
              className={`relative bg-gradient-to-br ${regionClass} p-6 rounded-3xl border shadow-xl flex flex-col justify-between`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-mono text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {variant.region} Form
                  </span>
                  <h4 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2">
                    {capitalize(variant.name)}
                  </h4>
                </div>
              </div>

              {/* Sprite Image */}
              <div className="relative my-4 flex items-center justify-center min-h-[140px]">
                <div className="absolute w-36 h-36 rounded-full bg-white/20 blur-xl" />
                <img
                  src={variant.sprite}
                  alt={variant.name}
                  className="relative z-10 w-36 h-36 object-contain drop-shadow-2xl hover:scale-105 transition-transform"
                />
              </div>

              {/* Types */}
              <div className="flex justify-center gap-2 mb-4">
                {variant.types.map((type) => (
                  <TypeBadge key={type} type={type} size="md" />
                ))}
              </div>

              {/* Stat Comparison */}
              <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-500">
                  <span>STAT COMPARISON</span>
                  <span className="font-mono text-sky-500">BST: {totalStat}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {variant.stats.map((s) => {
                    const baseVal = getBaseStatValue(s.stat.name);
                    const diff = s.base_stat - baseVal;
                    return (
                      <div key={s.stat.name} className="flex items-center justify-between font-bold">
                        <span className="text-slate-400 text-[11px]">
                          {getStatLabel(s.stat.name)}
                        </span>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="text-slate-800 dark:text-slate-200">{s.base_stat}</span>
                          {diff !== 0 && (
                            <span
                              className={`text-[10px] font-extrabold ${
                                diff > 0 ? 'text-emerald-500' : 'text-rose-500'
                              }`}
                            >
                              {diff > 0 ? `+${diff}` : diff}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
