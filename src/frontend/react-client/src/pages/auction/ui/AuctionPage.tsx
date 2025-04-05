import {useParams} from 'react-router-dom';
import {CircularProgress} from '@mui/material';
import {AuctionType} from "../../../entities/AuctionType";
import {BlindAuctionPage} from "./BlindAuctionPage";
import {EnglishAuctionPage} from "./EnglishAuctionPage";
import {useGetAuctionQuery} from "../../../shared/api/auctionApi";

export const AuctionPage = () => {
    const {id} = useParams();
    const {
        data: auction,
        isLoading,
    } = useGetAuctionQuery(id as string);

    if (isLoading) return <CircularProgress/>;
    if (!auction) return null;

    switch (auction.type) {
        case AuctionType.BLIND:
            return <BlindAuctionPage data={auction}/>

        case AuctionType.ENGLISH:
            return <EnglishAuctionPage data={auction}/>
    }

}
