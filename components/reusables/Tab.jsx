import { useState } from "react";
import { BiExport } from "react-icons/bi";
import Typography from "./typography/Typography";
import { FaFilter } from "react-icons/fa";

const Tab = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  return (
    <div className="w-full">
      <div className="flex w-full md:flex-row flex-col-reverse md:items-center gap-y-8  justify-between">
        <div className="flex gap-7 border-gray-300 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              className={`py-0 px-4 text-md  ${
                activeTab === tab.label
                  ? "border-b-2 border-accent text-accent font-bold"
                  : "text-accent/30 hover:text-accent"
              }`}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-8 self-end">
          <div className="export px-4 text-accent text-lg flex items-center gap-2 border border-gray-500 rounded-lg p-3">
            <BiExport />
            <Typography>Export</Typography>
          </div>
          <div className="export px-4 text-accent text-lg flex items-center gap-2 border border-gray-500 rounded-lg p-3">
            <FaFilter />
            <Typography>Filter</Typography>
          </div>
        </div>
      </div>
      <div>
        {tabs.map((tab) => (
          <div
            key={tab.label}
            className={`${activeTab === tab.label ? "block" : "hidden"}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tab;
