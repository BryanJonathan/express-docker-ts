export const PasswordResetTokenTable = {
  TABLE_NAME: "password_reset_tokens",
} as const;

export const PasswordResetTokenColumns = {
  ID: "id",
  USER_ID: "userId",
  TOKEN: "token",
  CREATED_AT: "createdAt",
  EXPIRES_AT: "expiresAt",
  USED: "used",
} as const;
