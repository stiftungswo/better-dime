<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Support\Facades\App;
use Laravel\Lumen\Application;
use Twig;

class PDFController
{

    private $pdf;
    private $footer;

    public function __construct(string $template, array $data, bool $footer = true)
    {
        $this->footer = $footer;

        $this->pdf = App::make('dompdf.wrapper');
        $this->pdf->getDomPDF()->set_option("isPhpEnabled", true);

        $renderedContent = $this->getRenderedTemplate($template, $data);

        $this->pdf->loadHTML($renderedContent)
        ->setPaper('a4', 'portrait');
    }

    public function getRenderedTemplate(string $template, array $data)
    {
        if (!isset($data['base'])) {
            $app = new Application();
            $data['base']['path'] = $app->basepath();
            $data['base']['pdf']  = $this->pdf;
        }
        return Twig::render("pdfs.$template", $data);
    }

    public function print()
    {
        $this->pdf->getDomPDF()->render();
        if ($this->footer === true) {
            $this->addFooterCount();
        }
        return $this->pdf->stream();
    }

    public function debug(string $template, array $data)
    {
        return $this->getRenderedTemplate($template, $data);
    }

    private function addFooterCount()
    {
        $canvas = $this->pdf->getDomPDF()->get_canvas();
        // var_dump($canvas);
        $canvas->page_script('
            if ($PAGE_COUNT > 1) {
                $font = $fontMetrics->get_font("Roboto, Arial, Helvetica, sans-serif", "normal");
                $size = 11;
                $pageText = "Seite " . $PAGE_NUM . " von " . $PAGE_COUNT;
                $y = 790;
                $x = 475;
                $pdf->text($x, $y, $pageText, $font, $size);
            }
        ');
    }
}
