import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useWallet } from "./WalletContext";
import logo from "@/assets/wallet-whisperer-logo.png.asset.json";

export function Chrome() {
  const { user, logout } = useAuth();
  const w = useWallet();
  const navigate = useNavigate();

  return (
    <header className="chrome">
      <Link
        to="/"
        className="chrome-brand"
        aria-label="Wallet Whisperer home"
        onClick={(e) => {
          e.preventDefault();
          if (w.activeCard) w.backToWallet();
          else {
            w.openWallet();
            w.setSide("right");
          }
        }}
      >
        <img src={logo.url} alt="Wallet Whisperer" width={56} height={56} />
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
