import HomeCard from 'components/home/HomeCard';

const Home = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-primary_yellow">
      <div className="mx-auto w-full max-w-4xl">
        <HomeCard />
      </div>
    </div>
  );
};

export default Home;
