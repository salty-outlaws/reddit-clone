import { Community, selectedCommunity } from '@/atoms/communityAtom';
import { Post } from '@/atoms/postsAtom';
import { CommentsList } from '@/components/comments/CommentsList';
import CreatePostLink from '@/components/community/CreatePostLink';
import Header from '@/components/community/Header';
import PageContent from '@/components/layout/PageContent';
import PostItem from '@/components/posts/PostItem';
import Posts from '@/components/posts/Posts';
import usePosts from '@/hooks/usePosts';
import { listComments } from '@/supabase/comments';
import { getCommunity, getUserCommunities } from '@/supabase/community';
import { getPost } from '@/supabase/post';
import { Button, Flex, propNames, Stack } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {Comment} from "../../../../atoms/commentAtom"


const PostPage: React.FC = () => {
    const sb = useSupabaseClient()
    const user = useUser()
    const { onVote, onSelectPost } = usePosts()

    const [post, setPost] = useState<Post>()
    const [comments, setComments] = useState<Comment[]>()

    const router = useRouter()
    const {postId} = router.query

    const loadComments = async () => {
        let comms = await listComments(sb,postId as string)
        setComments(comms)
    }

    useEffect(() => {
        const loadPost = () => {
            getPost(sb, postId as string).then(v => {
                if (v.data?.length || 0 > 0) {
                    const p: any = v.data![0]
                    setPost({
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
                }
            })
        }

        if (!post){
            loadPost()
            loadComments()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    })

    return (
        <>
            {post !== undefined ?
                <Flex direction="column">
                    <PageContent>
                        <>
                            <Stack>
                                <Button 
                                    onClick={()=>router.back()}
                                    width="70px"
                                    height="28px"
                                    variant="outline"
                                    borderRadius={6}
                                    borderColor="gray.300"
                                    color="gray.600"
                                >Back</Button>
                                <PostItem
                                    singlePage={true}
                                    key={post.id}
                                    userID={user?.id || ""}
                                    post={post}
                                    userIsCreator={post.u_id === user?.id}
                                    onVote={onVote}
                                    onSelectPost={onSelectPost}
                                />
                                <Flex p={2} bg="white">
                                    <CommentsList
                                    onCommentUpdated={loadComments}
                                        hideAddComment={false}
                                        comments={comments}
                                        postID={postId as string}
                                    />
                                </Flex>
                            </Stack>
                        </>
                        <></>
                    </PageContent>
                </Flex>
                : "Post not found"
            }
        </>
    )
}

export default PostPage;