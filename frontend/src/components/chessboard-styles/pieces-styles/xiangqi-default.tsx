import { ReactNode } from "react";
// https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces
// By en:User:Cburnett - Own work
// This W3C - unspecified vector image was created with Inkscape., CC BY - SA 3.0, https://commons.wikimedia.org/w/index.php?curid=1499810

export const defaultPieces: Record<string, ReactNode> = {
  wA: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontSize={18}
        fontStyle="italic"
        style={{
          lineHeight: "100%",
        }}
        textAnchor="end"
        transform="translate(-79.688 -10.75)"
      />
      <g
        strokeLinecap="round"
        strokeLinejoin="bevel"
        transform="translate(-86.584 -10.25)"
      >
        <circle
          cx={42.5}
          cy={42.5}
          r={32.5}
          fill="#fedaa4"
          stroke="#000"
          strokeWidth={2}
          transform="translate(77.583 1.25)"
        />
        <circle
          cx={42.5}
          cy={42.5}
          r={32.5}
          fill="none"
          stroke="#c00"
          strokeWidth={2.233}
          transform="translate(82.018 5.684) scale(.89566)"
        />
      </g>
      <g fill="#fedaa4" stroke="#c00" strokeWidth={1.288}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.0007791999999998}
          d="M24.368 28.137a10.3 10.3 0 0 0-2.088 6.262c0 2.89 1.236 5.51 3.204 7.427-3.898 2.3-6.697 6.253-7.524 10.874h31.068c-.827-4.62-3.627-8.574-7.525-10.874 1.969-1.917 3.156-4.537 3.156-7.427 0-2.228-.765-4.304-1.99-6.02z"
          color="#000"
        />
        <path
          strokeLinejoin="round"
          strokeWidth={2.0007791999999998}
          d="m42.884 28.277-19.149-.152-4.334-10.482 10.07 2.29 4.273-5.647 3.8 6.17 10.98-2.026-5.64 9.846z"
        />
        <path
          strokeLinecap="round"
          strokeWidth={2.0007791999999998}
          d="m38.97 32.72-3.059 3.074h0M27.987 32.58l3.058 3.074h0"
        />
      </g>
    </svg>
  ),
  wP: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontSize={18}
        fontStyle="italic"
        style={{
          lineHeight: "100%",
        }}
        textAnchor="end"
        transform="translate(-68.11 -6.463)"
      />
      <g strokeLinecap="round">
        <g strokeLinejoin="bevel" transform="translate(-81.661 -10.705)">
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="#fedaa4"
            stroke="#000"
            strokeWidth={2}
            transform="translate(72.661 1.705)"
          />
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="none"
            stroke="#c00"
            strokeWidth={2.233}
            transform="translate(77.095 6.14) scale(.89566)"
          />
        </g>
        <path
          fill="none"
          stroke="#c00"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M49.889 52.928c-1.148-4.81-4.324-8.845-8.597-11.074a12.248 12.248 0 0 0 4.469-9.471c0-5.4-3.508-9.97-8.355-11.608.364-.65.583-1.388.583-2.186a4.52 4.52 0 0 0-4.517-4.517 4.52 4.52 0 0 0-4.517 4.517c0 .802.265 1.533.632 2.186-4.864 1.628-8.354 6.196-8.354 11.608 0 3.81 1.75 7.215 4.468 9.47-4.273 2.23-7.45 6.264-8.597 11.075z"
          color="#000"
        />
      </g>
    </svg>
  ),
  wR: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontStyle="italic"
        style={{
          lineHeight: "0%",
        }}
        textAnchor="end"
        transform="translate(-9.687 -11.518)"
      >
        <tspan
          x={16.543}
          y={51.531}
          fontSize={18}
          style={{
            lineHeight: 1,
          }}
        />
      </text>
      <g
        strokeLinecap="round"
        strokeLinejoin="bevel"
        transform="translate(-21.75 -10.25)"
      >
        <circle
          cx={42.5}
          cy={42.5}
          r={32.5}
          fill="#fedaa4"
          stroke="#000"
          strokeWidth={2}
          transform="translate(12.75 1.25)"
        />
        <circle
          cx={42.5}
          cy={42.5}
          r={32.5}
          fill="none"
          stroke="#c00"
          strokeWidth={2.233}
          transform="translate(17.184 5.684) scale(.89566)"
        />
      </g>
      <g stroke="#c00" strokeWidth={1.357}>
        <path
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.0007607999999997}
          d="M24.545 26.23h17.903v15.008H24.545zM20.667 42.714h25.67v2.896h-25.67zM18.028 47.088h30.936v3.555H18.028zM46.793 16.366H41.08v3.64h-4.746v-3.64h-5.667v3.64H25.92v-3.64h-5.713l.046 8.386h26.493v-3.318z"
          color="#000"
        />
      </g>
    </svg>
  ),
  wN: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontStyle="italic"
        style={{
          lineHeight: "0%",
        }}
        textAnchor="end"
        transform="translate(-52.996 -7.877)"
      >
        <tspan
          x={16.543}
          y={51.531}
          fontSize={18}
          style={{
            lineHeight: 1,
          }}
        />
      </text>
      <g
        strokeLinecap="round"
        strokeLinejoin="bevel"
        transform="translate(-60.971 -11.059)"
      >
        <circle
          cx={42.5}
          cy={42.5}
          r={32.5}
          fill="#fedaa4"
          stroke="#000"
          strokeWidth={2}
          transform="translate(51.971 2.059)"
        />
        <circle
          cx={42.5}
          cy={42.5}
          r={32.5}
          fill="none"
          stroke="#c00"
          strokeWidth={2.233}
          transform="translate(56.405 6.493) scale(.89566)"
        />
      </g>
      <g
        stroke="#c00"
        transform="rotate(110.182 789.166 233.006) scale(1.66631)"
      >
        <path
          fill="none"
          strokeWidth={1.2}
          d="M509.85 611.92c4.028 6.206 12.506 4.967 20.506 1.154l-5.714-15.714c-2.331 1.655-3.722 2.525-6.072 5.357l-.714-5.715c.12-1.369-1.726-3.452-3.929-1.428l-3.571 7.857h-2.857c.1 2.013.376 3.752.802 5.242"
        />
        <circle
          cx={514.11}
          cy={602.81}
          r={0.982}
          fill="#a00"
          strokeWidth={1.795}
          color="#000"
          transform="translate(169.71 199.5) scale(.66867)"
        />
        <path
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.2}
          d="m512.05 607.36-7.232 2.054c1.855 2.078 5.5 3.023 8.482 2.321"
        />
      </g>
    </svg>
  ),
  wB: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontSize={18}
        fontStyle="italic"
        style={{
          lineHeight: "100%",
        }}
        textAnchor="end"
        transform="translate(-71.063 -10.25)"
      />
      <g
        strokeLinecap="round"
        strokeLinejoin="bevel"
        transform="translate(-91.25 -11)"
      >
        <circle
          cx={42.5}
          cy={42.5}
          r={32.5}
          fill="#fedaa4"
          stroke="#000"
          strokeWidth={2}
          transform="translate(82.25 2)"
        />
        <circle
          cx={42.5}
          cy={42.5}
          r={32.5}
          fill="none"
          stroke="#c00"
          strokeWidth={2.233}
          transform="translate(86.684 6.434) scale(.89566)"
        />
      </g>
      <g
        stroke="#c00"
        strokeLinejoin="round"
        transform="matrix(0 1.652 -1.549 0 1030.55 -552.77)"
      >
        <g fill="none" strokeWidth={1.25}>
          <path d="M358.98 643.06c1.253-1.107 3.443-1.527 5.446-1.071l-.142 14.393c-.03 2.947-7.411-.893-7.411-.893" />
          <path d="M354.38 646.92s3.024.662 3.84 2.679-1.608 8.214-1.608 8.214-9.73-4.526-10.357-5.804.268-4.553.268-4.553c-4.171-7.794 3.721-9.584 9.245-10.671l.312-1.962-4.827-1.206.05-2.15c6.91 1.15 14.317 3.643 7.184 8.935 0 0 .42 1.555.319 3.018-.102 1.463-4.426 3.5-4.426 3.5z" />
          <path d="m358.5 642.28-1.64-12.762-1.687 12.96z" />
        </g>
        <circle
          cx={366.65}
          cy={444.73}
          r={0.753}
          fill="#a00"
          strokeLinecap="round"
          strokeWidth={1.68}
          color="#000"
          transform="translate(78.14 309.27) scale(.74438)"
        />
      </g>
    </svg>
  ),
  wQ: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontStyle="italic"
        style={{
          lineHeight: "0%",
        }}
        textAnchor="end"
        transform="translate(-100.46 -8.23)"
      >
        <tspan
          x={16.543}
          y={51.531}
          fontSize={18}
          style={{
            lineHeight: 1,
          }}
        />
      </text>
      <g transform="translate(-91.206 -9.645)">
        <circle
          cx={42.5}
          cy={42.5}
          r={32.5}
          fill="#fedaa4"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={2}
          transform="translate(82.207 .645)"
        />
        <circle
          cx={42.5}
          cy={42.5}
          r={32.5}
          fill="none"
          stroke="#c00"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={2.233}
          transform="translate(86.641 5.08) scale(.89566)"
        />
        <g
          fill="none"
          stroke="#c00"
          strokeWidth={1.213}
          transform="matrix(0 1.6096 -1.6897 0 1021.1 -482.73)"
        >
          <circle
            cx={328.36}
            cy={530.18}
            r={3.094}
            strokeLinecap="round"
            strokeLinejoin="round"
            color="#000"
          />
          <circle
            cx={328.36}
            cy={530.49}
            r={5.114}
            strokeLinecap="round"
            strokeLinejoin="round"
            color="#000"
            transform="translate(0 -.316)"
          />
          <path d="M328.93 525.19c.105-1.452-.295-5.24-.568-8.27l-3.346-.064c-2.829 7.31-5.76 14.201-4.925 18.183.836 3.982 5.193 5.539 7.955 2.463l1.957 2.777v3.725l2.273.19-.063-4.357-2.904-4.482" />
        </g>
      </g>
    </svg>
  ),
  wK: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontStyle="italic"
        style={{
          lineHeight: "0%",
        }}
        textAnchor="end"
        transform="translate(-44.438 -9.75)"
      >
        <tspan
          x={16.543}
          y={51.531}
          fontSize={18}
          style={{
            lineHeight: 1,
          }}
        />
      </text>
      <g
        strokeLinecap="round"
        strokeLinejoin="bevel"
        transform="translate(-21.75 -10.25)"
      >
        <circle
          cx={42.5}
          cy={42.5}
          r={32.5}
          fill="#fedaa4"
          stroke="#000"
          strokeWidth={2}
          transform="translate(12.75 1.25)"
        />
        <circle
          cx={42.5}
          cy={42.5}
          r={32.5}
          fill="none"
          stroke="#c00"
          strokeWidth={2.233}
          transform="translate(17.184 5.684) scale(.89566)"
        />
      </g>
      <g fill="none" stroke="#c00" strokeWidth={2}>
        <path
          strokeWidth={3.294}
          d="M30.491 26.76s-3.985-4.129-11.354-2.621c-7.37 1.508-5.01 9.966-2.706 15.197s6.938 14.586 6.938 14.586l22.476.064s4.243-8.506 5.859-13.677c1.615-5.171 2.46-15.46-3.829-16.42-6.287-.958-11.59 2.802-11.59 2.802M48.376 48.917l-26.956-.152M35.711 48.827l.361-24.468M30.635 48.953l.096-24.65"
        />
        <path
          strokeLinejoin="round"
          strokeWidth={3.294}
          d="m35.769 16.462 4.031-.658-.172 5.607-4.46-.586 2.077 3.208-7.616-.177 1.931-3.649-4.953.774.44-4.995 4.317.808-1.052-3.744 6.726.075z"
        />
      </g>
    </svg>
  ),
  wC: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontStyle="italic"
        style={{
          lineHeight: "0%",
        }}
        textAnchor="end"
        transform="translate(-100.46 -8.23)"
      >
        <tspan
          x={16.543}
          y={51.531}
          fontSize={18}
          style={{
            lineHeight: 1,
          }}
        />
      </text>
      <g transform="translate(-91.206 -9.645)">
        <circle
          cx={42.5}
          cy={42.5}
          r={32.5}
          fill="#fedaa4"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={2}
          transform="translate(82.207 .645)"
        />
        <circle
          cx={42.5}
          cy={42.5}
          r={32.5}
          fill="none"
          stroke="#c00"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          strokeWidth={2.233}
          transform="translate(86.641 5.08) scale(.89566)"
        />
        <g
          fill="none"
          stroke="#c00"
          strokeWidth={1.213}
          transform="matrix(0 1.6096 -1.6897 0 1021.1 -482.73)"
        >
          <circle
            cx={328.36}
            cy={530.18}
            r={3.094}
            strokeLinecap="round"
            strokeLinejoin="round"
            color="#000"
          />
          <circle
            cx={328.36}
            cy={530.49}
            r={5.114}
            strokeLinecap="round"
            strokeLinejoin="round"
            color="#000"
            transform="translate(0 -.316)"
          />
          <path d="M328.93 525.19c.105-1.452-.295-5.24-.568-8.27l-3.346-.064c-2.829 7.31-5.76 14.201-4.925 18.183.836 3.982 5.193 5.539 7.955 2.463l1.957 2.777v3.725l2.273.19-.063-4.357-2.904-4.482" />
        </g>
      </g>
    </svg>
  ),
  bA: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontStyle="italic"
        style={{
          lineHeight: "0%",
        }}
        textAnchor="end"
        transform="translate(-217.69 -10.75)"
      >
        <tspan
          x={16.543}
          y={51.531}
          fontSize={18}
          style={{
            lineHeight: 1,
          }}
        />
      </text>
      <g stroke="#000">
        <g
          strokeLinecap="round"
          strokeLinejoin="bevel"
          transform="translate(-226.502 -10.25)"
        >
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="#fedaa4"
            strokeWidth={2}
            transform="translate(217.5 1.25)"
          />
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="none"
            strokeWidth={2.233}
            transform="translate(221.93 5.684) scale(.89566)"
          />
        </g>
        <g fill="#fedaa4" strokeWidth={1.288}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.0007791999999998}
            d="M24.369 28.137a10.3 10.3 0 0 0-2.087 6.262c0 2.89 1.235 5.51 3.203 7.427-3.897 2.3-6.697 6.253-7.524 10.874H49.03c-.827-4.62-3.626-8.574-7.524-10.874 1.968-1.917 3.155-4.537 3.155-7.427 0-2.228-.764-4.304-1.99-6.02z"
            color="#000"
          />
          <path
            strokeLinejoin="round"
            strokeWidth={2.0007791999999998}
            d="m42.886 28.277-19.15-.152-4.334-10.482 10.07 2.29 4.273-5.647 3.8 6.17 10.98-2.026-5.64 9.846z"
          />
          <path
            strokeLinecap="round"
            strokeWidth={2.0007791999999998}
            d="m38.971 32.72-3.058 3.074h0M27.988 32.58l3.059 3.074h0"
          />
        </g>
      </g>
    </svg>
  ),
  bP: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontSize={18}
        fontStyle="italic"
        style={{
          lineHeight: "100%",
        }}
        textAnchor="end"
        transform="translate(-206.11 -6.463)"
      />
      <g stroke="#000" strokeLinecap="round">
        <g strokeLinejoin="bevel" transform="translate(-175.692 -6.463)">
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="#fedaa4"
            strokeWidth={2}
            transform="translate(166.69 -2.537)"
          />
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="none"
            strokeWidth={2.233}
            transform="translate(171.13 1.897) scale(.89566)"
          />
        </g>
        <path
          fill="none"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M49.888 52.928c-1.148-4.81-4.324-8.845-8.597-11.074a12.248 12.248 0 0 0 4.469-9.47c0-5.4-3.508-9.97-8.355-11.609.364-.65.583-1.388.583-2.186a4.52 4.52 0 0 0-4.517-4.517 4.52 4.52 0 0 0-4.517 4.517c0 .803.265 1.533.632 2.186-4.864 1.629-8.354 6.197-8.354 11.608 0 3.81 1.75 7.215 4.468 9.471-4.273 2.23-7.45 6.264-8.597 11.074z"
          color="#000"
        />
      </g>
    </svg>
  ),
  bR: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontStyle="italic"
        style={{
          lineHeight: "0%",
        }}
        textAnchor="end"
        transform="translate(-147.69 -11.518)"
      >
        <tspan
          x={16.543}
          y={51.531}
          fontSize={18}
          style={{
            lineHeight: 1,
          }}
        />
      </text>
      <g stroke="#000">
        <g
          strokeLinecap="round"
          strokeLinejoin="bevel"
          transform="translate(-97.753 -10.25)"
        >
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="#fedaa4"
            strokeWidth={2}
            transform="translate(88.75 1.25)"
          />
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="none"
            strokeWidth={2.233}
            transform="translate(93.184 5.684) scale(.89566)"
          />
        </g>
        <g strokeWidth={1.357}>
          <path
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.0007607999999997}
            d="M24.542 26.23h17.904v15.008H24.542zM20.664 42.714h25.671v2.896h-25.67zM18.025 47.088h30.936v3.555H18.025zM46.79 16.366h-5.713v3.64h-4.745v-3.64h-5.668v3.64h-4.746v-3.64h-5.713l.046 8.386h26.494v-3.318z"
            color="#000"
          />
        </g>
      </g>
    </svg>
  ),
  bN: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontStyle="italic"
        style={{
          lineHeight: "0%",
        }}
        textAnchor="end"
        transform="translate(-191 -7.877)"
      >
        <tspan
          x={16.543}
          y={51.531}
          fontSize={18}
          style={{
            lineHeight: 1,
          }}
        />
      </text>
      <g stroke="#000">
        <g
          strokeLinecap="round"
          strokeLinejoin="bevel"
          transform="translate(-194.972 -7.877)"
        >
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="#fedaa4"
            strokeWidth={2}
            transform="translate(185.97 -1.123)"
          />
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="none"
            strokeWidth={2.233}
            transform="translate(190.4 3.311) scale(.89566)"
          />
        </g>
        <g transform="rotate(110.182 789.593 233.565) scale(1.66631)">
          <path
            fill="none"
            strokeWidth={1.2}
            d="M509.85 611.92c4.028 6.206 12.506 4.967 20.506 1.154l-5.714-15.714c-2.331 1.655-3.722 2.525-6.072 5.357l-.714-5.715c.12-1.369-1.726-3.452-3.929-1.428l-3.571 7.857h-2.857c.1 2.013.376 3.752.802 5.242"
          />
          <circle
            cx={514.11}
            cy={602.81}
            r={0.982}
            fill="#a00"
            strokeWidth={1.795}
            color="#000"
            transform="translate(169.71 199.5) scale(.66867)"
          />
          <path
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="m512.05 607.36-7.232 2.054c1.855 2.078 5.5 3.023 8.482 2.321"
          />
        </g>
      </g>
    </svg>
  ),
  bB: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontSize={18}
        fontStyle="italic"
        style={{
          lineHeight: "100%",
        }}
        textAnchor="end"
        transform="translate(-209.06 -10.25)"
      />
      <g stroke="#000">
        <g
          strokeLinecap="round"
          strokeLinejoin="bevel"
          transform="translate(-228.997 -9.75)"
        >
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="#fedaa4"
            strokeWidth={2}
            transform="translate(220 .75)"
          />
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="none"
            strokeWidth={2.233}
            transform="translate(224.43 5.184) scale(.89566)"
          />
        </g>
        <g
          strokeLinejoin="round"
          transform="matrix(0 1.652 -1.549 0 1030.503 -552.77)"
        >
          <g fill="none" strokeWidth={1.25}>
            <path d="M358.98 643.06c1.253-1.107 3.443-1.527 5.446-1.071l-.142 14.393c-.03 2.947-7.411-.893-7.411-.893" />
            <path d="M354.38 646.92s3.024.662 3.84 2.679-1.608 8.214-1.608 8.214-9.73-4.526-10.357-5.804.268-4.553.268-4.553c-4.171-7.794 3.721-9.584 9.245-10.671l.312-1.962-4.827-1.206.05-2.15c6.91 1.15 14.317 3.643 7.184 8.935 0 0 .42 1.555.319 3.018-.102 1.463-4.426 3.5-4.426 3.5z" />
            <path d="m358.5 642.28-1.64-12.762-1.687 12.96z" />
          </g>
          <circle
            cx={366.65}
            cy={444.73}
            r={0.753}
            fill="#a00"
            strokeLinecap="round"
            strokeWidth={1.68}
            color="#000"
            transform="translate(78.14 309.27) scale(.74438)"
          />
        </g>
      </g>
    </svg>
  ),
  bQ: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="45"
      height="45"
    >
      <g
        style={{
          fill: "#000000",
          stroke: "#000000",
          strokeWidth: "1.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      >
        <path
          d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z"
          style={{ strokeLinecap: "butt", fill: "#000000" }}
        />
        <path d="m 9,26 c 0,2 1.5,2 2.5,4 1,1.5 1,1 0.5,3.5 -1.5,1 -1,2.5 -1,2.5 -1.5,1.5 0,2.5 0,2.5 6.5,1 16.5,1 23,0 0,0 1.5,-1 0,-2.5 0,0 0.5,-1.5 -1,-2.5 -0.5,-2.5 -0.5,-2 0.5,-3.5 1,-2 2.5,-2 2.5,-4 -8.5,-1.5 -18.5,-1.5 -27,0 z" />
        <path d="M 11.5,30 C 15,29 30,29 33.5,30" />
        <path d="m 12,33.5 c 6,-1 15,-1 21,0" />
        <circle cx="6" cy="12" r="2" />
        <circle cx="14" cy="9" r="2" />
        <circle cx="22.5" cy="8" r="2" />
        <circle cx="31" cy="9" r="2" />
        <circle cx="39" cy="12" r="2" />
        <path
          d="M 11,38.5 A 35,35 1 0 0 34,38.5"
          style={{ fill: "none", stroke: "#000000", strokeLinecap: "butt" }}
        />
        <g style={{ fill: "none", stroke: "#ffffff" }}>
          <path d="M 11,29 A 35,35 1 0 1 34,29" />
          <path d="M 12.5,31.5 L 32.5,31.5" />
          <path d="M 11.5,34.5 A 35,35 1 0 0 33.5,34.5" />
          <path d="M 10.5,37.5 A 35,35 1 0 0 34.5,37.5" />
        </g>
      </g>
    </svg>
  ),
  bK: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontStyle="italic"
        style={{
          lineHeight: "0%",
        }}
        textAnchor="end"
        transform="translate(-182.44 -9.75)"
      >
        <tspan
          x={16.543}
          y={51.531}
          fontSize={18}
          style={{
            lineHeight: 1,
          }}
        />
      </text>
      <g stroke="#000">
        <g
          strokeLinecap="round"
          strokeLinejoin="bevel"
          transform="translate(-97.752 -10.25)"
        >
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="#fedaa4"
            strokeWidth={2}
            transform="translate(88.75 1.25)"
          />
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="none"
            strokeWidth={2.233}
            transform="translate(93.184 5.684) scale(.89566)"
          />
        </g>
        <g fill="none" strokeWidth={2}>
          <path
            strokeWidth={3.294}
            d="M30.49 26.76s-3.986-4.129-11.355-2.621c-7.37 1.508-5.01 9.966-2.706 15.197s6.938 14.586 6.938 14.586l22.476.064s4.243-8.506 5.859-13.677c1.615-5.171 2.46-15.46-3.829-16.42-6.287-.958-11.59 2.802-11.59 2.802M48.374 48.917l-26.956-.152M35.71 48.827l.36-24.468M30.633 48.953l.096-24.65"
          />
          <path
            strokeLinejoin="round"
            strokeWidth={3.294}
            d="m35.767 16.462 4.031-.658-.172 5.607-4.46-.586 2.077 3.208-7.616-.177 1.931-3.649-4.953.774.44-4.995 4.317.808-1.052-3.744 6.726.075z"
          />
        </g>
      </g>
    </svg>
  ),
  bC: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67">
      <text
        xmlSpace="preserve"
        x={10.813}
        y={51.531}
        fontFamily="'DejaVu Serif'"
        fontSize={18}
        fontStyle="italic"
        style={{
          lineHeight: "100%",
        }}
        textAnchor="end"
        transform="translate(-238.46 -8.23)"
      />
      <g stroke="#000">
        <g
          strokeLinecap="round"
          strokeLinejoin="bevel"
          transform="translate(-228.725 -8.23)"
        >
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="#fedaa4"
            strokeWidth={2}
            transform="translate(219.73 -.77)"
          />
          <circle
            cx={42.5}
            cy={42.5}
            r={32.5}
            fill="none"
            strokeWidth={2.233}
            transform="translate(224.16 3.665) scale(.89566)"
          />
        </g>
        <g
          fill="none"
          strokeWidth={1.213}
          transform="matrix(0 1.6096 -1.6897 0 929.875 -492.38)"
        >
          <circle
            cx={328.36}
            cy={530.18}
            r={3.094}
            strokeLinecap="round"
            strokeLinejoin="round"
            color="#000"
          />
          <circle
            cx={328.36}
            cy={530.49}
            r={5.114}
            strokeLinecap="round"
            strokeLinejoin="round"
            color="#000"
            transform="translate(0 -.316)"
          />
          <path d="M328.93 525.19c.105-1.452-.295-5.24-.568-8.27l-3.346-.064c-2.829 7.31-5.76 14.201-4.925 18.183.836 3.982 5.193 5.539 7.955 2.463l1.957 2.777v3.725l2.273.19-.063-4.357-2.904-4.482" />
        </g>
      </g>
    </svg>
  ),
};
