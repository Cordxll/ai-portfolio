export default function UnderConstruction(){
    return (
        <>
            <style>{`@keyframes rotateY {
                from { transform: rotateY(0deg); }
                to   { transform: rotateY(360deg); }
            }
            `}</style>

            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 0,
                padding: 0,
                perspective: '1000px' // gives depth for 3D rotation
            }}>
                <div style={{
                    display: 'inline-block',
                    position: 'relative',
                    padding: '1rem 2rem',
                    transformStyle: 'preserve-3d',
                    animation: 'rotateY 4s linear infinite',
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
                        <div style={{ whiteSpace: 'nowrap' }}>Under Construction</div>
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
                        <div style={{ whiteSpace: 'nowrap' }}>Under Construction</div>
                    </div>
                </div>
            </div>
        </>
    )
}