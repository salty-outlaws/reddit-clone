import { authModalState } from '@/atoms/authModalAtom';
import { userCommunities } from '@/atoms/communityAtom';
import { getUserCommunities, joinCommunity, leaveCommunity } from '@/supabase/community';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

const useCommunityData = () => {
    
    const [communities, setCommunities] = useRecoilState(userCommunities)
    const [loading, setLoading] = useState(false)
    const sb = useSupabaseClient()
    const user = useUser()
    const setAuthModalState = useSetRecoilState(authModalState)

    const onJoinOrLeaveCommunity = (communityCode: string, isJoined: boolean) =>{
        if (isJoined){
            lCommunity(communityCode)
            return
        }
        jCommunity(communityCode)
    }

    const jCommunity = (communityCode: string) => {
        setLoading(true)
        if (!user){
            setAuthModalState({open:true,view:"login"})
        }
        joinCommunity(sb,communityCode,user?.id||"","member")?.then(v=>{
            console.log(v)
            if (!v.error) setCommunities([...communities,communityCode])
        })
        setLoading(false)
    }
    const lCommunity = (communityCode: string) => {
        setLoading(true)
        leaveCommunity(sb,communityCode,user?.id||"")?.then(v=>{
            console.log(v)
            if (!v.error) setCommunities(communities.filter(i=>i!=communityCode))
        })
        setLoading(false)
    }



    useEffect(()=>{
        const fetchUserCommunities = () => {
            setLoading(true)
            getUserCommunities(sb, user?.id || "").then(v => {
                let values: string[] = []
                v.data?.forEach(v => {
                    values = [...values, v.c_code]
                })
                setCommunities(values)
            })
            setLoading(false)
        }
        if (!user)return
            fetchUserCommunities()
    },[])

    return {
        loading,
        communities,
        onJoinOrLeaveCommunity
    }
}
export default useCommunityData;