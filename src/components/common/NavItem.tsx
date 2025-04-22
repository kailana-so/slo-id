
import React from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MapIcon from '@mui/icons-material/Map';
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
