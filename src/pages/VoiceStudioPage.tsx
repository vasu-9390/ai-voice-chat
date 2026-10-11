import React, { useEffect, useRef } from 'react';
import { useVoiceStore } from '@/store/useVoiceStore';
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Clock,
  Heart,
  Smile,
  AlertTriangle,
  FileText,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

export const VoiceStudioPage: React.FC = () => {
  const {
    callState,
    isMuted,
    volume,
    durationSeconds,
    customerSentiment,
    transcripts,
    callSummary,
    startCall,
    endCall,
    toggleMute,
    setVolume,
    addTranscript,
  } = useVoiceStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcripts
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  // Audio Canvas visualizer loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const draw = () => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (callState === 'IDLE' || callState === 'ENDED') {
        // Draw flat baseline
        ctx.beginPath();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        return;
      }

      phase += 0.05;
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw layered sine waves reflecting voice frequencies
      const colors = ['rgba(99, 102, 241, 0.6)', 'rgba(168, 85, 247, 0.7)', 'rgba(236, 72, 153, 0.5)'];
      const amplitudes = callState === 'AI_SPEAKING' ? [28, 22, 14] : callState === 'LISTENING' ? [18, 12, 8] : [8, 5, 3];

      colors.forEach((color, idx) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3 - idx * 0.5;

        for (let x = 0; x < width; x++) {
          const freq = 0.02 + idx * 0.01;
          const amp = amplitudes[idx];
          const y = centerY + Math.sin(x * freq + phase + idx) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [callState]);

  const formatCallDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStateBadge = () => {
    switch (callState) {
      case 'IDLE':
        return <Badge variant="default">IDLE</Badge>;
      case 'LISTENING':
        return <Badge variant="info" dot>LISTENING (VAD ACTIVE)</Badge>;
      case 'PROCESSING':
        return <Badge variant="warning" dot>PROCESSING (LLM GENERATING)</Badge>;
      case 'AI_SPEAKING':
        return <Badge variant="purple" dot>AI SPEAKING (OPUS STREAM)</Badge>;
      case 'ENDED':
        return <Badge variant="danger">ENDED</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Real-Time Voice AI Studio
            <Badge variant="purple" className="text-xs">WebRTC & Web Audio</Badge>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Duplex voice synthesis with live acoustic visualization, speech-to-text, and autonomous tool calling
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-slate-200">{formatCallDuration(durationSeconds)}</span>
          </div>
          {getStateBadge()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: Microphone Visualizer & Call Stage */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-8 bg-slate-900/80 border border-slate-800 text-center flex flex-col items-center justify-center relative overflow-hidden min-h-[440px]">
            {/* Background Ambient Glow */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                callState === 'AI_SPEAKING'
                  ? 'bg-gradient-to-t from-purple-900/20 via-indigo-900/10 to-transparent opacity-100'
                  : callState === 'LISTENING'
                  ? 'bg-gradient-to-t from-cyan-900/20 via-blue-900/10 to-transparent opacity-100'
                  : 'opacity-0'
              }`}
            />

            {/* Large Animated Microphone Visualizer */}
            <div className="relative my-8">
              {/* Outer pulsing rings */}
              {(callState === 'LISTENING' || callState === 'AI_SPEAKING') && (
                <>
                  <div className="absolute -inset-6 rounded-full bg-indigo-500/20 animate-ping" />
                  <div className="absolute -inset-12 rounded-full bg-purple-500/10 animate-pulse" />
                </>
              )}

              <button
                disabled={callState === 'IDLE' || callState === 'ENDED'}
                onClick={toggleMute}
                className={`relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                  callState === 'AI_SPEAKING'
                    ? 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white scale-110 shadow-indigo-500/40 ring-4 ring-indigo-400/50'
                    : callState === 'LISTENING'
                    ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white scale-105 shadow-cyan-500/40 ring-4 ring-cyan-400/50'
                    : callState === 'PROCESSING'
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 shadow-md'
                }`}
              >
                {isMuted ? (
                  <MicOff className="w-14 h-14 text-rose-300" />
                ) : (
                  <Mic className="w-14 h-14" />
                )}
              </button>
            </div>

            {/* Current State Text & Status */}
            <h3 className="text-lg font-bold text-white tracking-tight">
              {callState === 'IDLE' && 'Voice Session Ready'}
              {callState === 'LISTENING' && 'Listening to Customer Speech...'}
              {callState === 'PROCESSING' && 'Aurora AI Processing Live Telemetry...'}
              {callState === 'AI_SPEAKING' && 'Aurora AI Speaking (Opus Audio 48kHz)'}
              {callState === 'ENDED' && 'Call Session Concluded'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              {callState === 'IDLE' && 'Press "Start Voice Call" to initiate a full duplex call with Aurora AI.'}
              {callState === 'LISTENING' && 'Speak into your microphone. VAD automatically recognizes speech start & end.'}
              {callState === 'PROCESSING' && 'Querying CRM and knowledge base vector chunk embeddings.'}
              {callState === 'AI_SPEAKING' && 'Natural voice responses streamed with sub-500ms turnaround.'}
              {callState === 'ENDED' && 'Summary, sentiment score, and recommended next actions have been logged.'}
            </p>

            {/* Real-time Canvas Waveform */}
            <div className="w-full max-w-md my-4">
              <canvas
                ref={canvasRef}
                width={450}
                height={70}
                className="w-full h-16 rounded-xl bg-slate-950/60 border border-slate-800/80"
              />
            </div>

            {/* Controls Bar: Start / End Call, Mute, Volume */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              {callState === 'IDLE' || callState === 'ENDED' ? (
                <Button
                  variant="glow"
                  size="lg"
                  onClick={startCall}
                  leftIcon={<Phone className="w-5 h-5" />}
                >
                  Start Voice Call
                </Button>
              ) : (
                <>
                  <Button
                    variant="danger"
                    size="md"
                    onClick={endCall}
                    leftIcon={<PhoneOff className="w-4 h-4" />}
                  >
                    End Call
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={toggleMute}
                    leftIcon={isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
                  >
                    {isMuted ? 'Unmute Mic' : 'Mute Mic'}
                  </Button>
                </>
              )}

              {/* Speaker Volume Slider */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-20 accent-indigo-500 cursor-pointer"
                />
                <span className="w-7 text-right font-mono text-[11px]">{volume}%</span>
              </div>
            </div>
          </Card>

          {/* Post Call Summary & Next Action Card (shown when call ends or after summary generation) */}
          {callSummary && (
            <Card className="p-5 border-indigo-500/40 bg-indigo-950/20">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-indigo-500/20">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-400" /> Automated AI Call Summary
                </span>
                <Badge variant="success" className="text-[10px]">CRM Synchronized</Badge>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{callSummary}</p>
            </Card>
          )}
        </div>

        {/* RIGHT: Live Transcripts & Telemetry Panel */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="h-[520px] flex flex-col p-0 overflow-hidden">
            <CardHeader className="p-4 m-0 border-b border-slate-800 bg-slate-900/60">
              <div>
                <CardTitle className="text-sm flex items-center gap-2">
                  <span>Live Speech Transcript</span>
                  <Badge variant="purple" className="text-[10px]">Real-time STT</Badge>
                </CardTitle>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span>Caller: <strong className="text-slate-200">Olivia Sterling</strong></span>
                  <span>•</span>
                  <span>
                    Sentiment:{' '}
                    <strong
                      className={
                        customerSentiment === 'Positive'
                          ? 'text-emerald-400'
                          : customerSentiment === 'Frustrated'
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }
                    >
                      {customerSentiment}
                    </strong>
                  </span>
                </div>
              </div>
            </CardHeader>

            {/* Transcript stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
              {transcripts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 text-xs">
                  <Mic className="w-8 h-8 mb-2 opacity-40" />
                  <p>Start a call to generate real-time voice speech transcripts</p>
                </div>
              ) : (
                transcripts.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col text-xs ${
                      item.speaker === 'customer' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="font-semibold text-slate-300">
                        {item.speaker === 'customer' ? 'Customer' : 'Aurora Voice AI'}
                      </span>
                      <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                    </div>
                    <div
                      className={`max-w-[88%] rounded-2xl p-3 leading-relaxed ${
                        item.speaker === 'customer'
                          ? 'bg-slate-800 text-slate-100 rounded-br-none border border-slate-700/60'
                          : 'bg-indigo-950/50 border border-indigo-500/40 text-slate-100 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>

            {/* Manual simulated speech triggers for quick testing */}
            <div className="p-3 bg-slate-900 border-t border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 block mb-1.5">
                Simulate Customer Speech Test Prompts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  disabled={callState === 'IDLE' || callState === 'ENDED'}
                  onClick={() => {
                    addTranscript('customer', 'Where is my order ORD-98214? I need it urgently.');
                    setTimeout(() => {
                      addTranscript(
                        'ai',
                        'I have checked your order ORD-98214 in FedEx tracking. It cleared customs at Chicago and will arrive tomorrow at 9:00 AM.'
                      );
                    }, 1200);
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium disabled:opacity-50"
                >
                  "Where is order ORD-98214?"
                </button>

                <button
                  disabled={callState === 'IDLE' || callState === 'ENDED'}
                  onClick={() => {
                    addTranscript('customer', 'Can I cancel this hardware order and get a full refund?');
                    setTimeout(() => {
                      addTranscript(
                        'ai',
                        'Yes, under our 30-day enterprise warranty, you are eligible for a 100% refund. I will generate a prepaid return label.'
                      );
                    }, 1200);
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium disabled:opacity-50"
                >
                  "Can I get a refund?"
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
