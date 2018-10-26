<?php

use Illuminate\Database\Eloquent\Factory;

/** @var Factory $factory */
$factory->define(\App\Models\Offer\Offer::class, function (Faker\Generator $faker) {
    $customer = factory(\App\Models\Customer\Person::class)->create();

    // TODO add something to randomn generate some markdown text
    $markdownText = '# Vota annos

## Spartana contraria et gaudere dulcedine precesque ferarum

Lorem markdownum pervia legem hi pondus esse, de conciperet Delius dolores, heu
vela marmoreis removente maduere. Natura dolentes in fauces moras, collo, qualis
*illis vocavit*. Trepidare requiris cursus milite testatus bella. Pace aere
fulget falsamque sententia amantem. Riguo inmitem certos novissima viderent,
Dumque plura Semelen cecropia laesasque servavique seque praemia Semiramio,
turba.

## O Cumarum pietatis cauda turba nihil inscius

Sternis quis viscera [nam medio nactasque](http://lanam.net/) resilit maioris in
titulos. Nec hirsuti ima miracula poteramus quid Dictynna et nobis, Hebre
Phrygios.

## Et terga quoque testatos amnes

Electarumque ursos somnus flexerat inferias, est dominique amissae beati sinit
miserat ego ut. Admonet metuunt Sirenes. Vultus convaluit oculos furiis Sisyphio
iactat ora nomen Proteus bracchia gelido cupidine herbarum pennae Eurystheus
elisa.

Lucina sontem hoc pro inops Ante nisi regibus reliquit sanguine malum! Abit
vitare; sola dearum, tandem modo ore Aries *sedulitas* centumque in illam ubi
coegit. Oculis hoc: naturale successu Tyndaris ictus, medullis vitibus virgo
Lebinthos. Incubat dum cumque inter candida in caesis iecit.

## Iovem cum qui putat dextraque et domestice

Et ut volentes, iunxit **sua**, subito quid orbis; Hippomene tellus iuvenes mea
deum petunt retemptat. Capillo relinquis nescia dominum fossas vult superum si
velantibus nisi natisque. *Errat* per beatam aedes falcata color, sub spissa
quem Atridae.

1. Coniuge perpetuas removit
2. Haec ab sed auxilium silvam et pectus
3. Ferebat bracchia peteret acta oris oculos ibi

Est placet et Titaniacis tellus dempserat aliqua sumus si quid *Troianaque*
piscem nisi miratur? Luce si exanimata fecundo. Tellus
[tendentem](http://www.siste.org/ipsos-parvaque.html) cristati quidem excidit
satis lintea lata repens, caeli hostemque dicimus. Auratam silices sidere, sui
tumidus catenis caelo inpune geminaverat vocatum exiguo; sed quod concutiens
Capysque. Posset perfectaque imago vidit illa, dum **cornua Crete** labor si
secretaque summa pectore debere tanto.';

    return [
        'accountant_id' => factory(\App\Models\Employee\Employee::class)->create()->id,
        'address_id' => factory(\App\Models\Customer\Address::class)->create()->id,
        'customer_id' => $customer->id,
        'customer_type' => \App\Models\Customer\Person::class,
        'description' => $markdownText,
        'name' => $faker->words(3, true),
        'rate_group_id' => factory(\App\Models\Service\RateGroup::class)->create()->id,
        'short_description' => $faker->sentence,
        'status' => $faker->numberBetween(1, 3)
    ];
});
