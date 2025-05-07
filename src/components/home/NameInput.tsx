interface Props {
  nickname: string;
  setNickname: React.Dispatch<string>;
}

const NameInput = ({ nickname, setNickname }: Props) => {
  return (
    <div className="flex w-56 flex-col items-center justify-center gap-3 p-2 px-4 text-primary_black">
      <div className="text-sm font-bold uppercase tracking-tighter">
        <p>Choose a character</p>
        <p className="mt-[-6px] pl-4">And a nickname</p>
      </div>
      <input
        maxLength={20}
        spellCheck={false}
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Type your nickname..."
        className="rounded border border-zinc-700 px-2 py-1 text-sm font-semibold"
      />
    </div>
  );
};

export default NameInput;
