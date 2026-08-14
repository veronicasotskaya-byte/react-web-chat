export type AuthResult = {
  succeeded: boolean;
  found: boolean;
  user: unknown | null;
  errorCode: "VerificationFailed" | "EmailBusy" | "UsernameBusy" | null;
};
