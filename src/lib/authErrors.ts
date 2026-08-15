const KNOWN: Array<[RegExp, string]> = [
  [/email rate limit exceeded/i, "Trop de tentatives d'inscription récentes. Réessaie dans quelques minutes."],
  [/invalid login credentials/i, "Email ou mot de passe incorrect."],
  [/user already registered|already been registered/i, "Un compte existe déjà avec cet email."],
  [/email.*invalid|invalid.*email/i, "Cette adresse email n'est pas valide."],
  [/password.*(short|least)/i, "Le mot de passe doit contenir au moins 6 caractères."],
  [/network|fetch failed/i, "Problème de connexion. Vérifie ta connexion internet et réessaie."],
];

export function translateAuthError(message: string): string {
  for (const [pattern, fr] of KNOWN) {
    if (pattern.test(message)) return fr;
  }
  return "Une erreur est survenue. Réessaie.";
}
