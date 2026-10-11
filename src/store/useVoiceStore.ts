import { create } from 'zustand';
import { VoiceCallState, VoiceTranscriptItem } from '@/types';
import { voiceApi } from '@/services/api/voiceApi';

interface VoiceState {
  callState: VoiceCallState;
  isMuted: boolean;
  volume: number; // 0-100
  durationSeconds: number;
  customerSentiment: 'Positive' | 'Neutral' | 'Frustrated';
  transcripts: VoiceTranscriptItem[];
  callSummary: string | null;
  audioFrequencyData: number[];
  audioContext: AudioContext | null;
  analyserNode: AnalyserNode | null;
  mediaStream: MediaStream | null;

  startCall: () => Promise<void>;
  endCall: () => Promise<void>;
  toggleMute: () => void;
  setVolume: (vol: number) => void;
  addTranscript: (speaker: 'customer' | 'ai' | 'system', text: string) => void;
  simulateConversationStep: (stepIndex: number) => void;
  updateFrequencyData: (frequencies: number[]) => void;
}

let timerInterval: any = null;
let scriptTimeout: any = null;

export const useVoiceStore = create<VoiceState>((set, get) => ({
  callState: 'IDLE',
  isMuted: false,
  volume: 80,
  durationSeconds: 0,
  customerSentiment: 'Neutral',
  transcripts: [],
  callSummary: null,
  audioFrequencyData: new Array(24).fill(12),
  audioContext: null,
  analyserNode: null,
  mediaStream: null,

  startCall: async () => {
    // Reset state
    if (timerInterval) clearInterval(timerInterval);
    if (scriptTimeout) clearTimeout(scriptTimeout);

    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let stream: MediaStream | null = null;

    try {
      // Try initializing Web Audio API with microphone input
      if (typeof window !== 'undefined' && window.AudioContext) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
          } catch {
            // User denied or no mic, fallback to animated synthetic frequencies
          }
        }
      }
    } catch {
      // AudioContext unavailable
    }

    set({
      callState: 'LISTENING',
      durationSeconds: 0,
      customerSentiment: 'Neutral',
      callSummary: null,
      audioContext: audioCtx,
      analyserNode: analyser,
      mediaStream: stream,
      transcripts: [
        {
          id: `t-${Date.now()}-1`,
          speaker: 'ai',
          text: 'Hello! You are connected to CogniVoice Enterprise AI. How can I help you today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
      ],
    });

    // Start call timer
    timerInterval = setInterval(() => {
      set((s) => ({ durationSeconds: s.durationSeconds + 1 }));
    }, 1000);

    // Trigger initial simulated dialogue progression
    get().simulateConversationStep(1);
  },

  simulateConversationStep: (step: number) => {
    if (get().callState === 'ENDED') return;

    if (step === 1) {
      scriptTimeout = setTimeout(() => {
        if (get().callState === 'ENDED') return;
        set({ callState: 'PROCESSING' });

        get().addTranscript('customer', 'I want to check why my priority shipment ORD-98214 is delayed.');
        set({ customerSentiment: 'Frustrated' });

        scriptTimeout = setTimeout(() => {
          if (get().callState === 'ENDED') return;
          set({ callState: 'AI_SPEAKING' });
          get().addTranscript(
            'ai',
            'I just queried the live carrier logistics telemetry for Order ORD-98214. The shipment passed Chicago customs and is out for expedited delivery tomorrow at 9:00 AM.'
          );

          scriptTimeout = setTimeout(() => {
            if (get().callState === 'ENDED') return;
            set({ callState: 'LISTENING', customerSentiment: 'Positive' });
          }, 4500);
        }, 1800);
      }, 3000);
    }
  },

  endCall: async () => {
    if (timerInterval) clearInterval(timerInterval);
    if (scriptTimeout) clearTimeout(scriptTimeout);

    const { mediaStream, audioContext, durationSeconds, transcripts } = get();

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    if (audioContext && audioContext.state !== 'closed') {
      try {
        await audioContext.close();
      } catch {
        // ignore
      }
    }

    set({ callState: 'ENDED' });

    // Generate call summary
    const result = await voiceApi.endVoiceSession('active-session', durationSeconds, transcripts);
    set({ callSummary: result.summary });
  },

  toggleMute: () => {
    const nextMuted = !get().isMuted;
    const { mediaStream } = get();
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !nextMuted;
      });
    }
    set({ isMuted: nextMuted });
  },

  setVolume: (volume: number) => {
    set({ volume });
  },

  addTranscript: (speaker, text) => {
    set((state) => ({
      transcripts: [
        ...state.transcripts,
        {
          id: `t-${Date.now()}-${Math.random()}`,
          speaker,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
      ],
    }));
  },

  updateFrequencyData: (audioFrequencyData: number[]) => {
    set({ audioFrequencyData });
  },
}));
