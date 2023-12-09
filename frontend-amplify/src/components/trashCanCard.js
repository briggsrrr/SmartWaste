import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';

import redTrash from "../images/redtrash.png";
import yellowTrash from "../images/yellowtrash.png";
import greenTrash from "../images/greentrash.png";

const TrashCanCard = ({ status, index, data }) => {
    let imageSrc, color, statusText, trashCanNumber;

    switch (status) {
        case true:
            imageSrc = redTrash;
            color = 'error.main'; 
            statusText = 'Full';
            break;
        case false:
            imageSrc = greenTrash;
            color = 'success.main';
            statusText = 'Status: Good';
            break;
        default:
            imageSrc = yellowTrash;
            color = 'warning.main';
            statusText = 'Warning';
            break;
    }

    trashCanNumber = `Trash Can #: ${index + 1}`;

    return (
        <Card sx={{ maxWidth: 345, mt: 2, mb: 4 }}>
            <CardMedia
                component="img"
                height="140"
                image={imageSrc}
                alt={statusText}
            />
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography gutterBottom variant="h5" component="div" color={color}>
                    {statusText}
                </Typography>
                <Typography gutterBottom variant="h6" component="div" color="text.primary">
                    {trashCanNumber}
                </Typography>
                {data ? (
                    <>
                        <Typography variant="body2" component="p">
                            Sensor ID: {data.id}
                        </Typography>
                        <Typography variant="body2" component="p">
                            Distance: {data.distance}
                        </Typography>
                        <Typography variant="body2" component="p">
                            Publish Count: {data.publishCount}
                        </Typography>
                        <Typography variant="body2" component="p">
                            Timestamp: {data.timestamp}
                        </Typography>
                    </>
                ) : (
                    <Typography variant="body2" component="p">
                        No data available
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default TrashCanCard;
