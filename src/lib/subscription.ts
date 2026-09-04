export interface SubscriptionLike {
  plan?: string | null;
  status?: string | null;
  currentPeriodEnd?: string | Date | null;
}

export function isProActive(sub: SubscriptionLike | null | undefined): boolean {
  if (sub?.plan?.toLowerCase() !== 'pro') return false;
  const status = sub.status?.toLowerCase();
  if (status === 'active' || status === 'trialing') return true;
  if (status === 'canceled' && sub.currentPeriodEnd) {
    return new Date(sub.currentPeriodEnd).getTime() > Date.now();
  }
  return false;
}

export function isTrialing(sub: SubscriptionLike | null | undefined): boolean {
  return sub?.plan?.toLowerCase() === 'pro' && sub.status?.toLowerCase() === 'trialing';
}
