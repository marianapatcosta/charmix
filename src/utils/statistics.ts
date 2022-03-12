import { useLocalStorage } from "@/composables";
import { COLLECTION_STATS, MAX_COLUMNS_ROWS } from "@/constants";
import { GameStatus, StoredGameStatistics } from "@/types";

const { getStoredItem, saveItemInStorage } = useLocalStorage();

export const updateGameStatistics = (currentRow: number, gameStatus: GameStatus) => {
  const statistics = getStatistics();

  statistics.numberOfGames = statistics.numberOfGames + 1;
  statistics.currentStreak = gameStatus === GameStatus.LOST ? 0 : statistics.currentStreak + 1;
  if (statistics.currentStreak > statistics.bestStreak) {
    statistics.bestStreak = statistics.currentStreak;
  }

  const guessToUpdate = gameStatus === GameStatus.LOST ? '❌' : currentRow;
  statistics.guessesDistribution[guessToUpdate] = statistics.guessesDistribution[currentRow] + 1;

  saveItemInStorage(COLLECTION_STATS, statistics);
};

export const getStatistics = (): StoredGameStatistics => {
  const storedStatistics: StoredGameStatistics | undefined = getStoredItem(COLLECTION_STATS);

  if (storedStatistics) {
    return storedStatistics;
  }

  const guessesDistribution = {} as { [key: string]: number };
  for (let index = 1; index <= MAX_COLUMNS_ROWS; index++) {
    guessesDistribution[index] = 0;
  }
  guessesDistribution['❌'] = 0;

  return {
    numberOfGames: 0,
    currentStreak: 0,
    bestStreak: 0,
    guessesDistribution,
  };
};
