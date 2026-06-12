'use client';

import React, { useState, useEffect } from 'react';
import { FileVideo, FileAudio, Image as ImageIcon } from 'lucide-react';
import apiClient, { API_BASE_URL } from '@/services/apiClient';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { AudioPlayer } from '@/components/ui/AudioPlayer';

export const getIconForType = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'video':
      return <FileVideo className="h-10 w-10 text-blue-500" />;
    case 'audio':
      return <FileAudio className="h-10 w-10 text-green-500" />;
    default:
      return <ImageIcon className="h-10 w-10 text-purple-500" />;
  }
};

interface MediaThumbnailProps {
  mediaId: string;
  title: string;
  type: string;
  variant?: 'list' | 'detail';
}

export const MediaThumbnail = ({
  mediaId,
  title,
  type,
  variant = 'list',
}: MediaThumbnailProps) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    if (type === 'IMAGE' || type === 'image') {
      apiClient
        .get(`/media/${mediaId}/stream`, { responseType: 'blob' })
        .then((res) => {
          if (cancelled) return;
          objectUrl = URL.createObjectURL(res.data);
          setBlobUrl(objectUrl);
        })
        .catch(() => console.warn('Could not load image'));
    }

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [mediaId, type]);

  const isImage = type === 'IMAGE' || type === 'image';
  const isVideo = type === 'VIDEO' || type === 'video';

  if (variant === 'detail') {
    if (isImage && blobUrl) {
      return (
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blobUrl}
            alt={title}
            className="max-h-[60vh] w-auto object-contain rounded-xl"
          />
        </div>
      );
    }

    return (
      <div className="h-80 w-full bg-muted flex items-center justify-center rounded-3xl overflow-hidden">
        {isVideo ? (
          <VideoPlayer src={`${API_BASE_URL}/media/${mediaId}/stream`} />
        ) : (
          <AudioPlayer src={`${API_BASE_URL}/media/${mediaId}/stream`} />
        )}
      </div>
    );
  }

  if (isImage && blobUrl) {
    return (
      <div className="w-full h-32 mb-3 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={blobUrl} alt={title} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="w-full h-32 mb-3 rounded-md bg-slate-50 flex items-center justify-center">
      {getIconForType(type)}
    </div>
  );
};
