import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { formatUnits } from 'viem';
import { ApexOptions } from 'apexcharts';
import { EthAddress } from "../../../shared/api/types";

interface Bid {
    amount: bigint;
    bidder: EthAddress;
    blockNumber: bigint;
    timestamp: Date;
}


interface EnglishAuctionBidChartProps {
    bids: Bid[];
    title?: string;
    height?: number;
    onPointClick?: (bid: Bid) => void;
}

const EnglishAuctionBidChart: React.FC<EnglishAuctionBidChartProps> = ({
                                                             bids,
                                                             title = 'Bid History',
                                                             height = 400,
                                                             onPointClick
                                                         }) => {
    const chartOptions = useMemo<ApexOptions>(() => ({
        chart: {
            type: 'line',
            height: height,
            zoom: { enabled: false },
            events: {
                dataPointSelection: (event, chartContext, config) => {
                    if (onPointClick && config.dataPointIndex !== undefined) {
                        onPointClick(bids[config.dataPointIndex]);
                    }
                }
            }
        },
        title: {
            text: title,
            align: 'center',
            style: {
                fontSize: '16px',
                fontWeight: 'bold'
            }
        },
        xaxis: {
            categories: bids.map((_, index) => `Bid ${index + 1}`),
            title: { text: 'Bid Sequence' }
        },
        yaxis: {
            title: { text: 'Bid Amount (ETH)' },
            labels: {
                formatter: (val: number) => val.toFixed(4)
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        markers: {
            size: 6,
            hover: {
                size: 8
            }
        },
        tooltip: {
            custom: ({ dataPointIndex }) => {
                const bid = bids[dataPointIndex];
                return `
          <div class="apexcharts-tooltip-box" style="
            padding: 8px;
            background: #fff;
            border: 1px solid #ddd;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          ">
            <div style="font-weight: bold; margin-bottom: 4px;">
              Bid #${dataPointIndex + 1}
            </div>
            <div>Amount: ${Number(formatUnits(bid.amount, 18)).toFixed(4)} ETH</div>
            <div style="margin-top: 4px;">
              Bidder: 
              <span style="font-family: monospace">
                ${bid.bidder!.substring(0, 6)}...${bid.bidder!.slice(-4)}
              </span>
            </div>
            ${bid.timestamp ? `
            <div style="margin-top: 4px;">
              Date: ${bid.timestamp}
            </div>` : ''}
          </div>
        `;
            }
        }
    }), [bids, title, height, onPointClick]);

    const chartSeries = useMemo(() => [{
        name: 'Bid Amount',
        data: bids.map((bid, index) => ({
            x: index + 1,
            y: Number(formatUnits(bid.amount, 18)),
            bidder: bid.bidder,
            timestamp: bid.timestamp
        }))
    }], [bids]);

    return (
        <Chart
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={height}
        />
    );
};

export default EnglishAuctionBidChart;