import { useState, useEffect } from 'react';

export default function AnimatedNumber({ end, duration = 900, prefix = '', decimals = 0 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        const finalValue = parseFloat(end) || 0;
        if (finalValue === 0) return;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Super smooth easeOut easing
            const easeProgress = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

            setCount(finalValue * easeProgress);

            if (percentage < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration]);

    return (
        <span>{prefix}{count.toFixed(decimals)}</span>
    );
}
