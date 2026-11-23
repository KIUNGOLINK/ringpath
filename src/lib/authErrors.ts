const KNOWN: Array<[RegExp, string]> = [
  [/email rate limit exceeded|rate limit/i, "Trop de demandes récentes. Réessaie dans quelques minutes."],
  [/for security purposes|only request this after/i, "Pour ta sécurité, attends une minute avant de refaire une demande."],
  [/different from the old password|same.*password/i, "Choisis un mot de passe différent de l'ancien."],
  [/auth session missing|session.*(missing|expired)|token.*(expired|invalid)|expired/i, "Ce lien a expiré. Refais une demande de réinitialisation."],
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
