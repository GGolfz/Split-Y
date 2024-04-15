import { useState } from "preact/hooks";
import CommonButton from "../components/CommonButton";
import { ApiService } from "../service/ApiService";

interface NotInGroupPageProp extends PageProp {
  onJoin: () => void;
  onError: () => void;
}
const NotInGroupPage = ({
  groupId,
  accessToken,
  onJoin,
  onError,
}: NotInGroupPageProp) => {
  const [isJoinButtonLoading, setIsJoinButtonLoading] =
    useState<boolean>(false);
  return (
    <>
      <div className="flex flex-col flex-auto text-center justify-center">
        <div>You're not joining this group yet.</div>
        <div className="py-6 flex justify-center">
          <CommonButton
            text="Join a group"
            onClick={async () => {
              if (isJoinButtonLoading) return;
              setIsJoinButtonLoading(true);
              try {
                const response = await ApiService.joinGroup(
                  groupId,
                  accessToken
                );
                if (response.isSuccess) {
                  setIsJoinButtonLoading(false);
                  onJoin();
                }
              } catch (exception) {
                onError();
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default NotInGroupPage;
