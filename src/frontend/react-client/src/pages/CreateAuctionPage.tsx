import React, { useState } from 'react';
import AuctionType from '../types/AuctionType';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';


const BlindAuctionForm = () => (
    <>
      <TextField
        fullWidth
        label="Bid count"
        type="number"
        margin="normal"
      />
    </>
  );
  
  const EnglishAuctionForm = () => (
    <>
      <TextField
        fullWidth
        label="Start bid"
        type="number"
        margin="normal"
      />
      <TextField
        fullWidth
        label="Bid step"
        type="number"
        margin="normal"
      />
    </>
  );
  
  const DutchAuctionForm = () => (
    <>
      <TextField
        fullWidth
        label="Start bid"
        type="number"
        margin="normal"
      />
      <TextField
        fullWidth
        label="Bid down speed"
        type="number"
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Интервал снижения</InputLabel>
        <Select label="Интервал снижения">
          <MenuItem value="5min">5 минут</MenuItem>
          <MenuItem value="10min">10 минут</MenuItem>
          <MenuItem value="15min">15 минут</MenuItem>
        </Select>
      </FormControl>
    </>
  );
  
  const CreateAuctionPage = () => {
    const [auctionType, setAuctionType] = useState<AuctionType>(AuctionType.BLIND);
    const [formData, setFormData] = useState({});
  
    const handleAuctionTypeChange = (
      event: React.MouseEvent<HTMLElement>,
      newType: AuctionType | null
    ) => {
      if (newType !== null) {
        setAuctionType(newType);
      }
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log({ auctionType, formData });
    };
  
    const renderForm = () => {
      switch (auctionType) {
        case AuctionType.BLIND:
          return <BlindAuctionForm />;
        case AuctionType.ENGLISH:
          return <EnglishAuctionForm />;
        case AuctionType.DUTCH:
          return <DutchAuctionForm />;
        default:
          return null;
      }
    };
  
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          AuctionCreating
        </Typography>
  
        <ToggleButtonGroup
          value={auctionType}
          exclusive
          onChange={handleAuctionTypeChange}
          fullWidth
          sx={{ mb: 3 }}
        >
          <ToggleButton value={AuctionType.BLIND}>
            Blind Auction
          </ToggleButton>
          <ToggleButton value={AuctionType.ENGLISH}>
            English Auction
          </ToggleButton>
          <ToggleButton value={AuctionType.DUTCH}>
            Dutch Auction
          </ToggleButton>
        </ToggleButtonGroup>
  
        <Paper sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Lot name"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={4}
          />
  
          {renderForm()}
  
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
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
