import Avatar from './Avatar';
import { useState } from 'react';
import { Play } from 'lucide-react';
import NameInput from './NameInput';
import { avatarList } from 'lib/constants/avatars';
import Carousel from './TutorialCarousel';

const getRandomAvatar = () => {
  const index = Math.floor(Math.random() * avatarList.length);
  return avatarList[index];
};

const HomeCard = () => {
  const [avatar, setAvatar] = useState<string>(getRandomAvatar());

  const handleRandomize = () => {
    setAvatar(getRandomAvatar());
  };

  return (
    <div className="mx-auto aspect-[4/3] w-full max-w-[750px]">
      <div className="flex h-auto flex-col items-center justify-center rounded-t-2xl bg-primary_black py-3">
        <p className="text-2xl font-bold text-primary_white">
          <span className="text-primary_yellow">G </span>Doodle
        </p>
        <p className="text-lg font-light tracking-tight text-gray-300">
          Draw, Guess, and Have Fun!
        </p>
      </div>
      <div className="flex h-auto w-full items-center justify-center gap-8 rounded-b-2xl bg-primary_white py-12">
        <div className="flex h-72 flex-col items-center">
          <div className="flex w-full flex-1 items-center justify-center">
            <Avatar avatar={avatar} randomizeAvatar={handleRandomize} />
            <NameInput />
          </div>
          <div className="mb-6 flex w-32 cursor-pointer items-center justify-evenly rounded-md bg-primary_black px-4 py-1 font-bold uppercase tracking-widest text-primary_white hover:bg-primary_gray hover:bg-opacity-90">
            <Play className="h-5 w-5 text-primary_yellow" />
            Start
          </div>
        </div>
        <div>
          <Carousel />
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
