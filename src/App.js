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
import CameraComponent from './CameraComponent';
import Grid from '@mui/material/Grid';

export default function App() {
  return (
    <Grid xs={12} flex={1} sx={{backgroundColor:'#F5F5F5'}}>
     <VoiceCreate/>
    </Grid>
  );
}