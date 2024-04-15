import { BaseResponse } from "../model/BaseResponse"

export const withExceptionWrapper = async <T extends BaseResponse>(handler: () => Promise<T>, errorMessage: string): Promise<BaseResponse> => {
    try {
        return await handler()
    } catch(exception) {
        if(exception instanceof Error) {
            return {
                isSuccess: false,
                error: exception.message
            }
        }
        return {
            isSuccess: false,
            error: errorMessage
        }
    }
}