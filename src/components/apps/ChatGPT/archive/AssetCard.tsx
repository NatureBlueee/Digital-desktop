'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, FileText, Download, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MessageAsset, AssetType } from '@/types/chatgpt-archive';

interface AssetCardProps {
  asset: MessageAsset;
  className?: string;
}

/**
 * AssetCard - 图片/附件卡片组件
 *
 * 功能：
 * - 图片预览（懒加载）
 * - 附件下载
 * - 点击放大（图片）
 * - 文件类型图标
 */
export const AssetCard: React.FC<AssetCardProps> = ({ asset, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const isImage = asset.type === 'image';
  const fileExtension = getFileExtension(asset.mime);
  const fileSize = formatFileSize(asset.size);

  if (isImage) {
    return (
      <>
        <div
          className={cn(
            'relative group cursor-pointer rounded-lg overflow-hidden bg-gray-100 border border-gray-200',
            'hover:border-gray-300 transition-all duration-200',
            className
          )}
          style={{
            maxWidth: asset.width ? Math.min(asset.width, 400) : 400,
            aspectRatio: asset.width && asset.height ? `${asset.width}/${asset.height}` : 'auto',
          }}
          onClick={() => setIsLightboxOpen(true)}
        >
          {/* Loading placeholder */}
          {!isLoaded && !isError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
              <ImageIcon size={24} />
              <span className="text-xs mt-1">Failed to load</span>
            </div>
          )}

          {/* Image */}
          <img
            src={asset.url}
            alt={asset.alt || asset.caption || 'Image'}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setIsError(true)}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ZoomIn
              size={24}
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
            />
          </div>

          {/* Caption */}
          {asset.caption && (
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/50 text-white text-xs truncate">
              {asset.caption}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {isLightboxOpen && (
          <ImageLightbox
            src={asset.url}
            alt={asset.alt || asset.caption || 'Image'}
            onClose={() => setIsLightboxOpen(false)}
          />
        )}
      </>
    );
  }

  // File attachment
  return (
    <a
      href={asset.url}
      download
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200',
        'hover:bg-gray-100 hover:border-gray-300 transition-colors group',
        className
      )}
    >
      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <FileText size={20} className="text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {asset.caption || `File.${fileExtension}`}
        </div>
        <div className="text-xs text-gray-500">
          {fileExtension.toUpperCase()} · {fileSize}
        </div>
      </div>
      <Download
        size={18}
        className="text-gray-400 group-hover:text-gray-600 transition-colors"
      />
    </a>
  );
};

/**
 * ImageLightbox - 图片放大查看器
 */
interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ImageLightbox: React.FC<LightboxProps> = ({ src, alt, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

/**
 * 从 MIME 类型获取文件扩展名
 */
function getFileExtension(mime: string): string {
  const mimeMap: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/zip': 'zip',
    'application/json': 'json',
    'text/plain': 'txt',
    'text/csv': 'csv',
    'text/html': 'html',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };
  return mimeMap[mime] || mime.split('/')[1] || 'file';
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

export default AssetCard;
