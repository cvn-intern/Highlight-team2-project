type DividerWithTextProps = {
  text?: string;
  dividerClassname?: string;
  textClassname?: string;
  className?: string
  noText?: boolean
};

const DividerWithText = (props: DividerWithTextProps) => {
  const { text, className="", dividerClassname = '', textClassname = '', noText = false } = props;

  return (
    <div className={`w-full flex items-center justify-between ${noText ? "gap-0" : "gap-3"} ${className} `}>
      <hr className={`h-[1px] flex-1 bg-gray-300 ${dividerClassname} ${noText && "w-full"}`} />
      {text && (
        <span className={`${textClassname}`}>
          {text}
        </span>
      )}
      <hr className={`h-[1px] flex-1 bg-gray-300 ${dividerClassname}`} />
    </div>
  );
};

export default DividerWithText;