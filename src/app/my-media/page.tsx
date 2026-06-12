'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { mediaKeys } from '@/hooks/useMedia';
import { mediaService } from '@/services/media.service';
import { MediaItem } from '@/types/media.types';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Globe } from 'lucide-react';
import { MediaThumbnail } from '@/components/ui/MediaThumbnail';

export default function MyMediaPage() {
  const {
    data: myFiles = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: mediaKeys.mine,
    queryFn: mediaService.getMyMedia,
  });

  if (isLoading)
    return <div className="text-center py-12">Loading my files...</div>;

  if (isError)
    return (
      <div className="text-center py-12 text-red-500">
        Error loading files. Please try again.
      </div>
    );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Uploads</h1>

      {myFiles.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t uploaded any files yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myFiles.map((media: MediaItem) => (
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

                <MediaThumbnail
                  mediaId={media.id}
                  title={media.title}
                  type={media.type}
                />

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
