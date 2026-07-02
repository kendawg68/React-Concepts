// ---------------------------------------------------------------------------
// THE AUTH FLOW STATE MACHINE  (useReducer)
// ---------------------------------------------------------------------------
// Instead of juggling several useState calls that must stay in sync
// (which step? logging in or signing up? loading? error text?), we model the
// whole flow as ONE object updated by a reducer. Components dispatch
// *actions* ("what happened") and the reducer decides the *next state*.
// This is the classic case where useReducer beats useState.
//
// This file is plain logic (no JSX), which makes it easy to read on its own.
// ---------------------------------------------------------------------------

// mode:   'signup' | 'login'
// step:   'email' | 'password' | 'confirmPassword'
// status: 'idle' | 'loading' | 'error' | 'success'
export const initialFlow = { mode: "signup", step: "email", status: "idle", error:"" };

export function flowReducer( state, action ) {
    switch (action.type) {
        case "SWITCH_MODE": {
            // Flip between login and signup, resetting back to the first step.

            const mode = state.mode === "signup" ? "login" : "signup";

            return { ...initialFlow, mode };
        }

        case "GO_TO":
            return {...state, step: action.step };

        case "BACK": {
            if ( state.step === "confirmPassword") return {...state, step: "password" };

            if (state.step === "password") return { ...state, step: "email" };

            return state;
        }

        case "SUBMIT":
            return {...state, status: "loading", error: ""};

            case "SUCCESS":
                return {...state, status: "success"};

            case "FAIL":
                return {...state, status: "error", error: action.error };

            case "CLEAR_STATUS":
                return {...state, status: "idle", error: ""};

            case "RESET":
                //Used on sign-out: wipe the flow back to a fresh login screen.
                return {...initialFlow, mode: "login" };

            default:
                return state;
    }
}

// Turn the firebase error codes into human readable sentences
export function friendlyError(err) {
    switch(err?.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "Email or password is incorrect.";
        case "auth/email-already-in-use":
            return "That email already has an account - try loggin in.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";
        case "auth/invalid-email":
            return "That email looks invalid.";
        case "auth/popup-closed-by-user":
            return "The sign-in window was closed before finishing.";
        case "auth/operation-not-allowed":
            return "That sign-in method isn't enabled in your Firebase project yet.";
        default:
            return err?.message || "Something went wrong. Please try again.";
    }
}