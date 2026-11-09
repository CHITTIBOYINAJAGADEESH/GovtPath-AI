import {Menu} from 'lucide-react';
import SearchBar from '../common/SearchBar';
import NotificationDropdown from '../common/NotificationDropdown';
import ProfileDropdown from '../common/ProfileDropdown';
import Breadcrumbs from '../common/Breadcrumbs';

export default function StudentHeader({onMenuOpen}){
 return <header className="sticky top-0 z-20 flex min-h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2 lg:px-8">
  <div className="flex min-w-0 items-center gap-3"><button className="lg:hidden" aria-label="Open menu" onClick={onMenuOpen}><Menu/></button><div className="hidden lg:block"><Breadcrumbs/></div><b className="truncate text-brand-700 lg:hidden">GovtPath AI</b></div>
  <div className="hidden flex-1 justify-center px-4 xl:flex"><SearchBar/></div>
  <div className="flex shrink-0 items-center gap-2"><NotificationDropdown/><ProfileDropdown/></div>
 </header>;
}
