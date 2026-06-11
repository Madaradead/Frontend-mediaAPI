'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Loader2,
  AlertCircle,
  FileVideo,
  FileAudio,
  Image as ImageIcon,
} from 'lucide-react';
import { isAxiosError } from 'axios';
import { MediaItem } from '@/types/media.types';
import { useRouter } from 'next/navigation';
import apiClient from '@/services/apiClient';
import { mediaService } from '@/services/media.service';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

const MediaThumbnail = ({ media }: { media: MediaItem }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (media.type === 'IMAGE' || media.type === 'image') {
      apiClient
        .get(`/media/${media.id}/stream`, { responseType: 'blob' })
        .then((res) => {
          setBlobUrl(URL.createObjectURL(res.data));
        })
        .catch(() => console.warn('Could not load image'));
    }

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [media.id, media.type]);

  if ((media.type === 'IMAGE' || media.type === 'image') && blobUrl) {
    return (
      <div className="w-full h-32 mb-3 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
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

export default function MediaLibraryPage() {
  const router = useRouter();

  const {
    data: mediaList = [],
    isLoading,
    error,
  } = useQuery<MediaItem[], Error>({
    queryKey: ['mediaList'],
    queryFn: mediaService.getAllMedia,
  });

  const errorMessage = isAxiosError(error)
    ? error.response?.data?.error || 'Failed to load media library.'
    : 'An unexpected error occurred.';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your library...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Oops! Something went wrong</h2>
        <p className="text-muted-foreground">{errorMessage}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try again
        </Button>
      </div>
    );
  }

  if (mediaList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 border-2 border-dashed rounded-lg p-12 bg-muted/20">
        <div className="p-4 bg-muted rounded-full">
          <FileVideo className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Your library is empty</h2>
        <p className="text-muted-foreground">
          You haven&apos;t uploaded any media files yet.
        </p>
        <Button asChild className="mt-4">
          <Link href="/media/upload">Upload your first file</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Library</h1>
        <Button onClick={() => router.push('/media/upload')}>Add Files</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mediaList.map((media) => (
          <Link href={`/media/${media.id}`} key={media.id}>
            <Card className="hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer h-full">
              <MediaThumbnail media={media} />
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg truncate" title={media.title}>
                    {media.title}
                  </CardTitle>
                </div>
                <CardDescription className="flex items-center justify-between mt-2">
                  <span className="capitalize text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {media.type}
                  </span>
                  <span className="text-xs">
                    {new Date(media.createdAt).toLocaleDateString()}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground mt-2">
                  Visibility:{' '}
                  <span className="font-medium capitalize">
                    {media.visibility}
                  </span>
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
