"use client"

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Particles from 'react-tsparticles';

const theme = createTheme({
palette: {
primary: {
main: '#3f51b5',
},
secondary: {
main: '#f44336',
},
},
components: {
MuiTextField: {
styleOverrides: {
root: {
'& label.Mui-focused': {
color: '#3f51b5',
},
'& .MuiInput-underline:after': {
borderBottomColor: '#3f51b5',
},
'& .MuiOutlinedInput-root': {
'& fieldset': {
borderColor: '#3f51b5',
},
'&:hover fieldset': {
borderColor: '#f44336',
},
'&.Mui-focused fieldset': {
borderColor: '#3f51b5',
},
},
'& .MuiInputBase-input': {
color: '#FFFFFF',
},
},
},
},
},
});

function Home() {
const onDrop = useCallback(async (acceptedFiles:File[]) => {
const file = acceptedFiles[0];

if (file.type !== "application/pdf") {
alert("Please upload a PDF");
return;
}

const formData = new FormData();
formData.append("file", file);

try {
const response = await fetch("/api/addData", {
method: "POST",
body: formData,
});

if (!response.ok) {
throw new Error(`HTTP error! status: ${response.status}`);
} else {
const body = await response.json();
console.log(body);
if (body.success) {
alert("Data added successfully");
} else {
alert("Error: " + body.error);
}
}
} catch (error) {
console.error(error);
alert("An error occurred while uploading the file.");
}
}, []);

const { getRootProps, getInputProps } = useDropzone({ onDrop });

return (
<ThemeProvider theme={theme}>
<div style={{ position: 'relative', overflow: 'hidden' }}>
<Particles
id="tsparticles"
options={{
background: {
color: {
value: "#0d47a1",
},
},
fpsLimit: 60,
interactivity: {
detectsOn: "canvas",
events: {
onClick: {
enable: true,
mode: "push",
},
onHover: {
enable: true,
mode: "repulse",
},
resize: true,
},
modes: {
bubble: {
distance: 400,
duration: 2,
opacity: 0.8,
size: 40,
},
push: {
quantity: 4,
},
repulse: {
distance: 200,
duration: 0.4,
},
},
},
particles: {
color: {
value: "#ffffff",
},
links: {
color: "#ffffff",
distance: 150,
enable: true,
opacity: 0.5,
width: 1,
},
collisions: {
enable: true,
},
move: {
direction: "none",
enable: true,
outMode: "bounce",
random: false,
speed: 6,
straight: false,
},
number: {
density: {
enable: true,
value_area: 800,
},
value: 80,
},
opacity: {
value: 0.5,
},
shape: {
type: "circle",
},
size: {
random: true,
value: 5,
},
},
detectRetina: true,
}}
/>
<main className="flex min-h-screen flex-col items-center p-24 bg-white" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
<div {...getRootProps({ className: "dropzone border border-gray-800 p-10 rounded-md hover:bg-gray-800 transition-colors duration-200 ease-in-out cursor-pointer" })}>
<input {...getInputProps()} />
<p className="text-center text-white text-xl">Drop a PDF here, or click to select a file</p>
</div>
<Box sx={{ m: 5 }}>
<form className="flex flex-col gap-4">
<TextField fullWidth variant="outlined" placeholder="Enter your prompt..." color="primary" label="Your Prompt" />
<Button type="submit" variant="contained" color="primary" >Submit</Button>
<div className="text-center text-white mt-4">
<CircularProgress />
<Alert severity="info">Thinking...</Alert>
</div>
</form>
</Box>
</main>
</div>
</ThemeProvider>
);
}

export default Home;