import { create } from 'zustand';

interface HandState {
  x: number;
  y: number;
  z: number;
  isPinching: boolean;
  isPresent: boolean;
  setHandData: (x: number, y: number, z: number, isPinching: boolean, isPresent: boolean) => void;
}

export interface AlienData {
    id: number;
    position: [number, number, number];
    color: string;
    isCaught: boolean;
    type: number;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

type GameStatus = 'start' | 'playing' | 'won' | 'lost';

interface GameState {
  score: number;
  timeLeft: number;
  gameStatus: GameStatus;
  playerName: string;
  aliens: AlienData[];
  grabbedAlienId: number | null;
  invertControls: boolean;
  leaderboard: LeaderboardEntry[];
  
  incrementScore: (points: number) => void;
  decrementTime: () => void;
  startGame: (name: string) => void;
  endGame: () => void;
  setPlayerName: (name: string) => void;
  setAliens: (aliens: AlienData[]) => void;
  setGrabbedAlien: (id: number | null) => void;
  updateAlienPosition: (id: number, position: [number, number, number]) => void;
  removeAlien: (id: number) => void;
  toggleInvertControls: () => void;
  loadLeaderboard: () => void;
  saveScore: () => void;
  resetGame: () => void;
}

const LEADERBOARD_KEY = 'claw-machine-leaderboard';

export const useHandStore = create<HandState>((set) => ({
  x: 0.5,
  y: 0.5,
  z: 0.1,
  isPinching: false,
  isPresent: false,
  setHandData: (x, y, z, isPinching, isPresent) => set({ x, y, z, isPinching, isPresent }),
}));

const CHUTE = { x: -7, z: 7 };
const MAX_ALIENS = 14;

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  timeLeft: 60,
  gameStatus: 'start',
  playerName: '',
  aliens: [],
  grabbedAlienId: null,
  invertControls: false,
  leaderboard: [],

  incrementScore: (points) => set((state) => ({ score: state.score + points })),
  
  decrementTime: () => set((state) => {
      const newTime = Math.max(0, state.timeLeft - 1);
      if (newTime === 0) {
          const finalStatus: GameStatus = state.score >= 500 ? 'won' : 'lost';
          return { timeLeft: 0, gameStatus: finalStatus };
      }
      return { timeLeft: newTime };
  }),
  
  startGame: (name: string) => {
      const newAliens: AlienData[] = [];
      for (let i = 0; i < MAX_ALIENS; i++) {
          let validPos = false;
          let px = 0, pz = 0;
          let attempts = 0;
          
          while (!validPos && attempts < 20) {
              px = (Math.random() * 20) - 10;
              pz = (Math.random() * 20) - 10;
              const distToChute = Math.sqrt(
                  Math.pow(px - CHUTE.x, 2) + Math.pow(pz - CHUTE.z, 2)
              );
              if (distToChute > 6.0) {
                  validPos = true;
              }
              attempts++;
          }
          
          if (validPos) {
              newAliens.push({
                  id: i,
                  position: [px, 1.5, pz],
                  color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                  isCaught: false,
                  type: Math.floor(Math.random() * 4)
              });
          }
      }
      set({ 
          gameStatus: 'playing', 
          score: 0, 
          timeLeft: 60, 
          aliens: newAliens, 
          grabbedAlienId: null,
          playerName: name
      });
  },
  
  endGame: () => {
      const state = get();
      const finalStatus: GameStatus = state.score >= 500 ? 'won' : 'lost';
      get().saveScore();
      set({ gameStatus: finalStatus, grabbedAlienId: null });
  },
  
  setPlayerName: (name) => set({ playerName: name }),
  setAliens: (aliens) => set({ aliens }),
  setGrabbedAlien: (id) => set({ grabbedAlienId: id }),
  
  updateAlienPosition: (id, position) => set((state) => ({
      aliens: state.aliens.map(a => a.id === id ? { ...a, position } : a)
  })),
  
  removeAlien: (id) => set((state) => ({
      aliens: state.aliens.filter(a => a.id !== id)
  })),
  
  toggleInvertControls: () => set((state) => ({ invertControls: !state.invertControls })),
  
  loadLeaderboard: () => {
      if (typeof window === 'undefined') return;
      const stored = localStorage.getItem(LEADERBOARD_KEY);
      if (stored) {
          try {
              const leaderboard = JSON.parse(stored);
              set({ leaderboard });
          } catch (e) {
              console.error('Failed to load leaderboard', e);
          }
      }
  },
  
  saveScore: () => {
      if (typeof window === 'undefined') return;
      const state = get();
      if (!state.playerName || state.score === 0) return;
      
      const newEntry: LeaderboardEntry = {
          name: state.playerName,
          score: state.score,
          date: new Date().toISOString()
      };
      
      const updated = [...state.leaderboard, newEntry]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
      
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
      set({ leaderboard: updated });
  },
  
  resetGame: () => set({ 
      gameStatus: 'start', 
      score: 0, 
      timeLeft: 60, 
      aliens: [], 
      grabbedAlienId: null,
      playerName: ''
  })
}));
