import { Logo } from "@/shared/components/logo";
import { Button } from "@repo/ui/components/button";

export function Header() {
  return (
    <header className="container flex justify-between items-center py-2">
      <div>
        <Logo />
      </div>
      <div>
        <Button variant="secondary">Try NachUI</Button>
      </div>
    </header>
  );
}
