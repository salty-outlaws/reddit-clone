import { Community } from "@/atoms/communityAtom"
import { SupabaseClient, User } from "@supabase/supabase-js"
import { COMMUNITIES_TABLE, MEMBERSHIPS_TABLE } from "./constants"

const PAGE_SIZE = 20

// Community Crud

export const createCommunity = (sb: SupabaseClient, community: Community) => {
    return sb.from(COMMUNITIES_TABLE).insert([
        community
    ])
}

export const deleteCommunity = (sb: SupabaseClient, code: string) => {
    return sb.from(COMMUNITIES_TABLE).delete().eq("code", code)
}

export const getCommunity = (sb: SupabaseClient, code: string) => {
    return sb.from(COMMUNITIES_TABLE).select("*").eq("code", code)
}

export const listCommunities = (sb: SupabaseClient, page: number) => {
    const start = page * PAGE_SIZE
    return sb.from(COMMUNITIES_TABLE).select("*").range(start, start + PAGE_SIZE)
}

export const searchCommunities = (sb: SupabaseClient, keyword: string) => {
    return sb.from(COMMUNITIES_TABLE).select("*").ilike("name","%"+keyword+"%").range(0,1000)
}

// Community Membership
export const joinCommunity = (sb: SupabaseClient, communityCode: string, userID: string, role: string) =>{
    if (userID==="")return
    return sb.from(MEMBERSHIPS_TABLE).insert([
        {
            c_code: communityCode,
            u_id: userID,
            role: role
        }
    ])
}

export const leaveCommunity = (sb: SupabaseClient, communityCode: string, userID: string) => {
    if (userID==="")return
    return sb.from(MEMBERSHIPS_TABLE).delete().eq("c_code",communityCode).eq("u_id",userID)
}

export const getCommunityMembers = (sb: SupabaseClient, communityCode: string) => {
    return sb.from(MEMBERSHIPS_TABLE).select("*").eq("c_code",communityCode)
}

export const getUserCommunities = (sb: SupabaseClient, userID: string) => {
    return sb.from(MEMBERSHIPS_TABLE).select("*").eq("u_id",userID)
}