import { useQuery } from "@tanstack/react-query";
import { getStatusCount } from "@/app/identification/identificationService";
import { SightingStatus } from "@/lib/db/dbHelpers";

export function useStatusCount(statusType: string, userId?: string) {
  return useQuery({
    queryKey: ['draftCount', userId],
    queryFn: () => getStatusCount(userId!, statusType),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
