import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ searchQuery, handleSearch }) => (
  <TextField
    fullWidth
    placeholder="Search expenses..."
    value={searchQuery}
    onChange={(e) => handleSearch(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
  />
);

export default SearchBar; 