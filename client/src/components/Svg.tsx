export const svgNames: { [key: string]: string } = Object.freeze({
  copyIcon: "copyIcon",
  paintFill: "paintFill"
});

const svgs: { [key: string]: JSX.Element } = Object.freeze({
  [svgNames.copyIcon]: (
    <svg
      focusable="false"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      tabIndex={-1}
      fill="white"
      style={{ outline: "none", border: "none" }}
    >
      <path d="M15 20H5V7c0-.55-.45-1-1-1s-1 .45-1 1v13c0 1.1.9 2 2 2h10c.55 0 1-.45 1-1s-.45-1-1-1zm5-4V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2zm-2 0H9V4h9v12z"></path>
    </svg>
  ),
  [svgNames.paintFill]: (
    <svg
      focusable="false"
      viewBox="0 0 24 24"
      aria-hidden="true"
      tabIndex={-1}
      data-ga-event-category="material-icons"
      data-ga-event-action="click"
      data-ga-event-label="FormatColorFill"
    >
      <path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"></path>
    </svg>
  )
});

const SVG = (svgName: string) => svgs[svgName];

export default SVG;
