import { Navbar } from './navbar';
import { NavigationBar } from './navigation-bar';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="flex md:hidden w-full">
          <NavigationBar />
        </div>
        <div className="hidden md:flex w-full">
          <Navbar />
        </div>
      </div>
    </header>
  );
}
