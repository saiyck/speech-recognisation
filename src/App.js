import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import Box from '@mui/material/Box';
import InputText from './InputText';
import VoiceCreate from './VoiceCreate';

export default function App() {
  return (
    <Box flex={1} display={'flex'} height={'100vh'} justifyContent={'center'} alignItems={'center'}>
     {/* <InputText/> */}
     <VoiceCreate/>
    </Box>
  );
}