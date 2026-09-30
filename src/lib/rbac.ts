export type Role = 'SUPER_ADMIN' | 'COORDINATOR' | 'VOLUNTEER' | 'PARTICIPANT';

/** Page prefixes -> roles allowed. First match wins. */
export const PAGE_RULES: { prefix: string; roles: Role[] }[] = [
  { prefix: '/super-admin', roles: ['SUPER_ADMIN'] },
  { prefix: '/coordinator', roles: ['SUPER_ADMIN', 'COORDINATOR'] },
  { prefix: '/volunteer', roles: ['SUPER_ADMIN', 'COORDINATOR', 'VOLUNTEER'] },
  { prefix: '/participant', roles: ['PARTICIPANT'] },
  { prefix: '/register', roles: ['PARTICIPANT'] },
];

/** API prefixes -> roles allowed. Anything under /api not listed here and not public is DENIED. */
export const API_RULES: { prefix: string; roles: Role[] }[] = [
  { prefix: '/api/admin', roles: ['SUPER_ADMIN'] },
  { prefix: '/api/coordinator', roles: ['SUPER_ADMIN', 'COORDINATOR'] },
  { prefix: '/api/scores', roles: ['SUPER_ADMIN', 'COORDINATOR'] }, // GET leaderboard is served from /api/public/leaderboard
  { prefix: '/api/registration', roles: ['PARTICIPANT'] },
  { prefix: '/api/uploads', roles: ['PARTICIPANT', 'SUPER_ADMIN'] },
  { prefix: '/api/me', roles: ['SUPER_ADMIN', 'COORDINATOR', 'VOLUNTEER', 'PARTICIPANT'] },
];

export const PUBLIC_API_PREFIXES = ['/api/auth', '/api/public'];

export const HOME_BY_ROLE: Record<Role, string> = {
  SUPER_ADMIN: '/super-admin',
  COORDINATOR: '/coordinator',
  VOLUNTEER: '/volunteer',
  PARTICIPANT: '/participant',
};

export function matchRule(path: string, rules: { prefix: string; roles: Role[] }[]) {
  return rules.find((r) => path === r.prefix || path.startsWith(r.prefix + '/'));
}
