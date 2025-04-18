import React, { useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Paper,
    Typography,
    Button,
    Modal,
    CircularProgress
} from '@mui/material';
import { BlindAuctionForm } from './BlindAuctionForm';
import {
    AuctionConfiguration,
    BlindAuctionConfiguration,
    EnglishAuctionConfiguration,
    CreateAuctionRequest
} from '../../../shared/api/types';
import { parseEther } from 'viem';
import { TextFieldController } from '../../../features/create-auction/ui/TextFieldController';
import { AuctionTypeToggleFieldController } from '../../../features/create-auction/ui/ToggleFieldController';
import { AuctionType } from '../../../entities/AuctionType';
import { AuctionFormData } from '../model/AuctionFormData';
import { useCreateAuctionMutation } from '../../../shared/api/auctionApi';
import { EnglishAuctionForm } from './EnglishAuctionForm';
import { useAccount } from 'wagmi';
import { DateTimePickerController } from '../../../features/create-auction/ui/DateTimePickerController';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';

type ModalStyle = {
    position: 'absolute';
    top: string;
    left: string;
    transform: string;
    width: number;
    bgcolor: string;
    borderRadius: number;
    p: number;
    boxShadow: number;
    display: string;
    flexDirection: string;
    alignItems: string;
};
export const CreateAuctionPage: React.FC = () => {
    const methods = useForm<AuctionFormData>({
        defaultValues: {
            auctionType: AuctionType.BLIND,
            ownerAddress: '0x',
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            startPrice: '',
            bidAmount: 0,
            bidStep: 0
        },
        shouldUnregister: true
    });

    const { handleSubmit, watch } = methods;
    const auctionType = watch('auctionType');
    const account = useAccount();
    const navigate = useNavigate();
    const [createAuction] = useCreateAuctionMutation();
    const [isProcessing, setIsProcessing] = useState(false);

    const onSubmit: SubmitHandler<AuctionFormData> = async (data) => {
        setIsProcessing(true);
        try {
            let configuration: AuctionConfiguration;

            switch (data.auctionType) {
                case AuctionType.BLIND:
                    configuration = {
                        _owner: account.address,
                        _itemName: data.title,
                        _startPrice: parseEther(data.startPrice.toString()).toString(),
                        _endTimestamp: Math.floor(new Date(data.endTime).getTime() / 1000),
                        _maximumBids: Number(data.bidAmount)
                    } as BlindAuctionConfiguration;
                    break;

                case AuctionType.ENGLISH:
                    configuration = {
                        _owner: account.address,
                        _itemName: data.title,
                        _startPrice: parseEther(data.startPrice.toString()).toString(),
                        _startTimestamp: Math.floor(new Date(data.startTime).getTime() / 1000),
                        _endTimestamp: Math.floor(new Date(data.endTime).getTime() / 1000),
                        _bidStep: parseEther(data.bidStep!.toString()).toString()
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
                configuration
            };

            await createAuction(request).unwrap();
            navigate('/auctions/my');
        } catch (error) {
            console.error('Auction creation failed:', error);
            // TODO: show error feedback to user
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Create Auction
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <FormProvider {...methods}>
                    <Paper
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ p: 3 }}
                    >
                        <AuctionTypeToggleFieldController />

                        {/* Text fields */}
                        {['title', 'description', 'startPrice'].map((name) => (
                            <TextFieldController
                                key={name}
                                name={name as any}
                                label={name === 'title' ? 'Lot name' : name === 'description' ? 'Description' : 'Start price'}
                                type={name === 'startPrice' ? 'number' : 'text'}
                            />
                        ))}

                        {/* DateTime pickers */}
                        {[
                            { name: 'startTime', label: 'Start time' },
                            { name: 'endTime', label: 'End time' }
                        ].map(({ name, label }) => (
                            <DateTimePickerController key={name} name={name} label={label} />
                        ))}

                        {/* Conditional form parts */}
                        {auctionType === AuctionType.BLIND && <BlindAuctionForm />}
                        {auctionType === AuctionType.ENGLISH && <EnglishAuctionForm />}

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={isProcessing}
                            >
                                Create auction
                            </Button>
                        </Box>
                    </Paper>
                </FormProvider>
            </LocalizationProvider>
        </Box>
    );
};
