// ---------------------------------------------------------------------------
// SIGNED-IN PANEL
// ---------------------------------------------------------------------------
// What you see AFTER logging in: a "You're in" message, the list of everyone
// who has signed up (read from Firestore by the parent), and a sign-out button.
// This component is "dumb" — it only renders the data/handlers it's given.
// ---------------------------------------------------------------------------
import { CheckCircle2, LogOut, Users } from "lucide-react";
import { BlurFade } from "@/components/auth/BlurFade";
import { GlassButton } from "@/components/auth/GlassButton";

export function SignedInPanel({ user, users, usersLoading, onSignOut }) {
  return (
    <BlurFade className="relative z-10">
      <div className="flex flex-col items-center gap-5 text-center w-[340px] mx-auto p-4">
        <div className="bg-primary/10 text-primary rounded-full p-4">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <p className="font-serif font-light text-4xl tracking-tight text-foreground">You're in</p>
        <p className="text-sm text-muted-foreground">
          Signed in as
          <br />
          <span className="font-semibold text-foreground break-all">{user.email || user.uid}</span>
        </p>

        {/* ---- List of everyone who has signed up (from Firestore) ---- */}
        <div className="w-full text-left">
          <div className="mb-2 flex items-center gap-2 px-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {usersLoading ? "Loading users…" : `Users (${users.length})`}
            </span>
          </div>
          <ul className="max-h-52 w-full divide-y divide-border overflow-y-auto rounded-2xl border border-border bg-card/60 backdrop-blur-sm">
            {users.map((u) => (
              <li key={u.uid} className="flex items-center gap-3 px-4 py-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold uppercase text-primary">
                  {(u.email || u.uid).charAt(0)}
                </div>
                <span className="break-all text-sm text-foreground">
                  {u.email || u.uid}
                  {u.uid === user.uid && (
                    <span className="ml-1 text-xs text-muted-foreground">(you)</span>
                  )}
                </span>
              </li>
            ))}
            {!usersLoading && users.length === 0 && (
              <li className="px-4 py-3 text-sm text-muted-foreground">No users yet.</li>
            )}
          </ul>
        </div>

        <GlassButton onClick={onSignOut} size="sm" contentClassName="flex items-center gap-2">
          <LogOut className="h-4 w-4" /> Sign out
        </GlassButton>
      </div>
    </BlurFade>
  );
}

export default SignedInPanel;
