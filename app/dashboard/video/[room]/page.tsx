"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { VideoRoom } from "@/features/video/components/video-room";

export default function VideoCallPage() {
  const router = useRouter();
  const params = useParams<{ room: string }>();
  const user = useAuthStore((state) => state.user);

  if (!user?.uid) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Video Session</h1>
        <p className="mt-1 text-sm text-slate-400">Room: {params.room}</p>
      </div>

      <VideoRoom
        roomName={params.room}
        identity={user.uid}
        displayName={user.email ?? "Guest"}
        onLeave={() => router.push("/dashboard/therapy")}
      />
    </div>
  );
}
