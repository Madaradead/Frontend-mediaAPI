import apiClient from './apiClient';
import { MediaItem } from '@/types/media.types';
import axios from 'axios';

export const mediaService = {
  getAllMedia: async (): Promise<MediaItem[]> => {
    const response = await apiClient.get('/media');
    return response.data.data;
  },

  uploadMedia: async (
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<MediaItem> => {
    const response = await apiClient.post('/media/upload', formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) {
            onProgress(percentCompleted);
          }
        }
      },
    });

    return response.data;
  },

  getMediaById: async (id: string): Promise<MediaItem> => {
    try {
      const response = await apiClient.get(`/media/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status !== 404) {
          throw error;
        }
      }else{
        throw error;
      }

      const allMediaResponse = await apiClient.get('/media');
      const allMedia = allMediaResponse.data.data || allMediaResponse.data;

      const foundItem = allMedia.find((item: MediaItem) => item.id === id);

      if (!foundItem) {
        throw new Error('Media file not found');
      }

      return foundItem;
    }
  },

  updateMedia: async (
    id: string,
    data: { title?: string; description?: string; visibility?: string }
  ): Promise<MediaItem> => {
    const response = await apiClient.patch(`/media/${id}`, data);
    return response.data;
  },

  deleteMedia: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/media/${id}`);
    return response.data;
  },

  searchMedia: async (query: string): Promise<MediaItem[]> => {
    const response = await apiClient.get(`/media/search`, {
      params: {
        q: query,
      },
    });
    return response.data.data || response.data;
  },

  getMyMedia: async (): Promise<MediaItem[]> => {
    const response = await apiClient.get('/media/my?status=ACTIVE');
    return response.data.data || response.data;
  },
};
