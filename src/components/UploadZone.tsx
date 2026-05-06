import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface UploadZoneProps {
  onUpload: (base64: string, mimeType: string) => void;
  isAnalyzing: boolean;
}

export function UploadZone({ onUpload, isAnalyzing }: UploadZoneProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onUpload(result, file.type);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <label 
        htmlFor="room-upload"
        className={`
          flex flex-col items-center justify-center w-full h-84 border-2 border-dashed rounded-3xl cursor-pointer
          transition-all duration-300 ease-in-out
          ${isAnalyzing ? 'bg-gray-50 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50/10'}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
          {isAnalyzing ? (
            <>
              <Loader2 className="w-12 h-12 mb-4 text-blue-500 animate-spin" />
              <p className="text-xl font-medium text-gray-900 mb-2">正在分析您的空间...</p>
              <p className="text-sm text-gray-500">Gemini 正在寻找美化您房间的方法。</p>
            </>
          ) : (
            <>
              <div className="p-4 bg-blue-50 rounded-full mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-xl font-medium text-gray-900 mb-2">上传您的房间照片</p>
              <p className="text-sm text-gray-500 mb-6">请拍摄一张清晰展示整个空间的全身照</p>
              <div className="flex gap-4 items-center">
                <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                  选择照片
                </span>
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">或拖拽至此</span>
              </div>
            </>
          )}
        </div>
        <input 
          id="room-upload" 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
          disabled={isAnalyzing}
        />
      </label>
      
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="p-4">
          <ImageIcon className="w-5 h-5 mx-auto mb-2 text-gray-400" />
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">空间分析</h3>
          <p className="text-[10px] text-gray-500 mt-1">深度视觉审计您的私人空间</p>
        </div>
        <div className="p-4">
          <ImageIcon className="w-5 h-5 mx-auto mb-2 text-gray-400" />
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">断舍离指导</h3>
          <p className="text-[10px] text-gray-500 mt-1">识别隐藏的杂物源头</p>
        </div>
        <div className="p-4">
          <ImageIcon className="w-5 h-5 mx-auto mb-2 text-gray-400" />
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">收纳可视化</h3>
          <p className="text-[10px] text-gray-500 mt-1">优化物品摆放，改善动线</p>
        </div>
      </div>
    </motion.div>
  );
}
