import React, { use, useState } from "react";
import {
    Flex,
    Icon,
    Image,
    Skeleton,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import { NextRouter } from "next/router";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
    IoArrowDownCircleOutline,
    IoArrowDownCircleSharp,
    IoArrowRedoOutline,
    IoArrowUpCircleOutline,
    IoArrowUpCircleSharp,
    IoBookmarkOutline,
} from "react-icons/io5";
import { Post } from "../../atoms/postsAtom";
import Link from "next/link";
import moment from "moment";
import { getPostImageLink } from "@/supabase/post";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export type PostItemContentProps = {
    post: Post;
    userID: string
    onVote: (postID: string, userID: string, vote: -1|0|1) => void
    onDeletePost?: (post: Post) => Promise<boolean>;
    userIsCreator: boolean;
    onSelectPost?: (value: Post, postIdx: number) => void;
    router?: NextRouter;
    postIdx?: number;
    userVoteValue?: number;
    homePage?: boolean;
};

const PostItem: React.FC<PostItemContentProps> = ({
    post,
    userID,
    postIdx,
    onVote,
    onSelectPost,
    router,
    onDeletePost,
    userVoteValue,
    userIsCreator,
    homePage,
}) => {
    const sb = useSupabaseClient()
    const [loadingImage, setLoadingImage] = useState(true);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const singlePostView = !onSelectPost; // function not passed to [pid]

    const countVotes = () =>{
        return post.post_votes!.filter(v=>v.vote==1).length - post.post_votes!.filter(v=>v.vote==-1).length
    }

    const hasUserVoted = () => {
        const v = post.post_votes!.filter(v=>v.u_id==userID)
        if (v.length>0){
            return v[0].vote
        }
        return 0
    }

    const updateVote = (vote: number) =>{
        if (vote===hasUserVoted()){
            // if -1 == -1 or 1 == 1 then unvote
            onVote(post.id,userID,0)
            return
        }
        onVote(post.id,userID,vote as 0|1|-1)
    }

    const handleDelete = async (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        setLoadingDelete(true);
        try {
            // const success = await onDeletePost(post);
            // if (!success) throw new Error("Failed to delete post");

            console.log("Post successfully deleted");

            // Could proably move this logic to onDeletePost function
            if (router) router.back();
        } catch (error: any) {
            console.log("Error deleting post", error.message);
            /**
             * Don't need to setLoading false if no error
             * as item will be removed from DOM
             */
            setLoadingDelete(false);
            // setError
        }
    };

    return (
        <Flex
            border="1px solid"
            bg="white"
            borderColor={singlePostView ? "white" : "gray.300"}
            borderRadius={singlePostView ? "4px 4px 0px 0px" : 4}
            cursor={singlePostView ? "unset" : "pointer"}
            _hover={{ borderColor: singlePostView ? "none" : "gray.500" }}
            onClick={() => onSelectPost && post && onSelectPost(post, postIdx!)}
        >
            <Flex
                direction="column"
                align="center"
                bg={singlePostView ? "none" : "gray.100"}
                p={2}
                width="40px"
                borderRadius={singlePostView ? "0" : "3px 0px 0px 3px"}
            >
                <Icon
                    as={
                        hasUserVoted() === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
                    }
                    color={userVoteValue === 1 ? "brand.100" : "gray.400"}
                    fontSize={22}
                    cursor="pointer"
                    onClick={(event) => updateVote(1)}
                />
                <Text fontSize="9pt" fontWeight={600}>
                    {countVotes()}
                </Text>
                <Icon
                    as={
                        hasUserVoted() === -1
                            ? IoArrowDownCircleSharp
                            : IoArrowDownCircleOutline
                    }
                    color={userVoteValue === -1 ? "#4379FF" : "gray.400"}
                    fontSize={22}
                    cursor="pointer"
                    onClick={(event) => updateVote(-1)}
                />
            </Flex>
            <Flex direction="column" width="100%">
                <Stack spacing={1} p="10px 10px">
                    {post.created_at && (
                        <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
                            {homePage && (
                                <>
                                    <Icon as={FaReddit} fontSize={18} mr={1} color="blue.500" />
                                    <Link href={`r/${post.c_code}`}>
                                        <Text
                                            fontWeight={700}
                                            _hover={{ textDecoration: "underline" }}
                                            onClick={(event) => event.stopPropagation()}
                                        >{`r/${post.c_code}`}</Text>
                                    </Link>
                                    <Icon as={BsDot} color="gray.500" fontSize={8} />
                                </>
                            )}
                            <Text color="gray.500">
                                Posted by u/{post.u_name}{" "}
                                {moment(new Date(post.created_at)).fromNow()}
                            </Text>
                        </Stack>
                    )}
                    <Text fontSize="12pt" fontWeight={600}>
                        {post.title}
                    </Text>
                    <Text fontSize="10pt">{post.body}</Text>
                    {post.imageURL && (
                        <Flex justify="center" align="center" p={2}>
                            {loadingImage && (
                                <Skeleton height="200px" width="100%" borderRadius={4} />
                            )}
                            <Image
                                // width="80%"
                                // maxWidth="500px"
                                maxHeight="460px"
                                src={getPostImageLink(sb,post.imageURL)}
                                display={loadingImage ? "none" : "unset"}
                                onLoad={() => setLoadingImage(false)}
                                alt="Post Image"
                            />
                        </Flex>
                    )}
                </Stack>
                <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
                    <Flex
                        align="center"
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{ bg: "gray.200" }}
                        cursor="pointer"
                    >
                        <Icon as={BsChat} mr={2} />
                        <Text fontSize="9pt">{post.commentCount}</Text>
                    </Flex>
                    <Flex
                        align="center"
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{ bg: "gray.200" }}
                        cursor="pointer"
                    >
                        <Icon as={IoArrowRedoOutline} mr={2} />
                        <Text fontSize="9pt">Share</Text>
                    </Flex>
                    <Flex
                        align="center"
                        p="8px 10px"
                        borderRadius={4}
                        _hover={{ bg: "gray.200" }}
                        cursor="pointer"
                    >
                        <Icon as={IoBookmarkOutline} mr={2} />
                        <Text fontSize="9pt">Save</Text>
                    </Flex>
                    {userIsCreator && (
                        <Flex
                            align="center"
                            p="8px 10px"
                            borderRadius={4}
                            _hover={{ bg: "gray.200" }}
                            cursor="pointer"
                            onClick={handleDelete}
                        >
                            {loadingDelete ? (
                                <Spinner size="sm" />
                            ) : (
                                <>
                                    <Icon as={AiOutlineDelete} mr={2} />
                                    <Text fontSize="9pt">Delete</Text>
                                </>
                            )}
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default PostItem;