import React, { useEffect, useState } from 'react';
import { Alert, Avatar, Backdrop, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

interface Henkilo {
  id: number
  etunimi: string
  sukunimi: string
  titteli: string
  sukupuoli: string
  puhelin: string
  aloittanutPvm: string
  aloittanutAikaleima: string
  sahkoposti: string
  kuva: string
}

interface ApiData {
  henkilot: Henkilo[]
  haettu: boolean
  virhe: string
}


const App : React.FC = () : React.ReactElement => {

  const [apiData, setApiData] = useState<ApiData>({
    henkilot: [],
    haettu: false,
    virhe: ""
  });

  const apiKutsu = async () : Promise<void> => {
  
    try {

      const yhteys = await fetch("http://localhost:3105/api/henkilosto");

      if (yhteys.status === 200) {

        setApiData({
          ...apiData,
          henkilot: await yhteys.json(),
          haettu: true
        });

      } else {

        let virheteksti : string = "";

        switch (yhteys.status) {

          case 404 : virheteksti = "Henkilöstön tietoja ei löydy"; break;
          default : virheteksti = "Palvelimella tapahtui odottamaton virhe"; break;

        }

        setApiData({
          ...apiData,
          virhe: virheteksti,
          haettu: true
        });

      }
  
    }
    catch (e : any) {
      setApiData({
        ...apiData,
        virhe: "Palvelimeen ei saada yhteyttä",
        haettu: true
      });
    }
  };
  
  useEffect(() => {
    apiKutsu();
  }, []);

  const [valittuHenkilo, setValittuHenkilo] = useState<Henkilo | null>(null);
  const [dialogi, setDialogi] = useState<boolean>(false);

  const valitseHenkilo = (henkilo : Henkilo) => {
    setValittuHenkilo(henkilo);
    setDialogi(true)
  }

  const dialogiClose = () => {
    setValittuHenkilo(null);
    setDialogi(false)
  };

  const laskeVuodet = (startDate: string): number => {

    const [day, month, year] = startDate.split('.').map(Number);
    const start = new Date(year, month - 1, day);
    const now = new Date();
    return now.getFullYear() - start.getFullYear();
  };

  return (

    <Container>
      <Typography variant="h2" sx={{paddingBottom: 3}}>Yritys.fi</Typography>
      <Typography variant="h4" sx={{paddingBottom: 2}}>Henkilöstön yhteystiedot</Typography>

      {(Boolean(apiData.virhe))
        ? <Alert severity="error">{apiData.virhe}</Alert>
        : (apiData.haettu)
          ? <List>
              {apiData.henkilot.map((henkilo : Henkilo) => {
                return <ListItem 
                key={henkilo.id}
                sx={{
                  width: 500,
                  backgroundColor: "rgb(225, 238, 243)",
                  marginBottom: 2,
                  ":hover": {backgroundColor: "rgb(169, 215, 233)"}
                }}
                onClick={() => valitseHenkilo(henkilo)}
                >

                  <ListItemAvatar>
                    <Avatar 
                    alt={`${henkilo.etunimi} ${henkilo.sukunimi}`}
                    src={`http://localhost:3105/kuvat/${henkilo.kuva}`}
                    sx={{
                      width: 60,
                      height: 60,
                    }}
                    />
                  </ListItemAvatar>

                  <ListItemText
                    primary={`${henkilo.etunimi} ${henkilo.sukunimi}`}
                    secondary={henkilo.titteli}
                    sx={{
                      marginLeft: 2
                    }}
                  />
                  
                </ListItem>
              })}

                {valittuHenkilo && (
                  <Dialog open={dialogi} onClose={dialogiClose}>
                    <DialogTitle>
                      {`${valittuHenkilo.etunimi} ${valittuHenkilo.sukunimi}`}
                    </DialogTitle>
                    <DialogContent>
                      <Avatar
                        alt={`${valittuHenkilo.etunimi} ${valittuHenkilo.sukunimi}`}
                        src={`http://localhost:3105/kuvat/${valittuHenkilo.kuva}`}
                        sx={{ width: 100, height: 100, margin: "0 auto 20px" }}
                      />
                      <DialogContentText>{`Titteli: ${valittuHenkilo.titteli}`}</DialogContentText>
                      <DialogContentText>{`Puhelinnumero: ${valittuHenkilo.puhelin}`}</DialogContentText>
                      <DialogContentText>{`Sähköposti: ${valittuHenkilo.sahkoposti}`}</DialogContentText>
                      <DialogContentText>{`Työskennellyt meillä ${laskeVuodet(
                        valittuHenkilo.aloittanutPvm
                      )} vuotta`}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={dialogiClose}>Sulje</Button>
                    </DialogActions>
                  </Dialog>
                )}
            </List>
      
          : <Backdrop open={true}>
              <CircularProgress color='inherit'/>
            </Backdrop>
      }
    </Container>

  )
}

export default App;