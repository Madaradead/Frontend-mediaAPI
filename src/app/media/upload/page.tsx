'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaKeys } from '@/hooks/useMedia';
import {
  UploadCloud,
  CheckCircle,
  AlertCircle,
  File as FileIcon,
} from 'lucide-react';
import { isAxiosError } from 'axios';

import { mediaService } from '@/services/media.service';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function MediaUploadPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => {
      return mediaService.uploadMedia(formData, (progress) => {
        setUploadProgress(progress);
      });
    },
    onSuccess: () => {
      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: mediaKeys.list });
      queryClient.invalidateQueries({ queryKey: mediaKeys.mine });

      redirectTimeoutRef.current = setTimeout(() => {
        router.push('/media');
      }, 2000);
    },
    onError: () => {
      setUploadProgress(0);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setValidationError('Title cannot be empty.');
      return;
    }

    if (!selectedFile) {
      setValidationError('Please select a media file.');
      return;
    }

    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (selectedFile.size > MAX_FILE_SIZE) {
      setValidationError('File size exceeds the 50MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('title', trimmedTitle);
    formData.append('description', description.trim());
    formData.append('file', selectedFile);

    uploadMutation.mutate(formData);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <Card className="w-full max-w-md text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl mb-2">Upload Complete!</CardTitle>
          <CardDescription>
            Your file has been successfully uploaded.
          </CardDescription>
          <p className="text-sm text-muted-foreground mt-4">
            Redirecting to your library...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-primary" />
            Upload Media
          </CardTitle>
          <CardDescription>
            Fill in the details and select a file to upload to your library.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                type="text"
                disabled={uploadMutation.isPending}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setValidationError('');
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="E.g., Vacation Video 2026"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                disabled={uploadMutation.isPending}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Add a short description..."
              />
            </div>

            <div className="space-y-2">
              {/* Тут ми додали htmlFor */}
              <label htmlFor="media-file" className="text-sm font-medium">
                Media File
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors">
                <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                {/* А тут додали id */}
                <input
                  id="media-file"
                  type="file"
                  disabled={uploadMutation.isPending}
                  onChange={(e) => {
                    setSelectedFile(e.target.files?.[0] || null);
                    setValidationError('');
                  }}
                  className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
                {selectedFile && (
                  <p className="mt-4 text-sm font-medium flex items-center gap-2 text-primary">
                    <FileIcon className="w-4 h-4" />
                    {selectedFile.name} (
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>

            {validationError && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {uploadMutation.isError && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>
                  {isAxiosError(uploadMutation.error)
                    ? uploadMutation.error.response?.data?.error ||
                      'Upload failed. Please try again.'
                    : 'An unexpected error occurred.'}
                </span>
              </div>
            )}

            {uploadMutation.isPending && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
