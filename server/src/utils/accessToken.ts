export const extractAccessToken = (authorizationHeader: string): string | null => {
    if(authorizationHeader.startsWith("Bearer ")) {
        return authorizationHeader.split("Bearer ")[1]
    }
    return null
}