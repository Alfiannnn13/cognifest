"use client";

import { headerLinks } from "@/constans";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const NavItems = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const res = await fetch("/api/get-role");
      const data = await res.json();
      setRole(data.role);
    };

    fetchRole();
  }, []);

  if (!role) return null; // atau loading spinner

  return (
    <div className="overflow-x-auto">
      <ul className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8 md:flex-nowrap">
        {headerLinks
          .filter((link) => link.roles.includes(role))
          .map((link) => (
            <li key={link.label}>
              <Link
                href={link.route}
                className=" font-medium text-muted-foreground hover:text-primary transition-colors text-lg"
              >
                {link.label}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default NavItems;
