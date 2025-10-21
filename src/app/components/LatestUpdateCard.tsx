// components/LatestUpdateCard.tsx
import React from "react";

type LatestUpdateCardProps = {
  image: string;
  title: string;
  date: string;
  author: string;
};

const LatestUpdateCard: React.FC<LatestUpdateCardProps> = ({
  image,
  title,
  date,
  author,
}) => {
  return (
    <div className="flex items-center mb-4 bg-white p-4 rounded-lg shadow-md">
      <img
        src={image}
        alt={title}
        className="w-20 h-20 object-cover rounded-lg mr-4"
      />
      <div>
        <h4 className="text-black font-semibold">{title}</h4>
        <p className="text-gray-500 text-sm">{date}</p>
        {author && <p className="text-gray-400 text-xs">By {author}</p>}
      </div>
    </div>
  );
};

export default LatestUpdateCard;
