'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mediaService } from '@/services/media.service';
import { MediaItem } from '@/types/media.types';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Lock,
  Globe,
  FileVideo,
  FileAudio,
  Image as ImageIcon,
} from 'lucide-react';
import apiClient from '@/services/apiClient';

const getIconForType = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'video':
      return <FileVideo className="h-10 w-10 text-blue-500" />;
    case 'audio':
      return <FileAudio className="h-10 w-10 text-green-500" />;
    default:
      return <ImageIcon className="h-10 w-10 text-purple-500" />;
  }
};

const CardThumbnail = ({ media }: { media: MediaItem }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (media.type === 'IMAGE' || media.type === 'image') {
      apiClient
        .get(`/media/${media.id}/stream`, { responseType: 'blob' })
        .then((res) => setBlobUrl(URL.createObjectURL(res.data)))
        .catch(() => console.error('Could not load image thumbnail'));
    }
  }, [media.id, media.type]);

  if ((media.type === 'IMAGE' || media.type === 'image') && blobUrl) {
    return (
      <div className="w-full h-32 mb-3 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={blobUrl}
          alt={media.title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-32 mb-3 rounded-md bg-slate-50 flex items-center justify-center">
      {getIconForType(media.type)}
    </div>
  );
};

export default function MyMediaPage() {
  const [myFiles, setMyFiles] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyMedia = async () => {
      try {
        const data = await mediaService.getMyMedia();
        setMyFiles(data);
      } catch (error) {
        console.error('Error fetching files', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMyMedia();
  }, []);

  if (isLoading)
    return <div className="text-center py-12">Loading my files...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Uploads</h1>

      {myFiles.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t uploaded any files yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myFiles.map((media) => (
            <Link href={`/media/${media.id}`} key={media.id}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden h-56 flex flex-col p-3 border-2">
                <div
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm z-10"
                  title={media.visibility === 'PRIVATE' ? 'Private' : 'Public'}
                >
                  {media.visibility === 'PRIVATE' ? (
                    <Lock className="w-4 h-4 text-red-500" />
                  ) : (
                    <Globe className="w-4 h-4 text-green-500" />
                  )}
                </div>

                <CardThumbnail media={media} />

                <div className="text-center w-full mt-auto">
                  <CardTitle className="text-base truncate px-1">
                    {media.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {new Date(media.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
