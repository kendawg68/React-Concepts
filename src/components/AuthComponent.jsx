// ---------------------------------------------------------------------------
// AUTH COMPONENT  (the orchestrator)
// ---------------------------------------------------------------------------
// This file owns all the STATE and the Firebase actions, then hands the data
// and callbacks down to the presentational pieces:
//
//     <Confetti>        → the celebratory canvas               (Confetti.jsx)
//     <StatusModal>     → loading / error / success popup       (StatusModal.jsx)
//     <GradientBackground>                                     (GradientBackground.jsx)
//     <SignedInPanel>   → shown once you're logged in           (SignedInPanel.jsx)
//     <AuthForm>        → the email / password step form        (AuthForm.jsx)
//
// REACT CONCEPTS TOUR (for students) — the hooks all live here:
//   • useState            → field values (email/password) + UI toggles
//   • useReducer          → the auth "state machine" (see authFlow.js)
//   • useRef              → focus inputs, hold the confetti instance
//   • useEffect           → focus on step change, confetti on success,
//                           subscribe to Firebase auth changes (with cleanup)
//   • useMemo             → derived, memoised copy (titles/subtitles)
// The remaining concepts (forwardRef, useImperativeHandle, createContext,
// Children, useInView) are demonstrated in the smaller files listed above.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// AUTH COMPONENT  (the orchestrator)
// ---------------------------------------------------------------------------
// This file owns all the STATE and the Firebase actions, then hands the data
// and callbacks down to the presentational pieces:
//
//     <Confetti>        → the celebratory canvas               (Confetti.jsx)
//     <StatusModal>     → loading / error / success popup       (StatusModal.jsx)
//     <GradientBackground>                                     (GradientBackground.jsx)
//     <SignedInPanel>   → shown once you're logged in           (SignedInPanel.jsx)
//     <AuthForm>        → the email / password step form        (AuthForm.jsx)
//
// REACT CONCEPTS TOUR (for students) — the hooks all live here:
//   • useState            → field values (email/password) + UI toggles
//   • useReducer          → the auth "state machine" (see authFlow.js)
//   • useRef              → focus inputs, hold the confetti instance
//   • useEffect           → focus on step change, confetti on success,
//                           subscribe to Firebase auth changes (with cleanup)
//   • useMemo             → derived, memoised copy (titles/subtitles)
// The remaining concepts (forwardRef, useImperativeHandle, createContext,
// Children, useInView) are demonstrated in the smaller files listed above.
// ---------------------------------------------------------------------------
import { useState, useRef, useEffect, useReducer, useMemo } from "react";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

// --- FIREBASE ---
import {
  auth,
  db,
  isFirebaseConfigured,
} from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

// --- OUR PIECES ---
import "@/styles/glass.css";
import { initialFlow, flowReducer, friendlyError } from "@/components/auth/authFlow";
import { Confetti } from "@/components/auth/Confetti";
import { GradientBackground } from "@/components/auth/GradientBackground";
import { StatusModal } from "@/components/auth/StatusModal";
import { SignedInPanel } from "@/components/auth/SignedInPanel";
import { AuthForm } from "@/components/auth/AuthForm";
import { DefaultLogo } from "@/components/auth/icons";

export const AuthComponent = ({ logo = <DefaultLogo />, brandName = "EaseMize" }) => {
  // ---- Field values: plain useState (simple, independent inputs) ----
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ---- The flow: useReducer (reducer lives in authFlow.js) ----
  const [flow, dispatch] = useReducer(flowReducer, initialFlow);

  // ---- The signed-in user (populated by Firebase's onAuthStateChanged) ----
  const [user, setUser] = useState(null);

  // ---- Every user we've recorded in Firestore (shown after signing in) ----
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // ---- Refs ----
  const confettiRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  // ---- Derived validation (cheap, computed every render) ----
  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.length >= 6;
  const isConfirmPasswordValid = confirmPassword.length >= 6;

  // ---- useMemo: memoised, mode-aware copy for the headings ----
  const copy = useMemo(() => {
    if (flow.mode === "login") {
      return {
        email: { title: "Welcome back", subtitle: `Log in to your ${brandName} account` },
        password: { title: "Enter your password", subtitle: "Good to see you again." },
        confirmPassword: null,
      };
    }
    return {
      email: { title: "Get started with Us", subtitle: null },
      password: { title: "Create your password", subtitle: "Your password must be at least 6 characters long." },
      confirmPassword: { title: "One Last Step", subtitle: "Confirm your password to continue" },
    };
  }, [flow.mode, brandName]);

  // ---- Confetti helper ----
  const fireSideCanons = () => {
    const fire = confettiRef.current?.fire;
    if (fire) {
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
      const particleCount = 50;
      fire({ ...defaults, particleCount, origin: { x: 0, y: 1 }, angle: 60 });
      fire({ ...defaults, particleCount, origin: { x: 1, y: 1 }, angle: 120 });
    }
  };

  // ---- Firebase auth actions ----
  const guardConfigured = () => {
    if (!isFirebaseConfigured) {
      dispatch({
        type: "FAIL",
        error: "Firebase isn't configured yet. Add your keys to .env.local and restart.",
      });
      return false;
    }
    return true;
  };

  const submitLogin = async () => {
    if (!guardConfigured()) return;
    dispatch({ type: "SUBMIT" });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      dispatch({ type: "SUCCESS" });
    } catch (err) {
      dispatch({ type: "FAIL", error: friendlyError(err) });
    }
  };

  const submitSignup = async () => {
    if (password !== confirmPassword) {
      dispatch({ type: "FAIL", error: "Passwords do not match!" });
      return;
    }
    if (!guardConfigured()) return;
    dispatch({ type: "SUBMIT" });
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      dispatch({ type: "SUCCESS" });
    } catch (err) {
      dispatch({ type: "FAIL", error: friendlyError(err) });
    }
  };

  const socialLogin = async (provider) => {
    if (!guardConfigured()) return;
    dispatch({ type: "SUBMIT" });
    try {
      await signInWithPopup(auth, provider);
      dispatch({ type: "SUCCESS" });
    } catch (err) {
      dispatch({ type: "FAIL", error: friendlyError(err) });
    }
  };

  // ---- The single "advance to the next step / submit" handler ----
  const advance = () => {
    if (flow.status !== "idle") return;
    if (flow.step === "email") {
      if (isEmailValid) dispatch({ type: "GO_TO", step: "password" });
    } else if (flow.step === "password") {
      if (!isPasswordValid) return;
      if (flow.mode === "login") submitLogin();
      else dispatch({ type: "GO_TO", step: "confirmPassword" });
    } else if (flow.step === "confirmPassword") {
      if (isConfirmPasswordValid) submitSignup();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    advance();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      advance();
    }
  };

  const handleGoBack = () => {
    if (flow.step === "confirmPassword") setConfirmPassword("");
    dispatch({ type: "BACK" });
  };

  const switchMode = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    dispatch({ type: "SWITCH_MODE" });
  };

  const closeModal = () => dispatch({ type: "CLEAR_STATUS" });

  const handleSignOut = () => {
    signOut(auth);
    // Reset every bit of local UI state so we land on a clean login screen,
    // not wherever we happened to be in the sign-up flow.
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    dispatch({ type: "RESET" });
  };

  // ---- Firestore: save this user, and read everyone back ----
  // Called on every sign-in. setDoc with { merge: true } keyed on the user's
  // uid means each person gets exactly one record that we update (an "upsert"),
  // so logging in twice never creates a duplicate.
  const recordUser = async (u) => {
    if (!u) return;
    try {
      await setDoc(
        doc(db, "users", u.uid),
        {
          uid: u.uid,
          email: u.email || null,
          provider: u.providerData?.[0]?.providerId || "password",
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      // Best-effort: never block sign-in just because recording failed.
      console.error("Could not record user:", e);
    }
  };

  // Read the whole `users` collection back out of Firestore for the list.
  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "users"));
      setUsers(snapshot.docs.map((d) => d.data()));
    } catch (e) {
      console.error("Could not load users:", e);
    } finally {
      setUsersLoading(false);
    }
  };

  // ---- useEffect #1: focus the right input when the step changes ----
  useEffect(() => {
    if (flow.step === "password") setTimeout(() => passwordInputRef.current?.focus(), 500);
    else if (flow.step === "confirmPassword")
      setTimeout(() => confirmPasswordInputRef.current?.focus(), 500);
  }, [flow.step]);

  // ---- useEffect #2: celebrate on success ----
  useEffect(() => {
    if (flow.status === "success") fireSideCanons();
  }, [flow.status]);

  // ---- useEffect #3: subscribe to Firebase auth state (with cleanup) ----
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    // onAuthStateChanged returns its own unsubscribe function — perfect for
    // an effect cleanup. React calls it when the component unmounts.
    // Fires on login AND logout: when a user signs in we save their record and
    // load the full list; when they sign out (u === null) we clear it.
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Show the current user right away so the list is never empty for
        // them, even before Firestore finishes writing/reading.
        setUsers((prev) =>
          prev.some((x) => x.uid === u.uid)
            ? prev
            : [
                ...prev,
                {
                  uid: u.uid,
                  email: u.email || null,
                  provider: u.providerData?.[0]?.providerId || "password",
                },
              ]
        );
        await recordUser(u);
        await loadUsers();
      } else {
        setUsers([]);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="bg-background min-h-screen w-screen flex flex-col">
      <Confetti ref={confettiRef} manualstart className="fixed top-0 left-0 w-full h-full pointer-events-none z-[999]" />
      <StatusModal flow={flow} onClose={closeModal} />

      <div className={cn("fixed top-4 left-4 z-20 flex items-center gap-2", "md:left-1/2 md:-translate-x-1/2")}>
        {logo}
        <h1 className="text-base font-bold text-foreground">{brandName}</h1>
      </div>

      {/* Gentle notice when Firebase keys are still missing. */}
      {!isFirebaseConfigured && (
        <div className="fixed top-4 right-4 z-20 flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
          <TriangleAlert className="h-3.5 w-3.5 text-secondary" />
          Add Firebase keys to <code className="font-mono">.env.local /</code>
        </div>
      )}

      <div className={cn("flex w-full flex-1 h-full items-center justify-center bg-card", "relative overflow-hidden")}>
        <div className="absolute inset-0 z-0">
          <GradientBackground />
        </div>

        {user ? (
          <SignedInPanel
            user={user}
            users={users}
            usersLoading={usersLoading}
            onSignOut={handleSignOut}
          />
        ) : (
          <AuthForm
            flow={flow}
            copy={copy}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            isEmailValid={isEmailValid}
            isPasswordValid={isPasswordValid}
            isConfirmPasswordValid={isConfirmPasswordValid}
            passwordInputRef={passwordInputRef}
            confirmPasswordInputRef={confirmPasswordInputRef}
            onAdvance={advance}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            onGoBack={handleGoBack}
            onSwitchMode={switchMode}
            onSocialLogin={socialLogin}
          />
        )}
      </div>
    </div>
  );
};

export default AuthComponent;