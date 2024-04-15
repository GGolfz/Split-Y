import { LineProfile } from "../model/LineProfile";

interface Props {
  profile: LineProfile
}
const MemberBox = ({ profile }: Props) => {
  return (
    <>
      <div className="rounded-full overflow-hidden">
        <img src={profile.pictureUrl} height={48} width={48} />
      </div>
      <div className="text-md">{profile.displayName}</div>
    </>
  );
};


export default MemberBox;