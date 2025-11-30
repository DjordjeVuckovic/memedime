import solLogo from '@/assets/imgs/sol-logo.svg'

export function RobotIcon() {
  return (
    <svg
      viewBox="0 0 240 200"
      className="w-40 sm:w-56 md:w-72 lg:w-96 mx-auto drop-shadow-2xl animate-float"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Purple gradient for head */}
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgb(168, 85, 247)" />
          <stop offset="100%" stopColor="rgb(126, 34, 206)" />
        </linearGradient>

        {/* Gold gradient for coins */}
        <radialGradient id="coinGrad">
          <stop offset="0%" stopColor="rgb(251, 191, 36)" />
          <stop offset="70%" stopColor="rgb(245, 158, 11)" />
          <stop offset="100%" stopColor="rgb(217, 119, 6)" />
        </radialGradient>

        {/* Coin shine effect */}
        <radialGradient id="coinShine">
          <stop offset="0%" stopColor="rgb(254, 243, 199)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="rgb(251, 191, 36)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Antenna */}
      <line
        x1="120"
        y1="25"
        x2="120"
        y2="50"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle
        cx="120"
        cy="18"
        r="12"
        fill="black"
        stroke="black"
        strokeWidth="4"
      />
      {/* Solana logo on antenna */}
      <image
        href={solLogo}
        x="111"
        y="9"
        width="18"
        height="18"
      />

      {/* Robot Head (larger, main focus) */}
      <rect
        x="40"
        y="50"
        width="160"
        height="120"
        rx="12"
        fill="url(#purpleGrad)"
        stroke="black"
        strokeWidth="5"
      />

      {/* Head panel details */}
      <rect
        x="50"
        y="60"
        width="140"
        height="15"
        rx="4"
        fill="rgb(126, 34, 206)"
        stroke="black"
        strokeWidth="3"
      />

      {/* Left Solana Logo Eye */}
      <g>
        {/* Coin background circle */}
        <circle
          cx="85"
          cy="110"
          r="24"
          fill="black"
          stroke="black"
          strokeWidth="4"
        />
        {/* Solana logo */}
        <image
          href={solLogo}
          x="68"
          y="92"
          width="35"
          height="35"
        />
      </g>

      {/* Right Solana Logo Eye */}
      <g>
        {/* Coin background circle */}
        <circle
          cx="155"
          cy="110"
          r="24"
          fill="black"
          stroke="black"
          strokeWidth="4"
        />
        {/* Solana logo */}
        <image
          href={solLogo}
          x="138"
          y="92"
          width="35"
          height="35"
        />
      </g>

      {/* Mouth/Display (LED-style) */}
      <rect
        x="80"
        y="145"
        width="80"
        height="12"
        rx="6"
        fill="rgb(34, 211, 238)"
        stroke="black"
        strokeWidth="3"
      />
      {/* Display segments */}
      <line x1="100" y1="145" x2="100" y2="157" stroke="black" strokeWidth="2" />
      <line x1="120" y1="145" x2="120" y2="157" stroke="black" strokeWidth="2" />
      <line x1="140" y1="145" x2="140" y2="157" stroke="black" strokeWidth="2" />
    </svg>
  )
}
