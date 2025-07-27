import { useQuery } from "@tanstack/react-query";
import { getStatusCount } from "@/services/identificationService";

export function useStatusCount(statusType: string, userId?: string) {
  return useQuery({
    queryKey: [statusType, userId],
    queryFn: () => getStatusCount(userId!, statusType),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
