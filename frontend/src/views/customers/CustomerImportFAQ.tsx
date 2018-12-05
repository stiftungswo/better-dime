import React from 'react';
import { Collapse, Typography } from '@material-ui/core';

interface TitleWithBodyProps {
  children: React.ReactNode;
  title: string;
}

interface CustomerImportFAQProps {
  open: boolean;
}

const TitleWithBody = ({ children, title }: TitleWithBodyProps) => (
  <>
    <Typography gutterBottom variant={'h6'}>
      {title}
    </Typography>

    <Typography gutterBottom variant={'body2'}>
      {children}
    </Typography>
  </>
);

export const CustomerImportFAQ = ({ open }: CustomerImportFAQProps) => (
  <Collapse in={open}>
    <TitleWithBody title={'Wie funktioniert der Datenimport?'}>
      Unter dem Button "Import-Vorlage herunterladen" kann eine Vorlage im Excel-Format heruntergeladen werden, welche alle nötigen Felder
      enthält, um einen neuen Kunden im Dime zu erstellen. Anschliessend kann über "Import überprüfen" die ausgefüllte Tabelle wieder
      hochgeladen werden. Die Inhalte werden geprüft und anschliessend in einer Vorschau angezeigt. Über "Import starten" wird dann der
      endgültige Import in die Dime-Datenbank gestartet.
    </TitleWithBody>

    <TitleWithBody title={'Welche Kriterien sind entscheidend, damit ein Kunde als Duplikat markiert wird?'}>
      Bei einem Firmen-Kunde wird geprüft, ob eine Firma mit denselben Namen bereits erfasst ist. Bei einer Person sind Vor- und Nachname
      entscheidend.
    </TitleWithBody>

    <TitleWithBody title={'Ab wann wird ein Kunde als "Ungültig" gekennzeichnet?'}>
      Bei einem Firmenkunden wird dies angezeigt, wenn kein Name angegeben wurde.
      <br />
      <br />
      Bei einer Person wird dies angezeigt, wenn entweder Vor- und / oder Nachname nicht angegeben wurde. Wenn das Feld "Firma" ausgefüllt
      wurde bei einer Person, wird zusätzlich geprüft, ob eine Firma mit diesem Namen bereits in der Datenbank erfasst wird oder bereits
      während des Imports geprüft wurde. Die Excel-Tabelle wird von oben nach unten geprüft, d.h., wenn eine neue Firma und ihre Personen
      dazu erfasst werden soll, muss die Firma vor den Personen in der Excel-Tabelle erfasst sein.
      <br />
      <br />
      Falls die Strasse, eine Postleitzahl oder eine Stadt angegeben ist, wird auch geprüft, ob jeweils die anderen beiden Angaben auch
      ausgefüllt sind. Wenn nein, wird der Kunde auch als ungültig markiert.
    </TitleWithBody>

    <TitleWithBody title={'Was bedeuten die grünen und weissen Karten bei der Kundenvorschau?'}>
      Die grünen Karten signalisieren, dass mit diesem Kunden alles in Ordnung ist und der so importiert werden kann. Bei einer weissen
      Karte handelt es sich entweder um ein Duplikat oder um einen Kunden mit ungültigen Angaben.
    </TitleWithBody>

    <TitleWithBody title={'Warum ist der "Import starten"-Button ausgegraut?'}>
      Entweder wurde der Import noch nicht geprüft oder der Import enthält Kunden mit ungültigen Angaben. Sobald diese ungültigen Kunden
      entfernt oder korrigiert wurden, wird der Button grün gefärbt.
    </TitleWithBody>
  </Collapse>
);
