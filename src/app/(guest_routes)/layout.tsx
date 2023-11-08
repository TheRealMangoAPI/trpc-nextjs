import { getServerSession } from "next-auth";
import { authOptions } from "@auth-opts";
import { redirect } from 'next/navigation'

export default async function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session) redirect("/app")

  return (
    <>
      {children}
    </>
  );
}