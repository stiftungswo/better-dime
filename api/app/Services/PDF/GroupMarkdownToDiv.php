<?php

namespace App\Services\PDF;

class GroupMarkdownToDiv
{
    public static function group($string)
    {
        $string = "<div>" . $string . "</div>";
        $xml = simplexml_load_string($string);
        $dom = dom_import_simplexml($xml);
        $doc = new \DOMDocument('1.0');
        $newRoot = $doc->createElement("div");
        $newRoot = $doc->appendChild($newRoot);
        $node = $dom->firstChild;

        while ($node != null) {
            $myNode = $doc->importNode($node, true);
            switch ($myNode->nodeName) {
                case "h1":
                case "h2":
                case "h3":
                    $container = $doc->createElement("div");
                    $container->appendChild($myNode);

                    if (!is_null($node->nextSibling)) {
                        do {
                            $node = $node->nextSibling;
                        } while (!($node instanceof \DOMElement));

                        $myNode = $doc->importNode($node, true);
                    }

                    $container->appendChild($myNode);
                    $newRoot->appendChild($container);
                    break;
                default:
                    $newRoot->appendChild($myNode);
                    break;
            }
            $node = $node->nextSibling;
        }
        return $doc->saveHTML();
    }
}
