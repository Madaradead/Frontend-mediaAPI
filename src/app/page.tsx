'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { mediaKeys } from '@/hooks/useMedia';
import {
  Search,
  Loader2,
  FileVideo,
  FileAudio,
  Image as ImageIcon,
  PlayCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { mediaService } from '@/services/media.service';

const getIconForType = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'video':
      return <FileVideo className="h-6 w-6 text-blue-500" />;
    case 'audio':
      return <FileAudio className="h-6 w-6 text-green-500" />;
    default:
      return <ImageIcon className="h-6 w-6 text-purple-500" />;
  }
};

export default function HomePage() {
  const [inputValue, setInputValue] = useState('');

  const [submittedQuery, setSubmittedQuery] = useState('');


  const {
    data: results = [],
    isFetching,
    isError,
  } = useQuery({
    queryKey: mediaKeys.search(submittedQuery),
    queryFn: () => mediaService.searchMedia(submittedQuery),
    enabled: submittedQuery.trim().length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setSubmittedQuery(inputValue.trim());
  };

  const hasSearched = submittedQuery.length > 0;

  return (
    <div className="min-h-[80vh] flex flex-col items-center pt-24 px-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        <div className="flex justify-center mb-6">
          <PlayCircle className="h-20 w-20 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          What are you looking for?
        </h1>
        <p className="text-muted-foreground text-lg">
          Search across your entire media library for images, audio, and video
          files.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex gap-2 w-full max-w-xl mx-auto relative shadow-sm rounded-full"
        >
          <Input
            type="text"
            placeholder="Type a file name..."
            className="h-14 pl-6 pr-14 rounded-full text-lg border-2 focus-visible:ring-primary"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 top-2 h-10 w-10 rounded-full"
            disabled={isFetching || !inputValue.trim()}
          >
            {isFetching ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>

      {hasSearched && (
        <div className="w-full max-w-5xl mt-16">
          <h2 className="text-xl font-semibold mb-6">
            {isFetching
              ? 'Searching...'
              : results.length > 0
                ? `Found ${results.length} results`
                : 'No results found'}
          </h2>

          {isError ? (
            <p className="text-red-500 text-center py-8">
              Oops, something went wrong while searching. Try again!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((item) => (
                <Link href={`/media/${item.id}`} key={item.id}>
                  <Card className="hover:border-primary transition-colors cursor-pointer">
                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                      <div className="p-3 bg-slate-100 rounded-xl">
                        {getIconForType(item.type)}
                      </div>
                      <div className="overflow-hidden">
                        <CardTitle
                          className="text-base truncate"
                          title={item.title}
                        >
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
