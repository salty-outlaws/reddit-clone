import { Post } from '@/atoms/postsAtom';
import usePosts from '@/hooks/usePosts';
import { addComment, listComments } from '@/supabase/comments';
import { listAllPosts, listPosts } from '@/supabase/post';
import { Stack } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { PostgrestResponse } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import PostLoader from './Loader';
import PostItem from './PostItem';

type PostsProps = {
    communityCode: string
    homePage?: boolean
};

const Posts: React.FC<PostsProps> = ({ communityCode, homePage }) => {
    const { postStateValue, setPostStateValue, onVote, onSelectPost } = usePosts()
    const sb = useSupabaseClient()
    const user = useUser()
    const [loading, setLoading] = useState(false)

    const setPostInState = (v: PostgrestResponse<any>) =>{
        const _posts: Post[] = []

        v.data!.forEach(p => {
            _posts.push({
                id: p.id,
                u_id: p.u_id,
                u_name: p.u_name,
                c_code: p.c_code,
                title: p.title,
                body: p.body,
                commentCount: p.commentCount,
                voteCount: p.voteCount,
                imageURL: p.imageURL,
                created_at: p.created_at,
                post_votes: p.post_votes
            })
        })
        setPostStateValue(p => ({
            ...p,
            posts: _posts
        }))
    }



    useEffect(() => {
        const getPosts = () => {
            setLoading(true)
    
            if (communityCode==""){
                listAllPosts(sb,0).then(v => {
                    if (v.error) {
                        console.log(v.error)
                        return
                    }
                    setPostInState(v)
                })
            }else{
                listPosts(sb, communityCode,0).then(v => {
                    if (v.error) {
                        console.log(v.error)
                        return
                    }
                    setPostInState(v)
                    
                })
            }
            setLoading(false)
        }
        getPosts()
    }, [user,communityCode])

    return (
        <>
            {loading ? <PostLoader /> :
                <Stack>
                    {postStateValue.posts.map((item) => (
                        <PostItem
                            homePage={homePage}
                            key={item.id}
                            userID={user?.id||""}
                            post={item}
                            userIsCreator={item.u_id === user?.id}
                            onVote={onVote}
                            onSelectPost={onSelectPost}
                        />
                    ))}
                </Stack>
            }

        </>
    )
}
export default Posts;