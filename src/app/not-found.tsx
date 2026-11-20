import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="blueprint-grid grid min-h-screen place-items-center bg-navy-950 p-6 text-center text-white">
      <div>
        <LogoMark className="mx-auto h-16 w-16" />
        <p className="mt-8 font-display text-8xl font-extrabold text-gradient">404</p>
        <p className="mt-2 text-xl font-semibold">This page is still under construction.</p>
        <Link href="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </div>
  );
}
