import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Find a Party" }];

export default function FindPartyPage() {
  return (
    <main className="h-full flex bg-slate-950 text-gray-300">
      <h1>Find a party here!</h1>
    </main>
  )
}
