export const ConnectIcon = ({ className = "w-7 h-7", connected = false }: { className?: string; connected?: boolean }) => {
  return (
    <div className="inline-flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{
          stroke: "currentColor",
        }}
      >
        {/* Top right line */}
        <path
          d="M19 5l3 -3"
        />

        {/* Bottom left line */}
        <path
          d="m2 22 3-3"
        />

        {/* Socket (bottom piece) */}
        <g
          className={`transition-transform duration-300 ${
            connected
              ? 'translate-x-0.5 -translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0'
              : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
          }`}
        >
          <path
            d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"
          />
          <path d="M7.5 13.5 l2.5 -2.5" />
          <path d="M10.5 16.5 l2.5 -2.5" />
        </g>

        {/* Plug (top piece) */}
        <path
          d="m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z"
          className={`transition-transform duration-300 ${
            connected
              ? 'translate-x-[-1.5px] translate-y-[1.5px] group-hover:translate-x-0 group-hover:translate-y-0'
              : 'group-hover:translate-x-[-1.5px] group-hover:translate-y-[1.5px]'
          }`}
        />
      </svg>
    </div>
  );
};
