import {TextFieldController} from "../../../features/create-auction/ui/TextFieldController";

export const BlindAuctionForm = () => {
    return (
        <TextFieldController label="Bid count" name="bidAmount" type="text"/>
    );
};
