import { Player } from '@/lib/online/game-response.ts';
import { appAxios } from '@/services/AxiosClient.ts';

export type Sort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export type Pageable = {
  offset: number;
  sort: Sort;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}

export type PaginatedUsers = {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: Player[];
  number: number;
  sort: Sort;
  numberOfElements: number;
  pageable: Pageable;
  empty: boolean;
}

export async function findFriendByUsername(username: string) {
  try {
    const response = await appAxios.get<PaginatedUsers>(`/search`, {
      params: {
        username: username
      }
    });
    if (response.status === 200) {
      return response.data;
    }
    throw new Error(`Unexpected response status: ${response.status}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to search for friends: ${error.message}`);
    }
    throw new Error("Failed to search for friends: Unknown error");
  }
}

export async function getSuggestion(): Promise<Player[]> {
  const response = await appAxios.get<PaginatedUsers>('/search');

  if (response.status === 200) {
    return getRandomPlayers(response.data.content);
  }

  throw new Error("Failed to get suggestion");
}

function getRandomPlayers(playerList: Player[], count: number = 10): Player[] {
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  if (playerList.length <= count) {
    return [...playerList];
  }

  const shuffledPlayers = shuffleArray(playerList);
  return shuffledPlayers.slice(0, count);
}

