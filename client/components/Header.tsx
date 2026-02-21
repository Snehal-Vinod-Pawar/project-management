import React from "react";
type Props = {
  name: string;
  subtitle?: string;
  buttonComponent?: any;
  isSmallText?: boolean;
  showDivider?: boolean;
};

const Header = ({ 
  name, 
  subtitle,
  buttonComponent, 
  isSmallText = false,
  showDivider = true 
}: Props) => {
  return (
    <div className={`mb-6 ${showDivider ? 'pb-5 border-b border-gray-200' : ''}`}>
      <div className="flex w-full items-center justify-between">
        <div className="flex-1">
          <h1
            className={`${
              isSmallText ? "text-lg" : "text-3xl"
            } font-bold text-gray-900 tracking-tight`}
          >
            {name}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
        {buttonComponent && (
          <div className="ml-4 flex-shrink-0">
            {buttonComponent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;