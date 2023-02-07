import { Community, selectedCommunity } from '@/atoms/communityAtom';
import CreatePostLink from '@/components/community/CreatePostLink';
import Header from '@/components/community/Header';
import PageContent from '@/components/layout/PageContent';
import Posts from '@/components/posts/Posts';
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
        try {
            getCommunity(sb, communityCode).then(v => {
                if (v.data?.length||0>0){
                    setCommunity(v.data ? v.data[0] : null)
                    setCurrCommunity(v.data?v.data[0].code:"Home")
                }else{
                    setCurrCommunity("Home")
                }
            })

        } catch (e) {
            console.log("error while getting community ", e)
        }
    }, [sb,communityCode,user,setCurrCommunity])

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
                    <>F2</>
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