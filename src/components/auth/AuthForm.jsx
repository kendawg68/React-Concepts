// ---------------------------------------------------------------------------
// AUTH FORM
// ---------------------------------------------------------------------------
// The multi-step email / password form (plus the Google & GitHub buttons).
// It's a "controlled" form: every value and handler is passed in from the
// parent <AuthComponent>, which owns the state. This file is all about
// presentation and the step-by-step animation.
// ---------------------------------------------------------------------------
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { googleProvider, githubProvider } from "@/firebase";
import { BlurFade } from "@/components/auth/BlurFade";
import { GlassButton } from "@/components/auth/GlassButton";
import { GoogleIcon, GitHubIcon } from "@/components/auth/icons";

export function AuthForm({
    flow,
    copy,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    isEmailValid,
    isPasswordValid,
    isConfirmPasswordValid,
    passwordInputRef,
    onAdvance,
    onSubmit,
    onKeyDown,
    onGoBack,
    onSwitchMode,
    onSocialLogin,
}) {
    return(
        <fieldset
            disabled={flow.status !== "idle"}
            className="relative z-10 flex flex-col items-center gap-8 w-[280px] mx-auto p-4"
        >
            {/* Step titles */}
            {flow.step === "email" && (
                <motion.div
                    key={`email-${flow.mode}`}
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full flex flex-col items-center gap-4"
                >

                </motion.div>
            )}
        </fieldset>
    )
}