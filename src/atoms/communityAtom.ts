import {atom} from "recoil"

export interface Community{
    code: string
    name: string
    created_by: string
    description: string
}

export const selectedCommunity = atom<string>({
    key: "selectedCommunity",
    default: ""
})


const defaultUserCommunities:string[] = []
export const userCommunities = atom<string[]>({
    key: "userCommunities",
    default: defaultUserCommunities
})