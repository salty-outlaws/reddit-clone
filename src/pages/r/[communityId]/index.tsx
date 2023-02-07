import { Community, selectedCommunity } from '@/atoms/communityAtom';
import CreatePostLink from '@/components/community/CreatePostLink';
import Header from '@/components/community/Header';
import PageContent from '@/components/layout/PageContent';
import Communities from '@/components/Navbar/Directory/Communities';
import Posts from '@/components/posts/Posts';
import CommunitySidebar from '@/components/sidebars/CommunitySidebar';
import { getCommunity, getUserCommunities } from '@/supabase/community';
import { Flex, propNames } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

type CommunityPageProps = {
    communityCode: string
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityCode }) => {
    const sb = useSupabaseClient()
    const user = useUser()
    const defaultCommunity: Community = {
        code: "",
        name: "",
        created_by: "",
        description: ""
    }
    const [community, setCommunity] = useState(defaultCommunity)
    const setCurrCommunity = useSetRecoilState(selectedCommunity)

    useEffect(() => {
        getCommunity(sb, communityCode).then(v => {
            if (v.data?.length||0>0){
                setCommunity(v.data ? v.data[0] : null)
                setCurrCommunity(v.data?v.data[0].code:"Home")
            }else{
                setCurrCommunity("Home")
            }
        })
    },[user,communityCode])

    return (
        <>
            {community !== undefined ? 
            <Flex direction="column">
                <Header community={community}/>
                <PageContent>
                    <>
                        <CreatePostLink/>
                        <Posts communityCode={communityCode}/>
                    </>
                    <>
                        <CommunitySidebar community={community}/>
                    </>
                </PageContent>
            </Flex>
                : " Community not found"
            }
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            communityCode: context.query.communityId
        }
    }
}

export default CommunityPage;