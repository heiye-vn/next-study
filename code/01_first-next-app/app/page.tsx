import Link from "next/link"

export default function Page() {
  return <>
    <h1 className="text-4xl font-semibold text-red-500  px-2.5 py-5">Hello, Next.js!</h1>
    <Link href="/dashboard">Dashboard</Link>
  </>
}
