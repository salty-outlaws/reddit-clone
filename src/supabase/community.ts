import { SupabaseClient, User } from "@supabase/supabase-js"

interface Community{
    code: string
    name: string
    created_by?: string | undefined
    description: string
}

const createCommunity = (sb: SupabaseClient,user: User|null, community: Community) =>{
    community.created_by = user?.id
    return sb.from("communities").insert([
        community
    ])
}

export {createCommunity}