export default function Bars({ color = 'currentColor', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill={color}>
      <rect x="1" y="6" width="3" height="8" rx="1.5">
        <animate attributeName="height" values="8;14;8" dur="0.9s" repeatCount="indefinite" begin="0s" />
        <animate attributeName="y" values="6;3;6" dur="0.9s" repeatCount="indefinite" begin="0s" />
      </rect>
      <rect x="6" y="3" width="3" height="14" rx="1.5">
        <animate attributeName="height" values="14;7;14" dur="0.9s" repeatCount="indefinite" begin="0.2s" />
        <animate attributeName="y" values="3;6;3" dur="0.9s" repeatCount="indefinite" begin="0.2s" />
      </rect>
      <rect x="11" y="1" width="3" height="18" rx="1.5">
        <animate attributeName="height" values="18;10;18" dur="0.9s" repeatCount="indefinite" begin="0.1s" />
        <animate attributeName="y" values="1;5;1" dur="0.9s" repeatCount="indefinite" begin="0.1s" />
      </rect>
      <rect x="16" y="4" width="3" height="12" rx="1.5">
        <animate attributeName="height" values="12;18;12" dur="0.9s" repeatCount="indefinite" begin="0.3s" />
        <animate attributeName="y" values="4;1;4" dur="0.9s" repeatCount="indefinite" begin="0.3s" />
      </rect>
    </svg>
  )
}
