import { Logo } from "@/shared/components/logo";
import { Button } from "@repo/ui/components/button";
import { LoginDialog } from "./login-dialog";

export function Header() {
  return (
    <header className="container flex justify-between items-center py-2">
      <div>
        <Logo />
      </div>
      <div>
        <LoginDialog>
          <Button variant="secondary">Try NachUI</Button>
        </LoginDialog>
      </div>
    </header>
  );
}
