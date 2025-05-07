import Modal from './Modal';
import Avatar from './Avatar';
import { useState } from 'react';
import { socket } from 'lib/socket';
import { Play } from 'lucide-react';
import NameInput from './NameInput';
import { Search } from 'lucide-react';
import Carousel from './TutorialCarousel';
import { useNavigate } from 'react-router-dom';
import { avatarList } from 'lib/constants/avatars';
import { generateRandomNickname } from 'lib/utils';

const getRandomAvatar = () => {
  const index = Math.floor(Math.random() * avatarList.length);
  return avatarList[index];
};

const HomeCard = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(getRandomAvatar());
  const [nickname, setNickname] = useState<string>(generateRandomNickname());

  const handleRandomize = () => {
    setAvatar(getRandomAvatar());
  };

  const handleCreate = () => {
    socket.emit('createLobby', nickname, avatar);

    socket.once('lobbyCreated', ({ lobbyCode }) => {
      navigate(`/lobby/${lobbyCode}`);
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            <NameInput nickname={nickname} setNickname={setNickname} />
          </div>
          <div className="flex gap-2">
            <div
              onClick={openModal}
              className="hover:bg-primary_gray mb-6 flex w-32 cursor-pointer items-center justify-evenly rounded-md bg-primary_black px-6 py-1 font-bold uppercase tracking-widest text-primary_white hover:bg-opacity-90"
            >
              <Search className="h-5 w-5 text-primary_yellow" />
              JOIN
            </div>
            <div
              onClick={handleCreate}
              className="hover:bg-primary_gray mb-6 flex w-32 cursor-pointer items-center justify-evenly rounded-md bg-primary_black px-4 py-1 font-bold uppercase tracking-widest text-primary_white hover:bg-opacity-90"
            >
              <Play className="h-5 w-5 text-primary_yellow" />
              CREATE
            </div>
          </div>
        </div>
        <div>
          <Carousel />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        avatar={avatar}
        nickname={nickname}
      />
    </div>
  );
};

export default HomeCard;
