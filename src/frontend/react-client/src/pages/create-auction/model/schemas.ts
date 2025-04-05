import * as yup from "yup";
import {AuctionType} from "../../../entities/AuctionType";

const baseSchema = yup.object().shape({
    auctionType: yup
        .mixed<AuctionType>()
        .oneOf(Object.values(AuctionType))
        .required('Auction type is required'),
    ownerAddress: yup.string().required('Owner address is required'),
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    startTime: yup.string().required('Start time is required'),
    endTime: yup.string().required('End time is required'),
    startPrice: yup
        .number()
        .required('Start price is required')
        .positive('Start price must be positive'),
});

export const schema = baseSchema.concat(
    yup.object().shape({
        bidAmount: yup.number().when('auctionType', {
            is: AuctionType.BLIND,
            then: (schema) => schema
                .required('Bid amount is required')
                .positive('Bid amount must be positive'),
            otherwise: (schema) => schema.strip(),
        }),
        bidStep: yup.number().when('auctionType', {
            is: AuctionType.ENGLISH,
            then: (schema) => schema
                .required('Bid step is required')
                .positive('Bid step must be positive'),
            otherwise: (schema) => schema.strip(),
        }),
    })
);