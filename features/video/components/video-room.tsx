"use client";

import { useEffect, useRef, useState } from "react";
import { Room, RoomEvent, Track, type RemoteTrack } from "livekit-client";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Loader2 } from "lucide-react";

interface VideoRoomProps {
  roomName: string;
  identity: string;
  displayName: string;
  onLeave?: () => void;
}

export function VideoRoom({ roomName, identity, displayName, onLeave }: VideoRoomProps) {
  const [room] = useState(() => new Room());
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function connect() {
      try {
        const res = await fetch("/api/video/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room: roomName, identity, name: displayName }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error ?? "Could not join the call.");
        if (cancelled) return;

        const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
        if (!livekitUrl) throw new Error("Video calling isn't configured yet (missing LiveKit URL).");

        await room.connect(livekitUrl, data.token);
        await room.localParticipant.setMicrophoneEnabled(true);
        await room.localParticipant.setCameraEnabled(true);

        const localPub = room.localParticipant.videoTrackPublications.values().next().value;
        if (localPub?.videoTrack && localVideoRef.current) {
          localPub.videoTrack.attach(document.createElement("video"));
          localVideoRef.current.appendChild(localPub.videoTrack.attach());
        }

        room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack) => {
          if (track.kind === Track.Kind.Video && remoteVideoRef.current) {
            remoteVideoRef.current.appendChild(track.attach());
          }
        });

        setIsConnecting(false);
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? "Could not join the call.");
          setIsConnecting(false);
        }
      }
    }

    connect();

    return () => {
      cancelled = true;
      room.disconnect();
    };
  }, [room, roomName, identity, displayName]);

  function toggleMic() {
    room.localParticipant.setMicrophoneEnabled(!micOn);
    setMicOn(!micOn);
  }

  function toggleCam() {
    room.localParticipant.setCameraEnabled(!camOn);
    setCamOn(!camOn);
  }

  function leave() {
    room.disconnect();
    onLeave?.();
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
        <p className="text-rose-300">{error}</p>
        <p className="text-xs text-slate-500">
          This feature needs LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and
          NEXT_PUBLIC_LIVEKIT_URL configured in your environment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative grid gap-2 overflow-hidden rounded-3xl border border-white/10 bg-black sm:grid-cols-2">
        {isConnecting ? (
          <div className="col-span-2 flex h-96 items-center justify-center text-slate-500">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <>
            <div ref={localVideoRef} className="h-64 bg-zinc-900 sm:h-96 [&>video]:h-full [&>video]:w-full [&>video]:object-cover" />
            <div ref={remoteVideoRef} className="h-64 bg-zinc-900 sm:h-96 [&>video]:h-full [&>video]:w-full [&>video]:object-cover" />
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleMic}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
            micOn ? "bg-white/10 text-white" : "bg-rose-500 text-white"
          }`}
        >
          {micOn ? <Mic size={18} /> : <MicOff size={18} />}
        </button>
        <button
          onClick={toggleCam}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
            camOn ? "bg-white/10 text-white" : "bg-rose-500 text-white"
          }`}
        >
          {camOn ? <VideoIcon size={18} /> : <VideoOff size={18} />}
        </button>
        <button
          onClick={leave}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white transition hover:bg-rose-500"
        >
          <PhoneOff size={18} />
        </button>
      </div>
    </div>
  );
}
