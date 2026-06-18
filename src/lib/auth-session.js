import { headers } from "next/headers";
import { auth } from "./auth";


export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};

// export async function getAuthHeaders() {
//   const { data } = await authClient.getSession();
//   const token = data?.session?.token;
//   if (!token) return {};
//   return { authorization: `Bearer ${token}` };
// }