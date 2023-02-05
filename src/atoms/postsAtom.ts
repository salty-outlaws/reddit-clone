import {atom} from "recoil"

export type Post = {
    id:string
    u_id: string
    u_name: string
    c_code: string
    title: string
    body: string
    commentCount?: number
    voteCount?: number
    imageURL?: string
    created_at?:string
    post_votes?: PostVote[]
}

export type PostVote = {
    u_id: string
    vote: number
}

interface PostState {
    selectedPost: Post | null
    posts: Post[]
    // postVotes
}

const defaultPostState: PostState = {
    selectedPost: null,
    posts:[]
}

export const postState = atom<PostState>({
    key: "postState",
    default: defaultPostState
})