export type RootStackParamList = {
    login : undefined,
    registration : undefined,
    bottom : undefined,
    chat : {
        userId? : string | number,
        sentToUid : string | number,
    }
    drawerHome : undefined,
    drawerTheme: undefined,
    userScreen : undefined
}