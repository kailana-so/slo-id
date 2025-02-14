"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface MenuItemProps {
  route?: string;
  item: string;
  handler?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ route, item, handler }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = route ? pathname === route : false;

  const handleClick = () => {
    if (handler) handler(); // Call handler if provided
    if (route) router.push(route); // Change the route without reloading
  };

  return (
        <button onClick={handleClick}>
            <button className={isActive ? "menuItem" : "inherit"}>
                {item}
            </button> 
        </button>
    );
};

export default MenuItem;
