import { LineProfile } from "./LineProfile";

interface GroupResponse {
    groupId: string;
    members: Array<LineProfile>
}

export default GroupResponse;