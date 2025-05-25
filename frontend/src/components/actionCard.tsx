import React from 'react';

type ActionCardProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

const ActionCard: React.FC<ActionCardProps> = ({ icon, label, onClick }) => {
  return (
    <button className="flex items-center justify-between p-8 bg-accent rounded hover:bg-ring transition cursor-pointer max-h-max" onClick={onClick}>
      <div className="flex items-center space-x-2">
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="text-gray-400">{'>'}</span>
    </button>
  );
};

export default ActionCard;
