<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Support\Facades\App;
use Laravel\Lumen\Application;
use Twig;

class PDFController
{

    private $pdf;

    public function __construct(string $template, array $data)
    {
        $this->pdf = App::make('dompdf.wrapper');

        $renderedContent = $this->getRenderedTemplate($template, $data);

        $this->pdf->loadHTML($renderedContent);
    }

    public function getRenderedTemplate(string $template, array $data)
    {
        if (!isset($data['base'])) {
            $app = new Application();
            $data['base']['path'] = $app->basepath();
        }
        return Twig::render("pdfs.$template", $data);
    }

    public function print()
    {
        return $this->pdf->stream();
    }

}