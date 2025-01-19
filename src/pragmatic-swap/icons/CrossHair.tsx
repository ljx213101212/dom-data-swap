import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import Icon from "@ant-design/icons/lib/components/Icon";

const CrossHairSvg = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_142_609)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.4375 2.08498C5.05464 2.35643 2.35644 5.05463 2.085 8.4375H4.12503C4.43569 8.4375 4.68753 8.68934 4.68753 9C4.68753 9.31066 4.43569 9.5625 4.12503 9.5625H2.085C2.35644 12.9454 5.05464 15.6436 8.4375 15.915V13.875C8.4375 13.5643 8.68934 13.3125 9 13.3125C9.31066 13.3125 9.5625 13.5643 9.5625 13.875V15.915C12.9454 15.6436 15.6436 12.9454 15.9151 9.5625H13.5C13.1893 9.5625 12.9375 9.31066 12.9375 9C12.9375 8.68934 13.1893 8.4375 13.5 8.4375H15.9151C15.6436 5.05461 12.9454 2.3564 9.5625 2.08497V4.125C9.5625 4.43566 9.31066 4.6875 9 4.6875C8.68934 4.6875 8.4375 4.43566 8.4375 4.125V2.08498ZM9 0.9375C4.54722 0.937513 0.937531 4.54721 0.937531 9C0.937531 13.4516 4.54525 17.0605 8.99636 17.0625H9H9.00003C13.4528 17.0625 17.0625 13.4528 17.0625 9C17.0625 4.5472 13.4528 0.9375 9.00003 0.9375C9.00002 0.9375 9.00001 0.9375 9 0.9375Z"
        fill="#333333"
      />
    </g>
    <defs>
      <clipPath id="clip0_142_609">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const CrossHair = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={CrossHairSvg} {...props} />
);

export default CrossHair;
