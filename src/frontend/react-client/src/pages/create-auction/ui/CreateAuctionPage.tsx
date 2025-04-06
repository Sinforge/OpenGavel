import React from 'react';
import {useForm, FormProvider, SubmitHandler} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {
    Box,
    Paper,
    Typography,
    Button,
} from '@mui/material';
import {BlindAuctionForm} from './BlindAuctionForm';
import {
    AuctionConfiguration,
    BlindAuctionConfiguration,
    EnglishAuctionConfiguration,
    CreateAuctionRequest, EthAddress,
} from "../../../shared/api/types";
import {parseEther} from 'viem';
import {TextFieldController} from "../../../features/create-auction/ui/TextFieldController";
import {AuctionTypeToggleFieldController} from "../../../features/create-auction/ui/ToggleFieldController";
import {AuctionType} from "../../../entities/AuctionType";
import {AuctionFormData} from "../model/AuctionFormData";
import {useCreateAuctionMutation } from "../../../shared/api/auctionApi";
import {EnglishAuctionForm} from "./EnglishAuctionForm";
import {useAccount} from "wagmi";

const fields = [
    {name: "title", label: "Lot name", type: "text"},
    {name: "description", label: "Description", type: "text"},
    {name: "startTime", label: "Start time", type: "date"},
    {name: "endTime", label: "End time", type: "date"},
    {name: "startPrice", label: "Start price", type: "text"}
];

export const CreateAuctionPage = () => {
    const methods = useForm<AuctionFormData>({
        defaultValues: {
            auctionType: AuctionType.BLIND,
            ownerAddress: '0x',
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            startPrice: '',
            bidAmount: 0,     // ← чтобы был controlled
            bidStep: 0,        // ← чтобы был controlled
        },
        //resolver: yupResolver(schema),
        shouldUnregister: true,
    });

    const account = useAccount();

    const [createAuction] = useCreateAuctionMutation();
    const {handleSubmit, watch} = methods;
    const auctionType = watch('auctionType');

    const onSubmit: SubmitHandler<AuctionFormData> = async (data) => {
        let configuration: AuctionConfiguration;
        console.log('Creating auction');
        console.log(account.address);

        switch (data.auctionType) {
            case AuctionType.BLIND:
                configuration = {
                    _owner: account.address,
                    _itemName: data.title,
                    _startPrice: parseEther(data.startPrice.toString()).toString(),
                    _endTimestamp: +new Date(data.endTime),
                    _maximumBids: Number(data.bidAmount),
                } as BlindAuctionConfiguration;
                break;

            case AuctionType.ENGLISH:
                configuration = {
                    _owner: account.address,
                    _itemName: data.title,
                    _startPrice: parseEther(data.startPrice.toString()).toString(),
                    _endTimestamp: +new Date(data.endTime),
                } as EnglishAuctionConfiguration;
                break;

            default:
                throw new Error('Unsupported auction type');
        }

        const request: CreateAuctionRequest = {
            ownerAddress: account.address,
            title: data.title,
            description: data.description,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            type: data.auctionType,
            configuration: configuration,
        };

        try {
            const newAuction = await createAuction(request).unwrap();
            console.log('Auction created:', newAuction);
        } catch (error) {
            console.error('Auction creation failed:', error);
        }
    };

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', p: 3}}>
            <Typography variant="h4" gutterBottom>
                Create Auction
            </Typography>

            <FormProvider {...methods}>
                <Paper sx={{p: 3}} component="form" onSubmit={handleSubmit(onSubmit)}>
                    <AuctionTypeToggleFieldController/>

                    {fields.map((fieldData) => (
                        <TextFieldController
                            key={fieldData.name}
                            label={fieldData.label}
                            name={fieldData.name}
                            type={fieldData.type}/>
                    ))}

                    {auctionType === AuctionType.BLIND && <BlindAuctionForm/>}
                    {auctionType === AuctionType.ENGLISH && <EnglishAuctionForm/>}

                    <Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
                        <Button type="submit" variant="contained" size="large">
                            Create auction
                        </Button>
                    </Box>
                </Paper>
            </FormProvider>
        </Box>
    );
};
