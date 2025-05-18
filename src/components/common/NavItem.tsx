
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface MenuItemProps {
  route: string;
  item: string;
}

const NavItem: React.FC<MenuItemProps> = ({ route, item }) => {
  const pathname = usePathname();
  const isActive = route ? pathname === route : false;


  return (
        <Link 
          href={route} 
          className={`menu-item ${isActive ? 'selected': "inherit"}`}
          >
            {item}
        </Link> 
    );
};

export default NavItem;
