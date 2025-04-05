import React, {JSX} from "react";
import {Controller} from "react-hook-form";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {AuctionType} from "../../../entities/AuctionType";

interface Props {
    name: string;
    toggleButtons: JSX.Element[];
}

export const ToggleFieldController : React.FC<Props> = ({name, toggleButtons}) =>
    <Controller
        name={name}
        render={({ field }) => (
            <ToggleButtonGroup
                {...field}
                exclusive
                fullWidth
                sx={{ mb: 3 }}>
                {toggleButtons}
            </ToggleButtonGroup>
        )}
    />


const auctionTypeButtons: JSX.Element[]= [
    <ToggleButton key={AuctionType.BLIND} value={AuctionType.BLIND}>Blind Auction</ToggleButton>,
    <ToggleButton key={AuctionType.ENGLISH} value={AuctionType.ENGLISH}>English Auction</ToggleButton>
];
export const AuctionTypeToggleFieldController = () =>
    <ToggleFieldController name="auctionType" toggleButtons={auctionTypeButtons}/>



