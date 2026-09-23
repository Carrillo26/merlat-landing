/**
 * Honest launch placeholders. Replace these before a public launch.
 * Do not invent raised amounts, licenses, TVL, partnerships, or a mint address.
 */
export const site = {
  pumpfunUrl: "{{PUMPFUN_URL}}",
  contractAddress: "{{CONTRACT_ADDRESS}}",
  twitterUrl: "{{TWITTER_URL}}",
  telegramUrl: "{{TELEGRAM_URL}}",
  email: "{{EMAIL}}",
} as const;

export const emailHref = `mailto:${site.email}`;
