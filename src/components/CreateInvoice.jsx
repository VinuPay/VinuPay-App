import React from 'react'
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CreateInvoiceStepper from "./CreateInvoiceStepper";

export default function CreateInvoice() {
    return (
        <div>
            {/* Name "input" panel */}
            <Container>
                <Box
                    sx={{
                        borderWidth: 15,
                        borderStyle: 'solid',
                        borderColor: 'background.paper',
                        borderRadius: 4,
                        boxShadow: 8,
                        backgroundColor: 'background.paper',
                        '&:hover': {
                            backgroundColor: 'background.paper',
                            opacity: [0.98, 0.93, 0.9],
                        },
                    }}
                >
                    <Typography variant="h4" sx={{fontWeight: 700}}>Fill out the form below to create an invoice!</Typography>

                    <CreateInvoiceStepper/>

                </Box>

            </Container>
        </div>
    )
}