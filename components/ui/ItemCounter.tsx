import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import { Box, IconButton, Typography } from "@mui/material"
import { FC } from "react"


interface Props {
  currentValue: number;
  maxValue: number;

  // Methods
  updateQuantity: (quantity: number) => void;
}

export const ItemCounter: FC<Props> = ({currentValue, maxValue, updateQuantity}) => {

  const onAddQuantity = () => {
    if (currentValue >= maxValue) return;
    currentValue++;
    updateQuantity(currentValue);
  }

  const onRemoveQuantity = () => {
    if (currentValue === 1) return;
    currentValue--;
    updateQuantity(currentValue);
  }

  return (
    <Box display='flex' alignItems='center'>
        <IconButton onClick={onRemoveQuantity}>
            <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{width: 40, textAlign: 'center'}}>{currentValue}</Typography>
        <IconButton onClick={onAddQuantity}>
            <AddCircleOutline />
        </IconButton>
    </Box>
  )
}
