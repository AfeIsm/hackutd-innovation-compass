<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Website import
- Keep imported markup and interactions in route files and retained source CSS separate, so repairs preserve the captured layout and cascade.
- Apply imported html/body attributes through route staticData and the root consumer, so document typography matches the source.
- Preserve same-site links on the preview origin, including paths not yet imported; only explicitly requested pages are captured.

## Wallet UI
- Decorative falling bills are confined to the closed landing wallet and disabled for reduced motion; the persistent wallet layout retains navigation ownership.
- The wallet scene, sign-in panel, flying card and top chrome live in the root layout (src/components/wallet/*); routes only render page content inside PageShell, so the wallet stays one continuous object across navigation.
- Sign-in (src/lib/auth.tsx) and data (src/lib/demo-data.ts) are preview stand-ins with the production field shapes; swap them for the team's real API calls rather than adding logic to them. Money stays integer cents; null scores render "Needs input".
