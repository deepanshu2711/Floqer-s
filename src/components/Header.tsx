import { FaRegBell } from "react-icons/fa";

export const Header = () => {
  return (
    <div className="flex items-center justify-between py-5 px-[30px] border-b">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <h1 className="text-[38px] leading-[47.5px] font-bold text-[#6941C6]">
          Floqer
        </h1>
        <div className="flex items-center gap-5">
          <FaRegBell className="text-[#8e8e8f] border rounded-full p-2 h-10 w-10" />
          <div className="flex items-center gap-2">
            <img
              src={"/profile.png"}
              alt="profile"
              className="rounded-full h-[36px] w-[36px] border"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
