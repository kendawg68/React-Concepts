// ---------------------------------------------------------------------------
// CONFETTI  (React concepts: forwardRef + useImperativeHandle + createContext)
// ---------------------------------------------------------------------------
// A <canvas> that can shoot confetti. The interesting part for students:
//   • forwardRef lets a PARENT attach a ref to this custom component.
//   • useImperativeHandle decides WHAT that ref exposes — here, a `.fire()`
//     method — instead of the raw DOM node.
//   • createContext makes the same `fire` available to descendants if needed.
// ---------------------------------------------------------------------------
import {
    forwardRef,
    useRef,
    useCallback,
    useMemo,
    useImperativeHandle,
    useEffect,
    createContext
} from "react";
import confetti from "canvas-confetti";

// Kept internal — descendants could read `fire` from here via useContext.
const ConfettiContext = createContext({});

export const Confetti = forwardRef((props, ref) => {
    const {
        options,
        globalOptions = { resize: true, useWorker: true },
        manualstart = false,
        ...rest
    } = props;
    const instanceRef = useRef(null);
    const canvasRef = useCallback(
        (node) => {
            if (node !== null) {
                if (instanceRef.current) return;
                instanceRef.current = confetti.create(node, { ...globalOptions, resize: true });
            } else {
                if (instanceRef.current) {
                    instanceRef.current.reset();
                    instanceRef.current = null;
                }
            }
        },
        [globalOptions]
    );
    const fire = useCallback(
        (opts = {}) => instanceRef.current?.({ ...options, ...opts }),
        [options]
    );
    const api = useMemo(() => ({ fire }), [fire]);
    useImperativeHandle(ref, () => api, [api]);
    useEffect(() => {
        if (!manualstart) fire();
    }, [manualstart, fire]);
    return (
        <ConfettiContext.Provider value={api}>
            <canvas ref={canvasRef} {...rest} />
        </ConfettiContext.Provider>
    );
});
Confetti.displayName = "Confetti";

export default Confetti;
