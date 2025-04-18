"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MapIcon from '@mui/icons-material/Map';

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

  const handleItemRender = (item: string) => {
    if(item === "Log Out") {
        return <LogoutIcon className="ml-1 mb-1"/>
    }
    if(item === "Profile") {
        return <PersonOutlineIcon className="ml-1 mb-1"/>
    }
    if(item === "Map") {
      return <MapIcon className="ml-1 mb-1"/>
  }
    return item
  }

  return (
        <button onClick={handleClick}  className={`menu-item ${isActive ? 'selected': "inherit"}`}>
            <h4>
              {handleItemRender(item)}
            </h4>
        </button> 
    );
};

export default MenuItem;
