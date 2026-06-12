import { useQuery } from '@tanstack/react-query';
import { mediaService } from '@/services/media.service';

export const mediaKeys = {
  list: ['mediaList'] as const,
  detail: (id: string) => ['mediaItem', id] as const,
  mine: ['myMedia'] as const,
  search: (query: string) => ['mediaSearch', query] as const,
};



export const useMediaDetails = (id: string) => {
  return useQuery({
    queryKey: ['mediaItem', id],
    queryFn: () => mediaService.getMediaById(id),
  });

};
