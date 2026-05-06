/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Info, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadZone } from './components/UploadZone';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { analyzeRoom, generateOrganizedImage } from './services/volcengine';
import { AppState } from './types';

export default function App() {
  const [state, setState] = useState<AppState>({
    isAnalyzing: false,
    isRearranging: false,
    image: null,
    result: null,
    rearrangedImage: null,
  });

  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (base64: string, mimeType: string) => {
    setState(prev => ({ ...prev, isAnalyzing: true, image: base64 }));
    setError(null);

    try {
      const result = await analyzeRoom(base64, mimeType);
      setState(prev => ({ ...prev, isAnalyzing: false, result }));
    } catch (err) {
      console.error(err);
      setError("分析房间失败。请尝试使用更清晰的照片。");
      setState(prev => ({ ...prev, isAnalyzing: false, image: null }));
    }
  };

  const handleRearrange = async () => {
    if (!state.image || !state.result) return;
    
    setState(prev => ({ ...prev, isRearranging: true }));
    setError(null);
    try {
      const rearranged = await generateOrganizedImage(state.image, state.result);
      setState(prev => ({ ...prev, isRearranging: false, rearrangedImage: rearranged }));
    } catch (err) {
      console.error(err);
      setError("生成可视化失败。但您的方案已经准备好了！");
      setState(prev => ({ ...prev, isRearranging: false }));
    }
  };

  const handleReset = () => {
    setState({
      isAnalyzing: false,
      isRearranging: false,
      image: null,
      result: null,
      rearrangedImage: null,
    });
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-bottom border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleReset}
          >
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
            </div>
            <span className="font-bold text-lg tracking-tight">空间焕新 AI</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors">工作原理</a>
            <div className="h-4 w-[1px] bg-gray-200" />
            <button className="px-5 py-2 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">
              开始使用
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {!state.image ? (
            <motion.div 
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24"
            >
              <div className="max-w-7xl mx-auto px-4 text-center mb-16">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tighter leading-[0.9]"
                >
                  你的空间， <br />
                  <span className="text-gray-400">由 AI 重新定义。</span>
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-gray-500 max-w-2xl mx-auto mb-10"
                >
                  将杂乱的房间变身为极简主义的避风港。我们的 AI 会分析您的平面布局、光线和家具，为您打造完美的收纳策略。
                </motion.p>
              </div>

              <UploadZone onUpload={handleUpload} isAnalyzing={state.isAnalyzing} />
              
              {error && (
                <p className="mt-4 text-red-500 text-sm text-center font-medium">{error}</p>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error && (
                <div className="max-w-6xl mx-auto px-4 mt-4">
                  <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>
                </div>
              )}
              {state.isAnalyzing ? (
                <div className="h-[70vh] flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-blue-500" />
                  </div>
                  <h2 className="mt-8 text-2xl font-semibold text-gray-900">挖掘房间潜力中</h2>
                  <p className="text-gray-500 mt-2">Gemini 正在起草您的空间整理蓝图...</p>
                </div>
              ) : state.result && (
                <AnalysisDisplay 
                  image={state.image} 
                  result={state.result} 
                  rearrangedImage={state.rearrangedImage}
                  isRearranging={state.isRearranging}
                  onRearrange={handleRearrange}
                  onReset={handleReset}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-top border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-gray-400" />
            </div>
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest italic">空间焕新 AI</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest font-semibold">隐私政策</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest font-semibold">服务条款</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest font-semibold">安全信息</a>
          </div>
          <p className="text-xs text-gray-400 font-mono">© 2024 REVIVE INTERIORS PVT LTD</p>
        </div>
      </footer>
    </div>
  );
}
