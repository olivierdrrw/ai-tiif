import { AccessToken } from "livekit-server-sdk";

/**
 * Issues a LiveKit access token for a given room + participant.
 * Requires LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and NEXT_PUBLIC_LIVEKIT_URL
 * to be set — these come from your LiveKit Cloud project (or self-hosted
 * server), not something that can be generated here.
 */
export async function POST(request: Request) {
  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    return Response.json(
      { error: "Video calling is not configured on the server yet." },
      { status: 500 }
    );
  }

  const { room, identity, name } = await request.json();

  if (!room || !identity) {
    return Response.json({ error: "room and identity are required." }, { status: 400 });
  }

  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity, name: name ?? identity }
  );

  token.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  return Response.json({ token: await token.toJwt() });
}
