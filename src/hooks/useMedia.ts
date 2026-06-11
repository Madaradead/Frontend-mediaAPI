import { useQuery } from '@tanstack/react-query';
import { mediaService } from '@/services/media.service';

export const useMediaDetails = (id: string) => {
  return useQuery({
    queryKey: ['mediaItem', id],
    queryFn: () => mediaService.getMediaById(id),
  });
};
