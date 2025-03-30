import React, {useState} from 'react';
import AuctionType from '../types/AuctionType';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import {AuctionApi} from "../api/auction_api";
import {EthAddress} from "../api/types";

type AuctionFormData = {
    ownerAddress?: EthAddress;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    startPrice: string;
    bidAmount: string;
    bidStep: string;
};

const DEFAULT_AUCTION_VALUES: AuctionFormData = {
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
    startPrice: '0',
    bidAmount: '0',
    bidStep: '0'
};

// Выносим компоненты форм наружу
const BlindAuctionForm = ({formData, onChange}: {
    formData: AuctionFormData,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) => (
    <>
        <TextField
            name="bidAmount"
            fullWidth
            label="Bid count"
            required
            type="number"
            value={formData.bidAmount}
            onChange={onChange}
            margin="normal"
        />
        <TextField
            name="startPrice"
            fullWidth
            required
            label="Start bid"
            type="number"
            value={formData.startPrice}
            onChange={onChange}
            margin="normal"
        />
    </>
);

const EnglishAuctionForm = ({formData, onChange}: {
    formData: AuctionFormData,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) => (
    <>
        <TextField
            name="startPrice"
            fullWidth
            label="Start bid"
            type="number"
            required
            onChange={onChange}
            value={formData.startPrice}
            margin="normal"
        />
        <TextField
            name="bidStep"
            onChange={onChange}
            value={formData.bidStep}
            fullWidth
            required
            label="Bid step"
            type="number"
            margin="normal"
        />
    </>
);

const CreateAuctionPage = () => {
    const [auctionType, setAuctionType] = useState<AuctionType>(AuctionType.BLIND);
    const [formData, setFormData] = useState<AuctionFormData>(DEFAULT_AUCTION_VALUES);

    const handleAuctionTypeChange = (
        event: React.MouseEvent<HTMLElement>,
        newType: AuctionType | null
    ) => {
        if (newType !== null) {
            setAuctionType(newType);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const commonData = {
            ownerAddress: formData.ownerAddress,
            title: formData.title,
            description: formData.description,
            startTime: formData.startTime,
            endTime: formData.endTime
        };

        try {
            let response;

            switch (auctionType) {
                case AuctionType.BLIND:
                    response = await AuctionApi.createBlindAuction({
                        ...commonData,
                        bidAmount: Number(formData.bidAmount),
                        startPrice: Number(formData.startPrice)
                    });
                    break;

                case AuctionType.ENGLISH:
                    response = await AuctionApi.createEnglishAuction({
                        ...commonData,
                        startPrice: Number(formData.startPrice),
                        bidStep: Number(formData.bidStep)
                    });
                    break;

                default:
                    throw new Error('Unsupported auction type');
            }

            console.log('Auction created:', response);

        } catch (error) {
            console.error('Error creating auction:', error);
        }
    };

    const renderForm = () => {
        switch (auctionType) {
            case AuctionType.BLIND:
                return <BlindAuctionForm formData={formData} onChange={handleInputChange}/>;
            case AuctionType.ENGLISH:
                return <EnglishAuctionForm formData={formData} onChange={handleInputChange}/>;
            default:
                return null;
        }
    };

    return (
        <Box sx={{maxWidth: 800, mx: 'auto', p: 3}}>
            <Typography variant="h4" gutterBottom>
                AuctionCreating
            </Typography>

            <ToggleButtonGroup
                value={auctionType}
                exclusive
                onChange={handleAuctionTypeChange}
                fullWidth
                sx={{mb: 3}}
            >
                <ToggleButton value={AuctionType.BLIND}>
                    Blind Auction
                </ToggleButton>
                <ToggleButton value={AuctionType.ENGLISH}>
                    English Auction
                </ToggleButton>
            </ToggleButtonGroup>

            <Paper sx={{p: 3}} component="form" onSubmit={handleSubmit}>
                <TextField
                    name="title"
                    fullWidth
                    label="Lot name"
                    margin="normal"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                />
                <TextField
                    name="description"
                    fullWidth
                    required
                    label="Description"
                    margin="normal"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                />
                <TextField
                    name="ownerAddress"
                    fullWidth
                    required
                    label="Owner address"
                    margin="normal"
                    value={formData.ownerAddress || ''}
                    onChange={handleInputChange}
                />

                {renderForm()}

                <TextField
                    name="startTime"
                    fullWidth
                    margin="normal"
                    type="date"
                    required
                    value={formData.startTime}
                    onChange={handleInputChange}
                />

                <TextField
                    name="endTime"
                    fullWidth
                    margin="normal"
                    type="date"
                    required
                    value={formData.endTime}
                    onChange={handleInputChange}
                />

                <Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                    >
                        Create auction
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default CreateAuctionPage;