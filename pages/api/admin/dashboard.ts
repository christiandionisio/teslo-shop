import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
    numberOfOrders: number;
    paidOrders: number; 
    notPaidOrders: number;
    numberOfClients: number;    
    numberOfProducts: number; 
    productsWithNoInventory: number;
    lowInventory: number;
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    
    switch(req.method) {
        case 'GET':
            return getDashboardValues(req, res);

    }

    return res.status(400).json({
        numberOfOrders: 0,
        paidOrders: 0,
        notPaidOrders: 0,
        numberOfClients: 0,
        numberOfProducts: 0,
        productsWithNoInventory: 0,
        lowInventory: 0,
    });

}

const getDashboardValues = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    try {
        
        db.connect();

        const [
            numberOfOrders,
            paidOrders,
            notPaidOrders,
            numberOfClients,
            numberOfProducts,
            productsWithNoInventory,
            lowInventory,
    
        ] = await Promise.all([
            Order.countDocuments({}),
            Order.countDocuments({isPaid: true}),
            Order.countDocuments({isPaid: false}),
            User.countDocuments({role: 'client'}),
            Product.countDocuments({}),
            Product.countDocuments({inStock: 0}),
            Product.countDocuments({inStock: {$lte: 10}}),
        ]);

        db.disconnect();

        return res.status(200).json({
            numberOfOrders,
            paidOrders,
            notPaidOrders,
            numberOfClients,
            numberOfProducts,
            productsWithNoInventory,
            lowInventory,
        })

    } catch (error) {
         return res.status(200).json({
            numberOfOrders: 0,
            paidOrders: 0,
            notPaidOrders: 0,
            numberOfClients: 0,
            numberOfProducts: 0,
            productsWithNoInventory: 0,
            lowInventory: 0,
        })
    }
}
