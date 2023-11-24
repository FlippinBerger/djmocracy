import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Create Party" }];

export default function CreatePartyPage() {
  return (
    <main className="h-full flex bg-slate-950 text-gray-300">
      <h1>Create your Party!</h1>
    </main>
  )
}
