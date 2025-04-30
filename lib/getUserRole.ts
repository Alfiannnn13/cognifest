// lib/getUserRole.ts

import { currentUser } from "@clerk/nextjs/server";

export const getUserRole = async (): Promise<string | null> => {
  const user = await currentUser();

  if (!user) return null;

  const role = user.publicMetadata?.role as string | undefined;
  return role || "user"; // default ke user
};
