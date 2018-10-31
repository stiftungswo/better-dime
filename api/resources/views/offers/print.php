<head>
    <style>
        <? include 'print.css'; ?>
    </style>
</head>

<body>
<script type="text/php">
if ( isset($pdf) ) {
    $pdf->page_script('
        if ($PAGE_COUNT > 1) {
            $font = $fontMetrics->get_font("Roboto, Arial, Helvetica, sans-serif", "normal");
            $size = 12;
            $pageText = "Seite " . $PAGE_NUM . " von " . $PAGE_COUNT;
            $y = 790;
            $x = 475;
            $pdf->text($x, $y, $pageText, $font, $size);
        }
    ');
}


</script>

<div class="clear-float">
    <div class="float-left">
        <p><? env('SENDER_NAME') ?><br>
            <? env('SENDER_STREET') ?><br>
            <? env('SENDER_PLZ') ?> <? env('SENDER_CITY') ?><br>
            Telefon: <? env('SENDER_PHONE') ?><br>
            Mail: <? env('SENDER_MAIL') ?><br>
            <? env('SENDER_WEB') ?></p>
    </div>

    <div class="float-right">
        <? echo '<img class="logo" src="' . $basePath . '/resources/views/offers/swo_logo_big.png">' ?>
    </div>
</div>

<div class="clear-float">
    <div class="recipient-address float-right">
        <? echo $customer['salutation'] ?><br>
        <? echo $customer['first_name'] . ' ' . $customer['last_name'] ?><br>
        <? echo $offer['address']['street'] ?><br>
        <? if (!is_null($offer['address']['supplement'])) {
            echo $offer['address']['supplement'];
        } ?>
        <? echo $offer['address']['postcode'] . ' ' . $offer['address']['city'] ?><br>
        <? if (!is_null($offer['address']['country'])) {
            echo $offer['address']['country'];
        } ?>
    </div>
</div>

<div class="header clear-float">
    <div>
        <? env('SENDER_CITY') ?>, <? echo date("d.m.Y") ?>
    </div>

    <div>
        Sachbearbeiter: <? echo $offer['accountant']['first_name'] . ' ' . $offer['accountant']['last_name'] ?>
    </div>

    <div class="offer-title">
        <b>Offerte:<br>
            <? echo $offer['name'] ?></b>
    </div>

    <div style="padding-top: -10px;">
        <p>Leistungsangebot Nr. <? echo $offer['id'] ?>
            <? if (!is_null($offer['project'])) {
                echo '<br>Projekt Nr. ' . $offer['project']['id'];
            } ?>
        </p>
    </div>

    <div class="bold">
        <? if (!is_null($offer['short_description'])) {
            echo $offer['short_description'];
        } ?>
    </div>

    <div class="offer_description">
        <? echo $description ?>
    </div>
</div>

<div class="force-page-break"></div>
<b style="font-size: 16px;">Kostenübersicht</b>
<table class="table">
    <thead>
    <tr>
        <th class="first-row">Bezeichnung</th>
        <th class="second-row text-align-right">Ansatz CHF</th>
        <th class="third-row">Einheit</th>
        <th class="fourth-row">Anzahl</th>
        <th class="fifth-row text-align-right">MwSt. Satz</th>
        <th class="sixth-row text-align-right">Teilbetrag CHF exkl. MwSt.</th>
    </tr>
    </thead>
    <tbody>
    <? foreach ($breakdown['positions'] as $offerPosition) {
        echo '<tr>
                    <td>' . $offerPosition['service']['name'] . '</td>
                    <td class="text-align-right">' . number_format($offerPosition['price_per_rate'] / 100, 2, '.', "'") . '</td>
                    <td>' . $offerPosition['rate_unit']['billing_unit'] . '</td>
                    <td>' . ($offerPosition['amount'] + 0) . '</td>
                    <td class="text-align-right">' . ($offerPosition->vat * 100) . ' %</td>
                    <td class="text-align-right">' . number_format($offerPosition->calculatedTotal() / 100, 2, '.', "'") . '</td>
                </tr>';
    } ?>
    </tbody>
    <tfoot>
    <tr class="bold-cells">
        <td colspan="5" class="text-align-right">Subtotal</td>
        <td class="text-align-right"><? echo number_format($breakdown['subtotal'] / 100, 2, '.', "'") ?></td>
    </tr>
    </tfoot>
</table>

<table class="table" style="margin-top: 30px;">
    <thead>
    <tr>
        <td colspan="5" class="text-align-right">Abzug</td>
        <th class="sixth-row text-align-right">Betrag CHF</th>
    </tr>
    </thead>
    <tbody>
    <? foreach ($breakdown['discounts'] as $offerDiscount) {
        echo '<tr>
                    <td colspan="5" class="text-align-right">' . $offerDiscount['name'] . '</td>
                    <td class="text-align-right">' . number_format($offerDiscount['value'] / 100, 2, '.', "'") . '</td>
                </tr>';
    } ?>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="5" class="text-align-right">Abzüge Total</td>
        <td class="text-align-right"><? echo number_format($breakdown['discountTotal'] / 100, 2, '.', "'") ?></td>
    </tr>
    <tr class="bold-cells">
        <td colspan="5" class="text-align-right">Subtotal</td>
        <td class="text-align-right"><? echo number_format($breakdown['rawTotal'] / 100, 2, '.', "'") ?></td>
    </tr>
    </tfoot>
</table>

<table class="table" style="margin-top: 30px;">
    <thead>
    <tr>
        <td colspan="5" class="text-align-right">MwSt. Satz</td>
        <th class="sixth-row text-align-right">Betrag CHF</th>
    </tr>
    </thead>
    <tbody>
    <? foreach ($breakdown['vats'] as $vat) {
        echo '<tr>
                    <td colspan="5" class="text-align-right">' . $vat['vat'] * 100 . '%</td>
                    <td class="text-align-right">' . number_format($vat['value'] / 100, 2, '.', "'") . '</td>
                </tr>';
    } ?>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="5" class="text-align-right">Mehrwertsteuer Total</td>
        <td class="text-align-right"><? echo number_format($breakdown['vatTotal'] / 100, 2, '.', "'") ?></td>
    </tr>
    <tr class="bold-cells">
        <td colspan="5" class="text-align-right">Total</td>
        <td class="text-align-right"><? echo number_format($breakdown['total'] / 100, 2, '.', "'") ?></td>
    </tr>
    </tfoot>
</table>

<div>
    <p class="bold">Bitte unterschrieben retournieren bis <? echo date("d.m.Y", strtotime(" +30 days")) ?>.</p>

    <div class="clear-float signing-area">
        <div class="signature">
            <div class="bold">Unterschrift des Auftragsnehmers:</div>
            <div class="date_location">Ort / Datum:</div>
            <div class="dateline"><? env('SENDER_CITY') ?>, <? echo date("d.m.Y") ?></div>
        </div>
        <div class="signature">
            <div class="bold">Unterschrift des Auftraggebers:</div>
            <div class="date_location">Ort / Datum:</div>
            <div class="dateline" style="border-bottom: 1px dotted black;"><p></p></div>
        </div>
    </div>
</div>
</body>
