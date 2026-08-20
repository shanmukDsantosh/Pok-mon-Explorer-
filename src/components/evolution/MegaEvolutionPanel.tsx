import React from 'react';
import type { MegaEvolution, PokemonStat } from '../../types/pokemon';
import { TypeBadge } from '../pokemon/TypeBadge';
import { capitalize, getStatLabel } from '../../utils/formatters';
import { Gem, TrendingUp } from 'lucide-react';

interface MegaEvolutionPanelProps {
  megaForms: MegaEvolution[];
  basePokemonStats?: PokemonStat[];
}

export const MegaEvolutionPanel: React.FC<MegaEvolutionPanelProps> = ({
  megaForms,
  basePokemonStats = [],
}) => {
  const getBaseStatValue = (statName: string) => {
    return basePokemonStats.find((s) => s.stat.name === statName)?.base_stat || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
        <Gem className="w-4 h-4" />
        <span>Available Mega Evolutions ({megaForms.length})</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {megaForms.map((mega) => {
          const totalStat = mega.stats.reduce((acc, curr) => acc + curr.base_stat, 0);

          return (
            <div
              key={mega.name}
              className="relative bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-slate-900/40 p-6 rounded-3xl border border-amber-500/30 dark:border-purple-500/30 shadow-xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 text-white font-mono text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {mega.formName}
                  </span>
                  <h4 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2">
                    {capitalize(mega.name)}
                  </h4>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-300 font-mono text-xs font-black px-2.5 py-1 rounded-xl border border-amber-500/20">
                  <Gem className="w-3.5 h-3.5" />
                  <span>{mega.megaStone || 'Mega Stone'}</span>
                </div>
              </div>

              {/* Sprite Image */}
              <div className="relative my-4 flex items-center justify-center min-h-[140px]">
                <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-amber-400/20 to-purple-500/20 blur-xl animate-pulse" />
                <img
                  src={mega.sprite}
                  alt={mega.name}
                  className="relative z-10 w-36 h-36 object-contain drop-shadow-2xl hover:scale-105 transition-transform"
                />
              </div>

              {/* Types */}
              <div className="flex justify-center gap-2 mb-4">
                {mega.types.map((type) => (
                  <TypeBadge key={type} type={type} size="md" />
                ))}
              </div>

              {/* Stat Comparison */}
              <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-500">
                  <span>STAT COMPARISON</span>
                  <span className="text-amber-500 font-mono">BST: {totalStat}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {mega.stats.map((s) => {
                    const baseVal = getBaseStatValue(s.stat.name);
                    const diff = s.base_stat - baseVal;
                    return (
                      <div key={s.stat.name} className="flex items-center justify-between font-bold">
                        <span className="text-slate-400 text-[11px]">
                          {getStatLabel(s.stat.name)}
                        </span>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="text-slate-800 dark:text-slate-200">{s.base_stat}</span>
                          {diff > 0 && (
                            <span className="text-emerald-500 text-[10px] flex items-center font-extrabold">
                              <TrendingUp className="w-3 h-3" />+{diff}
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
