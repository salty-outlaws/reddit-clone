import { postState } from '@/atoms/postsAtom';
import { POST_VOTES_TABLE } from '@/supabase/constants';
import { deletePost } from '@/supabase/post';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import React from 'react';
import { useRecoilState } from 'recoil';

const usePosts = () => {

    const sb = useSupabaseClient()
    const router = useRouter()

    const [postStateValue, setPostStateValue] = useRecoilState(postState)

    const updateVoteInPostState = (postID: string, userID: string, vote: -1 | 0 | 1) => {
        const newPosts = postStateValue.posts.map(
            p => {
                if (p.id == postID) {
                    let userFound = false
                    let tmpPostVotes = p.post_votes?.map(v => {
                        if (v.u_id === userID) {
                            userFound = true
                            return { ...v, vote: vote }
                        }
                        return v
                    })
                    if (!userFound) {
                        tmpPostVotes?.push({ u_id: userID, vote: vote })
                    }
                    return {
                        ...p,
                        post_votes: tmpPostVotes
                    }
                }

                return p
            })

        setPostStateValue(p => ({
            ...p,
            posts: newPosts
        }))
    }

    const onVote = (postID: string, userID: string, vote: -1 | 0 | 1) => {
        if (vote === 0) {
            sb.from(POST_VOTES_TABLE).delete().eq("post_id", postID).eq("u_id", userID)
                .then(v => console.log(v))
        } else {
            sb.from(POST_VOTES_TABLE).select("*").eq("post_id", postID).eq("u_id", userID)
                .then(v => {
                    console.log(v)
                    if (v.data?.length || 0 > 0) {
                        // update vote
                        sb.from(POST_VOTES_TABLE).update({ vote: vote }).eq("post_id", postID).eq("u_id", userID).then(v => console.log(v))
                    } else {
                        // add new vote
                        sb.from(POST_VOTES_TABLE).insert({
                            vote: vote,
                            post_id: postID,
                            u_id: userID
                        }).then(v => console.log(v))
                    }
                })
        }
        updateVoteInPostState(postID, userID, vote)
    }
    const onSelectPost = (communityCode:string,postID:string) => { 
        router.push(`/r/${communityCode}/${postID}`)
    }


    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost
        
    }
}
export default usePosts;