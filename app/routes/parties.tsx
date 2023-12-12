import { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: "Your Parties" }];

export default function PartiesPage() {
  return (
    <main className="h-full flex bg-slate-950 text-gray-300">
      <h1>Parties page</h1>
      <Outlet />
    </main>
  )
}
