'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  User as UserIcon,
  Trash2,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { useMediaDetails, mediaKeys } from '@/hooks/useMedia';
import { useQueryClient } from '@tanstack/react-query';
import { mediaService } from '@/services/media.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/auth.store';
import { MediaThumbnail } from '@/components/ui/MediaThumbnail';

export default function MediaDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const { data: media, isLoading, isError } = useMediaDetails(id);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    visibility: 'PUBLIC',
  });

  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (media) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditForm({
        title: media.title,
        description: media.description || '',
        visibility: media.visibility || 'PUBLIC',
      });
    }
  }, [media]);

  const isOwner = isMounted && user?.id === media?.ownerId;
  const canEditOrDelete = isMounted && (isOwner || user?.role === 'ADMIN');

  const handleDelete = async () => {
    if (confirm('Delete this file permanently?')) {
      try {
        await mediaService.deleteMedia(id);
        void queryClient.invalidateQueries({ queryKey: mediaKeys.list });
        void router.push('/media');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete file');
      }
    }
  };

  const handleSave = async () => {
    try {
      await mediaService.updateMedia(id, editForm);
      setIsEditing(false);
      void queryClient.invalidateQueries({ queryKey: mediaKeys.detail(id) });
    } catch (error) {
      console.error('Save failed:', error);
      alert('Error while saving');
    }
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (isError || !media)
    return <div className="text-center py-12">Error loading media.</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-4">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => router.push('/media')}
            variant="ghost"
            className="pl-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          {canEditOrDelete && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MediaThumbnail
            mediaId={media.id}
            title={media.title}
            type={media.type}
            variant="detail"
          />

          <div className="space-y-6">
            {isEditing ? (
              <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm">
                <Input
                  aria-label="Title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                />
                <Textarea
                  aria-label="Description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />

                <select
                  aria-label="Visibility"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editForm.visibility}
                  onChange={(e) =>
                    setEditForm({ ...editForm, visibility: e.target.value })
                  }
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </select>

                <div className="flex gap-2">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-4xl font-bold mb-2">{media.title}</h1>
                <p className="text-muted-foreground text-lg">
                  {media.description}
                </p>
              </div>
            )}

            <Card className="rounded-2xl border-none shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Details</h3>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />{' '}
                  <span>{new Date(media.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-muted-foreground" />{' '}
                  <span>
                    Owner: {media.owner?.username || 'Unknown'}{' '}
                    {isOwner && '(You)'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
