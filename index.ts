import express from 'express';
import path from 'path';
import apiHenkilostoRouter from './routes/apiHenkilosto';
import virhekasittelija from './errors/virhekasittelija';
import cors from 'cors';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3105;

app.use(cors({origin : "http://localhost:3000"}));

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    setTimeout(() => next(), 1000);

});

app.use(express.static(path.resolve(__dirname, "public")));
app.use('/kuvat', express.static(path.resolve(__dirname, 'kuvat')));

app.use("/api/henkilosto", apiHenkilostoRouter);

app.use(virhekasittelija);

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (!res.headersSent) {
        res.status(404).json({ viesti : "Virheellinen reitti"});
    }

    next();
});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin : ${portti}`);    

});