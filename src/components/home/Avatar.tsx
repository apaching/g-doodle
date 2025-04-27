import { RotateCw } from 'lucide-react';

interface Props {
  avatar: string;
  randomizeAvatar: () => void;
}

const Avatar = ({ avatar, randomizeAvatar }: Props) => {
  return (
    <div className="relative h-32 w-32">
      <img src={avatar} alt="User Avatar" className="h-32 w-32 object-cover" />
      <div
        onClick={randomizeAvatar}
        className="absolute bottom-0 right-0 mb-1 mr-1 cursor-pointer rounded-full bg-primary_black p-1 transition-transform hover:scale-110"
      >
        <RotateCw className="h-5 w-5 text-primary_white" />
      </div>
    </div>
  );
};

export default Avatar;
