import React from 'react';

type ActionCardProps = {
  icon: React.ReactNode;
  label: string;
};

const ActionCard: React.FC<ActionCardProps> = ({ icon, label }) => {
  return (
    <div className="flex items-center justify-between p-8 bg-accent rounded hover:bg-ring transition cursor-pointer max-h-max">
      <div className="flex items-center space-x-2">
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="text-gray-400">{'>'}</span>
    </div>
  );
};

export default ActionCard;
