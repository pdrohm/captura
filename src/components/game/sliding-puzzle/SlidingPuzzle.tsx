import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../../config/Colors';
import { RetroComponents, RetroSpacing } from '../../../config/retroStyles';
import { useGameStore } from '../../../stores/gameStore';
import {
  PuzzleStats as IPuzzleStats,
  Position,
  PuzzleDifficulty,
  PuzzleGameState,
  PuzzleState,
  PuzzleTileData,
  TerritoryImage
} from '../../../types/slidingPuzzle';
import { PuzzleControls } from './PuzzleControls';
import { PuzzleGrid } from './PuzzleGrid';
import { PuzzleStats } from './PuzzleStats';

const PUZZLE_STORAGE_KEY = 'puzzle_stats';

const DIFFICULTIES: PuzzleDifficulty[] = [
  {
    id: 'easy',
    name: 'Easy',
    size: 3,
    icon: '🟢',
    isUnlocked: true,
  },
  {
    id: 'medium',
    name: 'Medium',
    size: 4,
    icon: '🟡',
    isUnlocked: false,
    requiredCompleted: 'easy',
  },
  {
    id: 'hard',
    name: 'Hard',
    size: 5,
    icon: '🔴',
    isUnlocked: false,
    requiredCompleted: 'medium',
  },
];

const TERRITORY_IMAGES: TerritoryImage[] = [
  {
    id: 'dog-mona-lisa',
    name: 'Dog Mona Lisa',
    source: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=400&fit=crop',
    description: 'The famous Mona Lisa with a dog twist',
    theme: 'art',
  },
  {
    id: 'dog-starry-night',
    name: 'Dog Starry Night',
    source: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
    description: 'Van Gogh\'s masterpiece with dogs',
    theme: 'art',
  },
  {
    id: 'dog-scream',
    name: 'Dog Scream',
    source: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop',
    description: 'Munch\'s The Scream with a dog',
    theme: 'art',
  },
  {
    id: 'dog-girl-pearl',
    name: 'Dog Girl with Pearl',
    source: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Vermeer\'s Girl with a Pearl Earring as a dog',
    theme: 'art',
  },
  {
    id: 'dog-david',
    name: 'Dog David',
    source: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop',
    description: 'Michelangelo\'s David as a majestic dog',
    theme: 'art',
  },
  {
    id: 'dog-venus',
    name: 'Dog Venus',
    source: 'https://i.etsystatic.com/8863434/r/il/147649/970732134/il_fullxfull.970732134_tor3.jpg',
    description: 'Botticelli\'s Birth of Venus with dogs',
    theme: 'art',
  },
];

export const SlidingPuzzle: React.FC = () => {
  const colors = Colors.light;
  const { completeMinigame, addExperience, addCoins } = useGameStore();
  
  const [currentDifficulty, setCurrentDifficulty] = useState<PuzzleDifficulty>(DIFFICULTIES[0]);
  const [gameState, setGameState] = useState<PuzzleGameState>({
    puzzle: createInitialPuzzle(3),
    moves: 0,
    startTime: 0,
    isPlaying: false,
    difficulty: DIFFICULTIES[0],
    imageSource: TERRITORY_IMAGES[0].source, // Start with an image
  });
  const [puzzleStats, setPuzzleStats] = useState<IPuzzleStats>({
    totalGames: 0,
    gamesWon: 0,
    totalMoves: 0,
    totalTime: 0,
    bestTimes: {},
    bestMoves: {},
    difficultyProgress: {},
  });
  const [hasShownCompletion, setHasShownCompletion] = useState(false);

  function createInitialPuzzle(size: number): PuzzleState {
    const tiles: PuzzleTileData[] = [];
    const totalTiles = size * size;
    
    for (let i = 0; i < totalTiles - 1; i++) {
      const row = Math.floor(i / size);
      const col = i % size;
      
      tiles.push({
        id: `tile-${i}`,
        value: i + 1,
        currentPosition: { row, col },
        targetPosition: { row, col },
        isBlank: false,
      });
    }

    // Add blank tile
    tiles.push({
      id: 'blank',
      value: 0,
      currentPosition: { row: size - 1, col: size - 1 },
      targetPosition: { row: size - 1, col: size - 1 },
      isBlank: true,
    });

    return {
      tiles,
      size,
      isComplete: false,
      isEmpty: false,
      blankPosition: { row: size - 1, col: size - 1 },
    };
  }

  const shufflePuzzle = useCallback((puzzle: PuzzleState): PuzzleState => {
    const shuffledTiles = [...puzzle.tiles];
    const { size } = puzzle;
    
    // Simple shuffle: make random valid moves
    for (let i = 0; i < 200; i++) {
      const blankTile = shuffledTiles.find(t => t.isBlank);
      if (!blankTile) continue;

      const { row, col } = blankTile.currentPosition;
      const possibleMoves = [];
      
      if (row > 0) possibleMoves.push({ row: row - 1, col });
      if (row < size - 1) possibleMoves.push({ row: row + 1, col });
      if (col > 0) possibleMoves.push({ row, col: col - 1 });
      if (col < size - 1) possibleMoves.push({ row, col: col + 1 });
      
      if (possibleMoves.length === 0) continue;
      
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      const tileToMove = shuffledTiles.find(t => 
        t.currentPosition.row === randomMove.row && 
        t.currentPosition.col === randomMove.col && 
        !t.isBlank
      );
      
      if (tileToMove) {
        // Swap positions
        const tempPosition = { ...tileToMove.currentPosition };
        tileToMove.currentPosition = { ...blankTile.currentPosition };
        blankTile.currentPosition = tempPosition;
      }
    }

    return {
      ...puzzle,
      tiles: shuffledTiles,
      blankPosition: shuffledTiles.find(t => t.isBlank)?.currentPosition || puzzle.blankPosition,
      isComplete: false,
    };
  }, []);

  const checkPuzzleComplete = useCallback((puzzle: PuzzleState): boolean => {
    return puzzle.tiles.every(tile => 
      tile.currentPosition.row === tile.targetPosition.row &&
      tile.currentPosition.col === tile.targetPosition.col
    );
  }, []);

  const unlockNextDifficulty = useCallback((completedDifficultyId: string) => {
    const nextDifficulty = DIFFICULTIES.find(d => d.requiredCompleted === completedDifficultyId);
    if (nextDifficulty) {
      nextDifficulty.isUnlocked = true;
    }
  }, []);

  const handleNewGame = useCallback(() => {
    const randomImage = TERRITORY_IMAGES[Math.floor(Math.random() * TERRITORY_IMAGES.length)];
    
    const initialPuzzle = createInitialPuzzle(currentDifficulty.size);
    const shuffledPuzzle = shufflePuzzle(initialPuzzle);
    
    setHasShownCompletion(false); // Reset completion flag
    setGameState({
      puzzle: shuffledPuzzle,
      moves: 0,
      startTime: Date.now(),
      isPlaying: true,
      difficulty: currentDifficulty,
      imageSource: randomImage.source,
    });
  }, [currentDifficulty, shufflePuzzle]);

  const handleTileMove = useCallback((tileId: string, newPosition: Position) => {
    setGameState(prevState => {
      const newTiles = prevState.puzzle.tiles.map(tile => {
        if (tile.id === tileId) {
          return { ...tile, currentPosition: newPosition };
        }
        if (tile.isBlank) {
          const movingTile = prevState.puzzle.tiles.find(t => t.id === tileId);
          return { ...tile, currentPosition: movingTile?.currentPosition || tile.currentPosition };
        }
        return tile;
      });

      const newPuzzle: PuzzleState = {
        ...prevState.puzzle,
        tiles: newTiles,
        blankPosition: newTiles.find(t => t.isBlank)?.currentPosition || prevState.puzzle.blankPosition,
      };

      const isComplete = checkPuzzleComplete(newPuzzle);
      
      return {
        ...prevState,
        puzzle: { ...newPuzzle, isComplete },
        moves: prevState.moves + 1,
        isPlaying: !isComplete && prevState.isPlaying,
        endTime: isComplete ? Date.now() : undefined,
      };
    });
  }, [checkPuzzleComplete]);

  const handlePuzzleComplete = useCallback(() => {
    if (hasShownCompletion) return; // Prevent multiple alerts
    
    setHasShownCompletion(true);
    const completionTime = gameState.endTime ? Math.floor((gameState.endTime - gameState.startTime) / 1000) : 0;
    
    Alert.alert(
      '🎉 Puzzle Complete!',
      `Congratulations! You solved the ${currentDifficulty.name} puzzle in ${gameState.moves} moves and ${Math.floor(completionTime / 60)}:${(completionTime % 60).toString().padStart(2, '0')}!`,
      [
        {
          text: 'New Game',
          onPress: handleNewGame,
        },
        {
          text: 'Continue',
          style: 'cancel',
        },
      ]
    );

    completeMinigame('sliding-puzzle');
    addExperience(currentDifficulty.size * 10);
    addCoins(currentDifficulty.size * 2);

    const updatedStats: IPuzzleStats = {
      ...puzzleStats,
      totalGames: puzzleStats.totalGames + 1,
      gamesWon: puzzleStats.gamesWon + 1,
      totalMoves: puzzleStats.totalMoves + gameState.moves,
      totalTime: puzzleStats.totalTime + completionTime,
      bestTimes: {
        ...puzzleStats.bestTimes,
        [currentDifficulty.id]: Math.min(
          puzzleStats.bestTimes[currentDifficulty.id] || Infinity,
          completionTime
        ),
      },
      bestMoves: {
        ...puzzleStats.bestMoves,
        [currentDifficulty.id]: Math.min(
          puzzleStats.bestMoves[currentDifficulty.id] || Infinity,
          gameState.moves
        ),
      },
      difficultyProgress: {
        ...puzzleStats.difficultyProgress,
        [currentDifficulty.id]: true,
      },
    };

    setPuzzleStats(updatedStats);
    savePuzzleStats(updatedStats);
    
    unlockNextDifficulty(currentDifficulty.id);
  }, [gameState, currentDifficulty, puzzleStats, completeMinigame, addExperience, addCoins, handleNewGame, unlockNextDifficulty, hasShownCompletion]);

  const handleShuffle = useCallback(() => {
    if (!gameState.isPlaying) {
      const shuffledPuzzle = shufflePuzzle(gameState.puzzle);
      setHasShownCompletion(false); // Reset completion flag
      setGameState(prevState => ({
        ...prevState,
        puzzle: shuffledPuzzle,
        moves: 0,
        startTime: Date.now(),
        isPlaying: true,
        endTime: undefined,
      }));
    }
  }, [gameState, shufflePuzzle]);

  const handleReset = useCallback(() => {
    const initialPuzzle = createInitialPuzzle(currentDifficulty.size);
    const shuffledPuzzle = shufflePuzzle(initialPuzzle);
    
    setHasShownCompletion(false); // Reset completion flag
    setGameState({
      puzzle: shuffledPuzzle,
      moves: 0,
      startTime: Date.now(),
      isPlaying: true,
      difficulty: currentDifficulty,
      imageSource: gameState.imageSource, // Keep the same image
    });
  }, [currentDifficulty, shufflePuzzle, gameState.imageSource]);

  const handleChangeDifficulty = useCallback(() => {
    const unlockedDifficulties = DIFFICULTIES.filter(d => d.isUnlocked);
    const currentIndex = unlockedDifficulties.findIndex(d => d.id === currentDifficulty.id);
    const nextIndex = (currentIndex + 1) % unlockedDifficulties.length;
    const nextDifficulty = unlockedDifficulties[nextIndex];
    
    setCurrentDifficulty(nextDifficulty);
    
    const initialPuzzle = createInitialPuzzle(nextDifficulty.size);
    const randomImage = TERRITORY_IMAGES[Math.floor(Math.random() * TERRITORY_IMAGES.length)];
    
    setGameState({
      puzzle: initialPuzzle,
      moves: 0,
      startTime: 0,
      isPlaying: false,
      difficulty: nextDifficulty,
      imageSource: randomImage.source,
    });
  }, [currentDifficulty]);

  const savePuzzleStats = async (stats: IPuzzleStats) => {
    try {
      await AsyncStorage.setItem(PUZZLE_STORAGE_KEY, JSON.stringify(stats));
    } catch (error) {
      console.log('Error saving puzzle stats:', error);
    }
  };

  const loadPuzzleStats = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(PUZZLE_STORAGE_KEY);
      if (saved) {
        const stats = JSON.parse(saved);
        setPuzzleStats(stats);
        
        Object.keys(stats.difficultyProgress).forEach(difficultyId => {
          if (stats.difficultyProgress[difficultyId]) {
            unlockNextDifficulty(difficultyId);
          }
        });
      }
    } catch (error) {
      console.log('Error loading puzzle stats:', error);
    }
  }, [unlockNextDifficulty]);

  useEffect(() => {
    loadPuzzleStats();
  }, [loadPuzzleStats]);

  const currentBestTime = puzzleStats.bestTimes[currentDifficulty.id];
  const currentBestMoves = puzzleStats.bestMoves[currentDifficulty.id];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <PuzzleStats
        moves={gameState.moves}
        startTime={gameState.startTime}
        endTime={gameState.endTime}
        isPlaying={gameState.isPlaying}
        isComplete={gameState.puzzle.isComplete}
        bestMoves={currentBestMoves}
        bestTime={currentBestTime}
      />
      
      <PuzzleGrid
        puzzleState={gameState.puzzle}
        onTileMove={handleTileMove}
        onPuzzleComplete={handlePuzzleComplete}
        imageSource={gameState.imageSource}
        disabled={!gameState.isPlaying}
      />
      
      <PuzzleControls
        onShuffle={handleShuffle}
        onReset={handleReset}
        onNewGame={handleNewGame}
        onChangeDifficulty={handleChangeDifficulty}
        currentDifficulty={currentDifficulty}
        isPlaying={gameState.isPlaying}
        isComplete={gameState.puzzle.isComplete}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...RetroComponents.container,
    paddingTop: RetroSpacing.xl,
  },
  scrollContent: {
    paddingBottom: RetroSpacing.lg,
  },
});