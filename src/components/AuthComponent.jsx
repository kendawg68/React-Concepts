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
