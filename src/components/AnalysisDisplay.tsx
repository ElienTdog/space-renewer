import React from 'react';
import { CheckCircle2, LayoutGrid, Sparkles, Wand2, ArrowLeft, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisResult } from '../types';

interface AnalysisDisplayProps {
  image: string;
  result: AnalysisResult;
  rearrangedImage: string | null;
  isRearranging: boolean;
  onRearrange: () => void;
  onReset: () => void;
}

export function AnalysisDisplay({ 
  image, 
  result, 
  rearrangedImage, 
  isRearranging,
  onRearrange, 
  onReset 
}: AnalysisDisplayProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button 
        onClick={onReset}
        className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        分析另一间房间
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Column */}
        <div className="space-y-6">
          <div className="relative group">
            <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">原始空间</h3>
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-gray-200">
              <img 
                src={image} 
                alt={result.imageAlt} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {rearrangedImage ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-mono text-blue-500 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    AI 整理预览
                  </h3>
                  <span className="text-[10px] text-gray-400 italic">已重新设计与组织</span>
                </div>
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-4 ring-blue-500/20">
                  <img 
                    src={rearrangedImage} 
                    alt="AI visualized rearranged room" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            ) : (
              <div className="p-8 rounded-3xl bg-blue-50 border border-blue-100 flex flex-col items-center text-center">
                <Wand2 className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">预览焕新效果</h3>
                <p className="text-sm text-blue-700/80 mb-6 max-w-sm">
                  让 Gemini 根据整理和断舍离计划，为您重新构想这个空间。
                </p>
                <button 
                  onClick={onRearrange}
                  disabled={isRearranging}
                  className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all active:scale-95"
                >
                  {isRearranging ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> 正在生成可视化...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> 空间一键整理</>
                  )}
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Column */}
        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-gray-900 text-white text-[10px] uppercase font-bold tracking-widest rounded-full">
                {result.roomType}
              </span>
              <div className="h-[1px] flex-grow bg-gray-200" />
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <LayoutGrid className="w-6 h-6 text-gray-400" />
                  空间现状观察
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.problems.map((prob, i) => (
                    <span key={i} className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-xl flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      {prob}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  局部调整计划
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm bg-white p-6 rounded-2xl border border-gray-100 shadow-sm italic">
                  "{result.rearrangementPlan}"
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">精细化收纳建议</h2>
            <div className="grid gap-4">
              {result.organizationSuggestions.map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-hover hover:border-gray-200">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <span className="text-blue-600 font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CheckCircle2 className="w-32 h-32" />
            </div>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
               当下可执行的断舍离建议
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {result.declutteringTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <div className="mt-1 w-5 h-5 rounded-full border border-gray-700 flex items-center justify-center flex-shrink-0 group-hover:border-blue-400 transition-colors">
                    <CheckCircle2 className="w-3 h-3 text-transparent group-hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-sm text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
