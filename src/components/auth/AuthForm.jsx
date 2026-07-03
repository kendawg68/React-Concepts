// ---------------------------------------------------------------------------
// AUTH FORM
// ---------------------------------------------------------------------------
// The multi-step email / password form (plus the Google & GitHub buttons).
// It's a "controlled" form: every value and handler is passed in from the
// parent <AuthComponent>, which owns the state. This file is all about
// presentation and the step-by-step animation.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// AUTH FORM
// ---------------------------------------------------------------------------
// The multi-step email / password form (plus the Google & GitHub buttons).
// It's a "controlled" form: every value and handler is passed in from the
// parent <AuthComponent>, which owns the state. This file is all about
// presentation and the step-by-step animation.
// ---------------------------------------------------------------------------
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
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isEmailValid,
  isPasswordValid,
  isConfirmPasswordValid,
  passwordInputRef,
  confirmPasswordInputRef,
  onAdvance,
  onSubmit,
  onKeyDown,
  onGoBack,
  onSwitchMode,
  onSocialLogin,
}) {
  return (
    <fieldset
      disabled={flow.status !== "idle"}
      className="relative z-10 flex flex-col items-center gap-8 w-[280px] mx-auto p-4"
    >
      {/* ---- Step titles ---- */}
      <AnimatePresence mode="wait">
        {flow.step === "email" && (
          <motion.div
            key={`email-${flow.mode}`}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full flex flex-col items-center gap-4"
          >
            <BlurFade delay={0.25 * 1} className="w-full">
              <div className="text-center">
                <p className="font-serif font-light text-4xl sm:text-5xl md:text-6xl tracking-tight text-foreground whitespace-nowrap">
                  {copy.email.title}
                </p>
              </div>
            </BlurFade>
            <BlurFade delay={0.25 * 2}>
              <p className="text-sm font-medium text-muted-foreground">Continue with</p>
            </BlurFade>
            <BlurFade delay={0.25 * 3}>
              <div className="flex items-center justify-center gap-4 w-full">
                <GlassButton
                  type="button"
                  onClick={() => onSocialLogin(googleProvider)}
                  contentClassName="flex items-center justify-center gap-2"
                  size="sm"
                >
                  <GoogleIcon />
                  <span className="font-semibold text-foreground">Google</span>
                </GlassButton>
                <GlassButton
                  type="button"
                  onClick={() => onSocialLogin(githubProvider)}
                  contentClassName="flex items-center justify-center gap-2"
                  size="sm"
                >
                  <GitHubIcon />
                  <span className="font-semibold text-foreground">GitHub</span>
                </GlassButton>
              </div>
            </BlurFade>
            <BlurFade delay={0.25 * 4} className="w-[300px]">
              <div className="flex items-center w-full gap-2 py-2">
                <hr className="w-full border-border" />
                <span className="text-xs font-semibold text-muted-foreground">OR</span>
                <hr className="w-full border-border" />
              </div>
            </BlurFade>
          </motion.div>
        )}
        {flow.step === "password" && (
          <motion.div
            key="password-title"
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full flex flex-col items-center text-center gap-4"
          >
            <BlurFade delay={0} className="w-full">
              <div className="text-center">
                <p className="font-serif font-light text-4xl sm:text-5xl tracking-tight text-foreground whitespace-nowrap">
                  {copy.password.title}
                </p>
              </div>
            </BlurFade>
            <BlurFade delay={0.25 * 1}>
              <p className="text-sm font-medium text-muted-foreground">{copy.password.subtitle}</p>
            </BlurFade>
          </motion.div>
        )}
        {flow.step === "confirmPassword" && copy.confirmPassword && (
          <motion.div
            key="confirm-title"
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full flex flex-col items-center text-center gap-4"
          >
            <BlurFade delay={0} className="w-full">
              <div className="text-center">
                <p className="font-serif font-light text-4xl sm:text-5xl tracking-tight text-foreground whitespace-nowrap">
                  {copy.confirmPassword.title}
                </p>
              </div>
            </BlurFade>
            <BlurFade delay={0.25 * 1}>
              <p className="text-sm font-medium text-muted-foreground">{copy.confirmPassword.subtitle}</p>
            </BlurFade>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={onSubmit} className="w-[300px] space-y-6">
        <AnimatePresence>
          {flow.step !== "confirmPassword" && (
            <motion.div
              key="email-password-fields"
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full space-y-6"
            >
              <BlurFade delay={flow.step === "email" ? 0.25 * 5 : 0} inView={true} className="w-full">
                <div className="relative w-full">
                  <AnimatePresence>
                    {flow.step === "password" && (
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="absolute -top-6 left-4 z-10"
                      >
                        <label className="text-xs text-muted-foreground font-semibold">Email</label>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="glass-input-wrap w-full">
                    <div className="glass-input">
                      <span className="glass-input-text-area"></span>
                      <div
                        className={cn(
                          "relative z-10 flex-shrink-0 flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out",
                          email.length > 20 && flow.step === "email" ? "w-0 px-0" : "w-10 pl-2"
                        )}
                      >
                        <Mail className="h-5 w-5 text-foreground/80 flex-shrink-0" />
                      </div>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={onKeyDown}
                        className={cn(
                          "relative z-10 h-full w-0 flex-grow bg-transparent text-foreground placeholder:text-foreground/60 focus:outline-none transition-[padding-right] duration-300 ease-in-out delay-300",
                          isEmailValid && flow.step === "email" ? "pr-2" : "pr-0"
                        )}
                      />
                      <div
                        className={cn(
                          "relative z-10 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
                          isEmailValid && flow.step === "email" ? "w-10 pr-1" : "w-0"
                        )}
                      >
                        <GlassButton
                          type="button"
                          onClick={onAdvance}
                          size="icon"
                          aria-label="Continue with email"
                          contentClassName="text-foreground/80 hover:text-foreground"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </GlassButton>
                      </div>
                    </div>
                  </div>
                </div>
              </BlurFade>
              <AnimatePresence>
                {flow.step === "password" && (
                  <BlurFade key="password-field" className="w-full">
                    <div className="relative w-full">
                      <AnimatePresence>
                        {password.length > 0 && (
                          <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="absolute -top-6 left-4 z-10"
                          >
                            <label className="text-xs text-muted-foreground font-semibold">Password</label>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="glass-input-wrap w-full">
                        <div className="glass-input">
                          <span className="glass-input-text-area"></span>
                          <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 pl-2">
                            {isPasswordValid ? (
                              <button
                                type="button"
                                aria-label="Toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-foreground/80 hover:text-foreground transition-colors p-2 rounded-full"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            ) : (
                              <Lock className="h-5 w-5 text-foreground/80 flex-shrink-0" />
                            )}
                          </div>
                          <input
                            ref={passwordInputRef}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={onKeyDown}
                            className="relative z-10 h-full w-0 flex-grow bg-transparent text-foreground placeholder:text-foreground/60 focus:outline-none"
                          />
                          <div
                            className={cn(
                              "relative z-10 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
                              isPasswordValid ? "w-10 pr-1" : "w-0"
                            )}
                          >
                            <GlassButton
                              type="button"
                              onClick={onAdvance}
                              size="icon"
                              aria-label="Submit password"
                              contentClassName="text-foreground/80 hover:text-foreground"
                            >
                              <ArrowRight className="w-5 h-5" />
                            </GlassButton>
                          </div>
                        </div>
                      </div>
                      <BlurFade inView delay={0.2}>
                        <button
                          type="button"
                          onClick={onGoBack}
                          className="mt-4 flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" /> Go back
                        </button>
                      </BlurFade>
                    </div>
                  </BlurFade>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {flow.step === "confirmPassword" && (
            <BlurFade key="confirm-password-field" className="w-full">
              <div className="relative w-full">
                <AnimatePresence>
                  {confirmPassword.length > 0 && (
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -top-6 left-4 z-10"
                    >
                      <label className="text-xs text-muted-foreground font-semibold">Confirm Password</label>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="glass-input-wrap w-[300px]">
                  <div className="glass-input">
                    <span className="glass-input-text-area"></span>
                    <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 pl-2">
                      {isConfirmPasswordValid ? (
                        <button
                          type="button"
                          aria-label="Toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-foreground/80 hover:text-foreground transition-colors p-2 rounded-full"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      ) : (
                        <Lock className="h-5 w-5 text-foreground/80 flex-shrink-0" />
                      )}
                    </div>
                    <input
                      ref={confirmPasswordInputRef}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="relative z-10 h-full w-0 flex-grow bg-transparent text-foreground placeholder:text-foreground/60 focus:outline-none"
                    />
                    <div
                      className={cn(
                        "relative z-10 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
                        isConfirmPasswordValid ? "w-10 pr-1" : "w-0"
                      )}
                    >
                      <GlassButton
                        type="submit"
                        size="icon"
                        aria-label="Finish sign-up"
                        contentClassName="text-foreground/80 hover:text-foreground"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </div>
              <BlurFade inView delay={0.2}>
                <button
                  type="button"
                  onClick={onGoBack}
                  className="mt-4 flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Go back
                </button>
              </BlurFade>
            </BlurFade>
          )}
        </AnimatePresence>
      </form>

      {/* ---- Mode toggle (login <-> signup) ---- */}
      <BlurFade delay={0.25 * 6}>
        <button
          type="button"
          onClick={onSwitchMode}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {flow.mode === "signup" ? (
            <>
              Already have an account? <span className="font-semibold text-foreground">Log in</span>
            </>
          ) : (
            <>
              New here? <span className="font-semibold text-foreground">Create an account</span>
            </>
          )}
        </button>
      </BlurFade>
    </fieldset>
  );
}

export default AuthForm;
 