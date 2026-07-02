// ---------------------------------------------------------------------------
// STATUS MODAL
// ---------------------------------------------------------------------------
// The pop-up shown while an auth request is loading, or after it errors /
// succeeds. It's driven entirely by the `flow` object (status + mode) and
// tells the parent when to close via the onClose callback.
// ---------------------------------------------------------------------------
import { AnimatePresence, motion } from "framer-motion";
import { X, AlertCircle, PartyPopper, Loader, CheckCircle2 } from "lucide-react";
import { GlassButton } from "@/components/auth/GlassButton";
import { TextLoop } from "@/components/auth/TextLoop";

// The staged messages shown in the sign-up loading modal.
const modalSteps = [
  { message: "Creating your account...", icon: <Loader className="w-12 h-12 text-primary animate-spin" /> },
  { message: "Setting things up...", icon: <Loader className="w-12 h-12 text-primary animate-spin" /> },
  { message: "Almost there...", icon: <Loader className="w-12 h-12 text-primary animate-spin" /> },
  { message: "Welcome Aboard!", icon: <PartyPopper className="w-12 h-12 text-green-500" /> },
];
const TEXT_LOOP_INTERVAL = 1.2;

export function StatusModal({ flow, onClose }) {
  const modalOpen = flow.status !== "idle";
  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-card/80 border-4 border-border rounded-2xl p-8 w-full max-w-sm flex flex-col items-center gap-4 mx-2"
          >
            {(flow.status === "error" || flow.status === "success") && (
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {flow.status === "error" && (
              <>
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="text-lg font-medium text-foreground text-center">{flow.error}</p>
                <GlassButton onClick={onClose} size="sm" className="mt-4">
                  Try Again
                </GlassButton>
              </>
            )}
            {flow.status === "loading" && (
              <TextLoop interval={TEXT_LOOP_INTERVAL} stopOnEnd={true}>
                {modalSteps.slice(0, -1).map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-4">
                    {step.icon}
                    <p className="text-lg font-medium text-foreground">{step.message}</p>
                  </div>
                ))}
              </TextLoop>
            )}
            {flow.status === "success" && (
              <div className="flex flex-col items-center gap-4">
                {flow.mode === "signup" ? (
                  modalSteps[modalSteps.length - 1].icon
                ) : (
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                )}
                <p className="text-lg font-medium text-foreground">
                  {flow.mode === "signup" ? "Welcome Aboard!" : "Signed in!"}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StatusModal;
