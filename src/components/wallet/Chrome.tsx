import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useWallet } from "./WalletContext";

export function Chrome() {
  const { user, logout } = useAuth();
  const w = useWallet();
  const navigate = useNavigate();

  return (
    <header className="chrome">
      <Link
        to="/"
        className="chrome-brand font-display"
        onClick={(e) => {
          e.preventDefault();
          if (w.activeCard) w.backToWallet();
          else {
            w.openWallet();
            w.setSide("right");
          }
        }}
      >
        Wallet Whisperer
      </Link>
      {user && (
        <button
          type="button"
          className="chrome-logout"
          onClick={() => {
            logout();
            w.closeWallet();
            navigate({ to: "/" });
          }}
        >
          Log out
        </button>
      )}
    </header>
  );
}
