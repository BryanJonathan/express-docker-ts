export const UserTable = {
  TABLE_NAME: "users",
} as const;

export const UserTableColumns = {
  ID: "id",
  NAME: "name",
  EMAIL: "email",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
  PASSWORD_HASH: "passwordHash",
  ROLE: "role",
} as const;
