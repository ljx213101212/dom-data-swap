import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const MinusSvg = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.51486 8.22956L8.48186 8.22656H3.01486C2.63286 8.22656 2.31386 8.51356 2.26286 8.88256L2.25586 9.01456C2.25586 9.43156 2.59786 9.77256 3.01486 9.77256H14.9849C15.4032 9.77147 15.7422 9.4329 15.7439 9.01456V8.98456C15.7422 8.56623 15.4032 8.22766 14.9849 8.22656L9.51486 8.22956Z"
      fill="black"
    />
  </svg>
);

export const Minus = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={MinusSvg} {...props} />
);

export default Minus;
