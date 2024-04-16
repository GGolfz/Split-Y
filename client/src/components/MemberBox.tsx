import { LineProfile } from "../model/LineProfile";

export enum Size {
  Small,
  Medium
}
interface Props {
  profile: LineProfile
  size?: Size
}
const MemberBox = ({ profile, size = Size.Medium }: Props) => {
  const getSize = (size: Size) => {
    switch(size) {
      case Size.Small:
        return 24
      case Size.Medium:
        return 36
      default:
        return 36
    }
  }
  return (
    <>
      <div className="rounded-full overflow-hidden">
        <img src={profile.pictureUrl} height={getSize(size)} width={getSize(size)} />
      </div>
      <div className="text-md">{profile.displayName}</div>
    </>
  );
};


export default MemberBox;