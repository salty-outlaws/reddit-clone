import { Post } from '@/atoms/postsAtom';
import usePosts from '@/hooks/usePosts';
import { listPosts } from '@/supabase/post';
import { Stack } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import React, { useEffect, useState } from 'react';
import PostLoader from './Loader';
import PostItem from './PostItem';

type PostsProps = {
    communityCode: string
};

const Posts: React.FC<PostsProps> = ({ communityCode }) => {
    const { postStateValue, setPostStateValue, onVote, onDeletePost, onSelectPost } = usePosts()
    const sb = useSupabaseClient()
    const user = useUser()
    const [loading, setLoading] = useState(false)

    const getPosts = () => {
        setLoading(true)
        listPosts(sb, communityCode).then(v => {
            if (v.error) {
                console.log(v.error)
                return
            }

            const _posts: Post[] = []

            v.data.forEach(p => {
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
        })
        setLoading(false)
    }

    useEffect(() => {
        getPosts()
    }, [communityCode])

    return (
        <>
            {loading ? <PostLoader /> :
                <Stack>
                    {postStateValue.posts.map((item) => (
                        <PostItem
                            key={item.id}
                            userID={user?.id||""}
                            post={item}
                            userIsCreator={item.u_id === user?.id}
                            userVoteValue={undefined}
                            onVote={onVote}
                            // onDeletePost={onDeletePost}
                            onSelectPost={onSelectPost}
                        />
                    ))}

                </Stack>
            }

        </>
    )
}
export default Posts;