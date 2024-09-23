import Link from 'next/link';
import React from 'react';

interface MenuItemProps {
    route: string;
    item: string
}

const MenuItem: React.FC<MenuItemProps> = ({ route, item }) => {
    return (
        <Link href={route} passHref>
              <button className="menuItem">{item}</button> 
        </Link>
    );
};

export default MenuItem;
