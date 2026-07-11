export const PMLogoCompact = () => {
    return (
        <svg
            width="42"
            height="42"
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient
                    id="pmGradientCompact"
                    x1="0"
                    y1="0"
                    x2="42"
                    y2="42"
                >
                    <stop
                        offset="0%"
                        stopColor="var(--color-primary)"
                    />
                    <stop
                        offset="100%"
                        stopColor="var(--color-secondary)"
                    />
                </linearGradient>
            </defs>

            {/* Board */}
            <rect
                x="4"
                y="6"
                width="34"
                height="30"
                rx="8"
                fill="url(#pmGradientCompact)"
            />

            <rect
                x="10"
                y="21"
                width="4"
                height="8"
                rx="1"
                fill="white"
            />

            <rect
                x="18"
                y="16"
                width="4"
                height="13"
                rx="1"
                fill="white"
            />

            <rect
                x="26"
                y="12"
                width="4"
                height="17"
                rx="1"
                fill="white"
            />

            <path
                d="M12 16L17 21L28 10"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};