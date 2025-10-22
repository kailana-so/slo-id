import { useQuery } from '@tanstack/react-query';
import { getImageURLs } from '@/services/imageService';

export function useFullImage(userId: string, imageId: string, fallbackUrl: string) {
  return useQuery({
    queryKey: ['fullImage', userId, imageId],
    queryFn: async () => {
      const urls = await getImageURLs(userId, [imageId], 'full');
      return urls?.[0]?.url || fallbackUrl;
    },
    enabled: !!userId && !!imageId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    placeholderData: fallbackUrl,
  });
} 