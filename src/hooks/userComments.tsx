import { postState } from '@/atoms/postsAtom';
import { POST_VOTES_TABLE } from '@/supabase/constants';
import { deletePost } from '@/supabase/post';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import React from 'react';
import { useRecoilState } from 'recoil';



const useComments = () => {

    return {

    }
}
export default useComments;