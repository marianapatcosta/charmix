<script setup lang="ts">
import { Share } from '@/assets/icons';
import { Histogram } from '@/components';
import { useLocale } from '@/composables';
import { EMOJI_BOARD, GAME_STATISTICS } from '@/constants';
import { getStatistics } from '@/utils/statistics';
import { GameCellType, ToastType, StoredGameStatistics } from '@/types';

interface StatisticsProps {
  isGameOver: boolean;
  gameBoard: GameCellType[][];
}

const { t } = useLocale();

const props = defineProps<StatisticsProps>();
const emit = defineEmits<{ (event: 'set-toast', message: string, type: ToastType): void }>();
const statistics: StoredGameStatistics & { winRate: number } = {...getStatistics(), winRate: 0 };
const { numberOfGames, guessesDistribution } = statistics;
statistics.winRate = Math.round(((numberOfGames - guessesDistribution['❌']) / numberOfGames) * 100) || 0;

enum ShareType {
  GAME = 'Game',
  STATISTICS = 'Statistics',
}

const share = async (shareType: ShareType) => {
  if (typeof navigator !== 'undefined' && !navigator.share) {
    return emit('set-toast', t('copiedToClipboard'), ToastType.INFO);
  }
  const getter = shareType === ShareType.GAME ? getGameShareMessage : getStatisticsShareMessage;
  const shareData = {
    title: t(`checkMy${shareType}`),
    text: getter(),
  };

  try {
    await navigator.share(shareData);
  } catch (error) {
    emit('set-toast', t('shareError'), ToastType.ALERT);
  }
};

const getGameShareMessage = (): string =>
  props.gameBoard
    .filter(row => row[0].value)
    .reduce(
      (boardText: string, currentRow: GameCellType[]): string =>
        `${boardText}${currentRow.map(({ status }) => EMOJI_BOARD[status]).join('')}\n`,
      ''
    );

const getStatisticsShareMessage = (): string =>
  GAME_STATISTICS.reduce(
    (statisticsText: string, currentStatistic: string): string =>
      `${statisticsText}${statistics[currentStatistic]}${
        currentStatistic === 'winRate' ? '%' : ''
      }  ${t(currentStatistic)}\n`,
    ''
  );
</script>
<template>
  <div class="statistics">
    <section class="statistics__metrics">
      <div
        class="statistics__metric"
        v-for="statistic in GAME_STATISTICS"
        :key="`statistic-${statistic}`"
      >
        <p class="statistics__value">
          {{ statistics[statistic] }}{{ statistic === 'winRate' ? '%' : '' }}
        </p>
        <p class="statistics__name">
          {{ t(statistic) }}
        </p>
      </div>
    </section>
    <section class="statistics__histogram" v-if="numberOfGames">
      <h5 class="statistics__subtitle">{{ t('guessesDistribution') }}</h5>
      <Histogram :histogramData="guessesDistribution" />
    </section>
    <section class="statistics__share"  v-if="numberOfGames">
      <h5 class="statistics__subtitle">{{ t('share') }}</h5>
      <div class="statistics__share-buttons">
        <button v-if="isGameOver" @click="share(ShareType.GAME)">
          {{ t('game') }}<img :src="Share" />
        </button>
        <button @click="share(ShareType.STATISTICS)">
          {{ t('statistics').toLowerCase() }}
          <img :src="Share" />
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss" src="./Statistics.scss"></style>
