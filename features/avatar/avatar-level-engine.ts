export function calculateAvatarLevel(
  xp: number
) {

  return Math.floor(
    xp / 100
  ) + 1;
}