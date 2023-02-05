import { Post } from "@/atoms/postsAtom"
import { SupabaseClient, User } from "@supabase/supabase-js"
import { syncBuiltinESMExports } from "module"
import { decode } from "base64-arraybuffer"
import { POSTS_TABLE } from "./constants"

const PAGE_SIZE = 20

export const createPost = (sb: SupabaseClient, post: Post) => {
    return sb.from(POSTS_TABLE).insert([
        post
    ])
}

export const deletePost = (sb: SupabaseClient, postID: string) => {
    return sb.from(POSTS_TABLE).delete().eq("id", postID)
}

export const listPosts = (sb: SupabaseClient, communityCode: string) => {
    return sb.from(POSTS_TABLE).select("*, post_votes (u_id, vote)").eq("c_code",communityCode).order("created_at",{ascending:false})
}

export const listAllPosts = (sb: SupabaseClient, communityCode: string) => {
    return sb.from(POSTS_TABLE).select("*").order("created_at",{ascending:false})
}

export const uploadPostImage = (sb: SupabaseClient,imageid: string,data: File) =>{
    return sb
    .storage
    .from('post-images')
    .upload('public/'+imageid+"/"+data.name, data,  {})
}

export const getPostImageLink = (sb: SupabaseClient, key: string) => {
    return sb.storage.from("post-images").getPublicUrl(key).data.publicUrl
}