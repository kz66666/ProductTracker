import React from "react";
import { Card, CardMedia, Button, Typography, CardContent, CardActions } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useFav } from "@/context/FavoriteContext";

const ProductCard = ({ id, title, rating, reviewers, price, link, image, isFavored }) => {
  const { handleFavoriteToggle } = useFav()

  const updateToggle = () => {
    handleFavoriteToggle(id)
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title={title}
        titleTypographyProps={{ variant: 'h6', fontSize: 15 }}
      />
      <CardMedia
        component="img"
        image={image}
        sx={{ width: '100%', height: '200px', objectFit: 'contain' }}
        alt={title}
      />
      <CardContent>
        <Typography variant="body2" color={"text-secondary"}>Rating: {rating}</Typography>
        <Typography variant="body2" color={"text-secondary"}>Reviewers: {reviewers}</Typography>
        <Typography variant="h6" color="text.primary">${price}</Typography>
      </CardContent>
      <CardActions>
        <Button 
          href={link} 
          target="_blank"
        >
          Learn More
        </Button>
        <IconButton aria-label="add to favorites" color={isFavored ? 'error' : 'inherit'} onClick={updateToggle}>
          <FavoriteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProductCard;