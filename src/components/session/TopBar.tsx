import { Pencil } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="mb-3 flex items-center justify-center rounded-2xl bg-primary_black p-3 text-primary_white">
      <div className="flex items-center gap-2">
        <Pencil className="h-6 w-6 text-primary_yellow" />
        <h1 className="text-2xl font-bold">
          <span className="text-primary_yellow">G</span> Doodle
        </h1>
      </div>
    </div>
  );
};

export default TopBar;
