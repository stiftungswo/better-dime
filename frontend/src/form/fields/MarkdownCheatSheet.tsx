import * as React from 'react';
import { useIntl } from 'react-intl';

export default function MarkdownCheatSheet() {
  const intl = useIntl();
  const isFrench = (intl.formatMessage({id: 'language.display_name'}).startsWith('F'));

  return isFrench ? (
    <div style={{fontSize: '13px', lineHeight: '15px'}}>
      <p style={{fontSize: '14px', marginBottom: '5px', marginTop: '0px'}}><b>Cheatsheet Markdown</b></p>
      <b>Titre: </b> #Titre de la description<br/>
      <b>Sous-titres: </b> ##Sous-titres de la description<br/>
      <b>Texte en gras: </b> **Texte**<br/>
      <b>Texte en italique: </b> *Texte*<br/>
      <b>Liste: </b><br/>
      - Premier élément<br/>
      - Deuxième élément (pas de double saut de ligne entre les éléments de la liste!)<br/>
      <b>Liste numérotée: </b><br/>
      1. Premier élément<br/>
      2. Deuxième élément (pas de double saut de ligne entre les éléments de la liste!)<br/>
      <b>Nouveau retour à la ligne: </b> {'<br>'}
    </div>
  ) : (
    <div style={{fontSize: '13px', lineHeight: '15px'}}>
      <p style={{fontSize: '14px', marginBottom: '5px', marginTop: '0px'}}><b>Markdown Cheatsheet</b></p>
      <b>Titel: </b> #Titel Beschreibung<br/>
      <b>Untertitel: </b> ##Untertitel Beschreibung<br/>
      <b>Fettgedruckter Text: </b> **Text**<br/>
      <b>Kursiver Text: </b> *Text*<br/>
      <b>Liste: </b><br/>
      - Listenelement 1<br/>
      - Listenelement 2 (keine doppelten Zeilenumbrüche zwischen den Listenelementen!)<br/>
      <b>Nummerierte Liste: </b><br/>
      1. Listenelement 1<br/>
      2. Listenelement 2 (keine doppelten Zeilenumbrüche zwischen den Listenelementen!)<br/>
      <b>Neuer Zeilenumbruch: </b> {'<br>'}
    </div>
  );
}
