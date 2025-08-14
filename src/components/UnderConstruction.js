import React, { useEffect, useRef } from 'react';

export default function UnderConstruction(){
    const rotRef = useRef(null);
    const angleRef = useRef(0);
    // degrees per millisecond (starts slow)
    const velRef = useRef(0.0002); // slower start
    // acceleration in degrees per millisecond squared (controls how quickly it speeds up)
    const accRef = useRef(0.00003); // slower acceleration
    const lastRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        lastRef.current = performance.now();
        const step = (now) => {
            const last = lastRef.current || now;
            const dt = now - last; // milliseconds since last frame
            lastRef.current = now;

            // increase velocity by acceleration * dt (no cap)
            velRef.current += accRef.current * dt;

            // advance angle
            angleRef.current += velRef.current * dt;

            // apply rotation
            if (rotRef.current) rotRef.current.style.transform = `rotateY(${angleRef.current}deg)`;

            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
        <>
            <style>{`/* small, centered text */
                .uc-text { white-space: nowrap; font-size: 1rem; }
                @media (min-width:800px) { .uc-text { font-size: 1.4rem; } }
            `}</style>

            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 0,
                padding: 0,
                perspective: '1000px',
                position: 'relative' /* allow absolutely positioned shadow */
            }}>

                {/* soft shadow under the rotating text (not rotated) */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '55%',
                    transform: 'translateX(-50%)',
                    width: '20%',
                    maxWidth: '320px',
                    height: '10px',
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.14) 40%, rgba(0,0,0,0.02) 100%)',
                    borderRadius: '50%',
                    filter: 'blur(6px)',
                    opacity: 0.8,
                    pointerEvents: 'none'
                }} />

                <div ref={rotRef} style={{
                    display: 'inline-block',
                    position: 'relative',
                    padding: '1rem 2rem',
                    transformStyle: 'preserve-3d',
                    transformOrigin: '50% 50%'
                }}>
                    {/* front face */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backfaceVisibility: 'hidden'
                    }}>
                        <div className="uc-text">Under Construction</div>
                    </div>

                    {/* back face (rotated so it reads correctly when visible) */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        transform: 'translateY(-50%) rotateY(180deg)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backfaceVisibility: 'hidden'
                    }}>
                        <div className="uc-text">Under Construction</div>
                    </div>
                </div>
            </div>
        </>
    )
}