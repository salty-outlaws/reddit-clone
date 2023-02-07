import { Community } from "@/atoms/communityAtom"
import { SupabaseClient, User } from "@supabase/supabase-js"
import { BiLike } from "react-icons/bi"
import internal from "stream"
import { COMMUNITIES_TABLE, MEMBERSHIPS_TABLE } from "./constants"
import { Comment } from "../atoms/commentAtom"

const PAGE_SIZE = 20

const listCommentsStep2 = async (sb: SupabaseClient, postID: string, paths: number[]) => {
    let { data } = await sb.from("comments").select("*")
        .eq("post_id", postID).in("id", paths)
    return data
}

const arrangeComments = (comments: Comment[]) => {
    const table = comments
    const ids = table.map((x) => x.id);
    const result = table.map((parent) => {
        const children = table.filter((child) => {
            if (child.id !== child.reply_of && child.reply_of === parent.id) {
                return true;
            }

            return false;
        });

        if (children.length) {
            parent.children = children;
        }

        return parent;
    }).filter((obj) => {
        if (obj.id === obj.reply_of || !ids.includes(obj.reply_of)) {
            // include ultimate parents and orphans at root
            return true;
        }

        return false;
    });
    return result
}


// Community Crud
export const listComments = async (sb: SupabaseClient, postID: string) => {

    let paths: number[][] = []
    let comments: Comment[] = []

    let { data } = await sb.from("comments").select("*")
        .eq("post_id", postID).order("created_at", { ascending: true })

    if (data?.length || 0 > 0) {
        comments = [...data as Comment[]]
        paths = [...data!.map(v => v.path?.split("."))]
    }

    let joinedPaths: number[] = []
    paths.forEach(p => {
        if (p) {
            joinedPaths = [...joinedPaths, ...p]
        }
    })

    if (joinedPaths.length > 0) {
        let data2 = await listCommentsStep2(sb, postID, joinedPaths)
        if (data2?.length || 0 > 0) {
            comments = [...comments, ...data2 as Comment[]]
        }
    }

    comments = comments.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.id === value.id
        ))
    )

    return arrangeComments(comments)
}

export const addComment = (sb: SupabaseClient, comment: any) => {
    return sb.from("comments").insert(comment)
}

export const deleteComment = async (sb: SupabaseClient, commentID: number) => {
    // find if comment has children
    const {data} = await sb.from("comments").select("id").eq("reply_of",commentID).limit(2)
    if (data && data?.length>0){
        // if int then soft deleted
        return sb.from("comments").update({is_deleted:true}).eq("id",commentID)
    }
    
    // if leaf then hard delete 
    return sb.from("comments").delete().eq("id",commentID)
       
}