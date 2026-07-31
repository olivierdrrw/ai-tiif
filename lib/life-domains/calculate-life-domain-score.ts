export function calculateLifeDomainAverage(
  domains: LifeDomains
) {
  const values =
    Object.values(domains);

  return Math.round(
    values.reduce(
      (a, b) => a + b,
      0
    ) / values.length
  );
}