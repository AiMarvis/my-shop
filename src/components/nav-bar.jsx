"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function NavBar() {
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">My Shop</span>
          </Link>
        </div>
        <Tabs defaultValue={pathname.startsWith("/admin") ? "admin" : "products"} className="ml-auto">
          <TabsList>
            <Link href="/" passHref>
              <TabsTrigger value="products" className="cursor-pointer">
                상품
              </TabsTrigger>
            </Link>
            <Link href="/admin" passHref>
              <TabsTrigger value="admin" className="cursor-pointer">
                관리
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
} 