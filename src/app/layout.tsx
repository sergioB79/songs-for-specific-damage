import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./ssd-additions.css";

const basePath=process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const indexHref=`${basePath}/index/`;

export const metadata:Metadata={title:"Songs for Specific Damage",description:"An Index of Bad Ideas & Good Music. Music classified by human damage instead of genre."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><div className="site-shell"><header className="topbar"><Link href="/">SSD//00125</Link><nav><Link href="/diagnose">Diagnose My Damage</Link><Link href="/radar">Move the Damage</Link><a href={indexHref}>The Index</a><Link href="/surprise">Surprise Me</Link></nav></header>{children}<footer className="footer"><strong>YOU HAVE REACHED THE BOTTOM. THIS HAS SOLVED NOTHING.</strong><p>Genres describe music. Damage describes why you need it.</p><p>SSD// AUDIO PSYCHOLOGY UNIT // CASE REMAINS OPEN.</p></footer></div></body></html>}
