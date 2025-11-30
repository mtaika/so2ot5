import express from 'express';
import { Virhe } from '../errors/virhekasittelija';
import { PrismaClient } from '@prisma/client';

const prisma : PrismaClient = new PrismaClient();

const apiHenkilostoRouter : express.Router = express.Router();

apiHenkilostoRouter.use(express.json());

apiHenkilostoRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        const henkilot = await prisma.henkilo.findMany();

        if (henkilot) {
            res.status(200).json(henkilot);
        }
        else {
        res.status(404).json({ viesti : "Henkilötietoja ei löytynyt"});}

    } catch (e : any) {
        next(new Virhe());
    }
});

export default apiHenkilostoRouter;