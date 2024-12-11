import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { sideData } from './data';
import { RxDashboard } from 'react-icons/rx';
import { GoPerson } from 'react-icons/go';
import { BsListColumnsReverse } from 'react-icons/bs';
import { RiUserSettingsLine } from 'react-icons/ri';
import Support from '@/components/icons/Support';
import Logout from '@/components/icons/Logout';

const iconMap = {
  home: RxDashboard,
  customer: GoPerson,
  transaction: BsListColumnsReverse,
  settings: RiUserSettingsLine,
  support: Support,
  logout: Logout,
};

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg py-4 px-2 flex gap-2 justify-around">
      {sideData.map((item, idx) => {
        const IconComponent = iconMap[item.icon];
        const isActive = pathname === item.link;
        return (
          <Link key={idx} href={item.link}>
            <p
              className={`flex flex-col items-center ${
                isActive ? 'text-accent' : 'text-black'
              }`}
            >
              {IconComponent && <IconComponent size={24} />}
              <span className="text-xs">{item.title}</span>
            </p>
          </Link>
        );
      })}
    </nav>
  );
}
