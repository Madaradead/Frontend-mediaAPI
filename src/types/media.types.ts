export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  type: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'video' | 'audio' | 'image';
  url: string;
  createdAt: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'public' | 'private';
  ownerId: string;
  owner?:{
    username: string;
  }
}
