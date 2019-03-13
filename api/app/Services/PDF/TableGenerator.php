<?php

namespace App\Services\PDF;

use Carbon\Carbon;

/**
 * the TableGenerator class provides a twig function called tableGen
 * the tableGen function works based on 5 arrays.
 */
class TableGenerator
{
    /**
     * generate
     *
     * @param array $tableConf
     *  configs for the table, thead, tbody, tfooter and the tfooter tr tags.
     * @param array $headers
     *  the th's of the table and their configs
     * @param array $rows
     *  the array or collection which should be used to generate the tr's of the tbody
     * @param array $colConfs
     *  the configs of the tbody td
     * @param array $footer
     *  the tfooter's td and config
     *
     * @return string the generated table
     */
    public static function generate(
        $tableConf = [],
        $headers = [],
        $rows = [],
        $colConfs = [],
        $footer = []
    ) {
        $headerString = self::createHeader($headers, $tableConf);
        $rowString = self::createRows($rows, $colConfs, $tableConf);
        $footerString = self::createFooter($footer, $tableConf);

        return self::stitchTable($tableConf, $headerString, $rowString, $footerString);
    }

    /**
     * create the string of the thead
     *
     * @param array $headers
     *  the headers array has the base setup of <title>: {<conf>}
     *  possible arguments for the <conf> are:
     *  attr: {<attributeName>: <attributeVal>, [<attributeName2>: <attributeVal2>,...]} -> all html attributes are possible
     * @param array $tableConf
     *  if the thead needs to be customised, it can be done by adding "thead": {<conf>} to the $tableConf array
     *  the same arguments for <conf> are possible as in the $headers array
     * @return string
     */
    private static function createHeader($headers, $tableConf)
    {
        if (empty($headers)) {
            return "";
        }

        $headerString = self::buildTag(
            $tableConf['thead'] ?? [],
            'thead',
            self::buildTag(
                [],
                'tr',
                function () use ($headers) {
                    $trString = "";
                    foreach ($headers as $title => $conf) {
                        $trString .= self::buildTag($conf['attr'] ?? [], "th", $title);
                    }
                    return $trString;
                }
            )
        );

        return $headerString;
    }

    /**
     * create the string of the tbody
     *
     * @param array $rows
     *  a collection or array containig the elements with which should be used to generate the tbody rows
     * @param [type] $colConfs
     *  the $rows array has the base setup of <path>: {<conf>}
     *  <path> defines the position of the wanted attribute relative to the $rows children
     *  possible arguments for the <conf> are:
     *  attr: {<attributeName>: <attributeVal>, [<attributeName2>: <attributeVal2>,...]} -> all html attributes are possible
     *  format: <format> -> format used to format for exampl ecurrency and percentages. To add a format include it in TableGenerator::formatContent
     * @return string the string of the generated rows
     */
    private static function createRows($rows, $colConfs, $tableConf)
    {
        if (empty($rows)) {
            return "";
        }

        $tbodyString = self::buildTag(
            $tableConf['tbody'] ?? [],
            'tbody',
            function () use ($rows, $colConfs) {
                $tbodyString = "";

                $rowNr = 0;
                foreach ($rows as $row) {
                    $tbodyString .= self::buildTag(
                        [],
                        'tr',
                        function () use ($row, $rowNr, $colConfs) {
                            $rowString = "";

                            foreach ($colConfs as $path => $conf) {
                                $rowString .= self::buildTag(
                                    $conf['attr'] ?? [],
                                    'td',
                                    self::formatContent(
                                        self::loadContent($row, $path),
                                        $conf['format'] ?? ""
                                    )
                                );
                            }

                            return $rowString;
                        }
                    );
                    $rowNr++;
                }
                
                return $tbodyString;
            }
        );

        return $tbodyString;
    }

    /**
     * create the string of the tfoot
     *
     * @param [type] $colConfs
     *  the $rows array has the base setup of <content>: {<conf>}
     *  possible arguments for the <conf> are:
     *  attr: {<attributeName>: <attributeVal>, [<attributeName2>: <attributeVal2>,...]} -> all html attributes are possible
     *  format: <format> -> format used to format for exampl ecurrency and percentages. To add a format include it in TableGenerator::formatContent
     * @param array $tableConf
     *  if the tfoot or one of the tfoot tr needs to be customised, it can be done by adding "tfoot": {<conf>} or
     *  "tfoot-tr-#": {<conf>} (# is the number of the tr starting by 0) to the $tableConf array
     *  the same arguments for <conf> are possible as in the $headers array
     * @return string the string of the generated rows
     */
    private static function createFooter($footer, $tableConf)
    {
        if (empty($footer)) {
            return "";
        }

        $footerString = self::buildTag(
            $tableConf['tfoot'] ?? [],
            'tfoot',
            function () use ($footer, $tableConf) {
                $footRowString = "";
                foreach ($footer as $key => $foot) {
                    $footRowString .= self::buildTag(
                        $tableConf['tfoot-tr-'.$key] ?? [],
                        'tr',
                        function () use ($foot) {
                            $trString = "";
                            foreach ($foot as $content => $conf) {
                                $trString .= self::buildTag(
                                    $conf['attr'] ?? [],
                                    "td",
                                    self::formatContent(
                                        $content,
                                        $conf['format'] ?? ""
                                    )
                                );
                            }
                            return $trString;
                        }
                    );
                }
                return $footRowString;
            }
        );

        return $footerString;
    }

    /**
     * as the name implies this function does nothing other than stitch the various parts together to one string
     *
     * @param [type] $tableConf
     *  if the table tag needs to be costumized it can be done by adding a
     *  "table": {<conf>} into the $tableConfig array
     *  possible parameters for the conf are the same as for thead
     * @param [type] $headerString
     *  the string of the thead
     * @param [type] $rowsString
     *  the string of the tbody
     * @param [type] $footerString
     *  the string of the tfoot
     * @return string
     */
    private static function stitchTable($tableConf, $headerString, $rowsString, $footerString)
    {
        return self::buildTag(
            $tableConf['table'],
            'table',
            $headerString.$rowsString.$footerString
        );
    }

    /**
     * Build a simple html tag with content
     *
     * @param array           $params  the params of the tag
     * @param string          $tagBase the tag which should be built
     * @param callback|string $content the content the content of the tag, either a string or a callback
     *
     * @return string the built tag
     */
    private static function buildTag(array $params = [], string $tagBase = "", $content = "")
    {
        $tagString = "<$tagBase";

        foreach ($params as $key => $param) {
            $tagString .= " $key=\"$param\"";
        }

        $tagString .= '>';
        if (is_string($content)) {
            $tagString .= $content;
        } elseif (is_callable($content)) {
            $tagString .= call_user_func($content);
        }
        $tagString .= "</$tagBase>";

        return $tagString;
    }

    private static function loadContent($object, $path)
    {
        if (is_null($object)) {
            return "";
        }
        
        $splits = explode('.', $path);

        if (count($splits) > 1) {
            $newObject = self::traverseLayer($object, $splits[0]);
            array_shift($splits);
            $newPath = implode('.', $splits);

            return self::loadContent($newObject, $newPath);
        } else {
            return self::traverseLayer($object, $path);
        }
    }

    private static function traverseLayer($object, $path)
    {
        if (is_object($object)) {
            return $object->{$path};
        } elseif (is_array($object)) {
            return $object[$path];
        } else {
            throw new \Exception("Neither object nor array, not traversavble");
        }
    }

    /**
     * format the string based upon the provided format type
     *
     * @param mixed $content the data to be formated
     * @param string $format the format type
     *
     * @return string the formated data
     */
    private static function formatContent($content, $format): string
    {
        switch ($format) {
            case 'chf':
                return \number_format(round(($content / 100 + 0.000001) * 20) / 20, 2, '.', "'");
                break;
            case 'money':
                return \number_format($content / 100, 2, '.', "'");
                break;
            
            case 'cast0':
                return \number_format($content, 0, '.', "'");
                break;

            case 'cast1':
                return \number_format($content, 1, '.', "'");
                break;

            case 'percent':
                return $content * 100 . "%";
                break;

            case 'date':
                return Carbon::parse($content)->format('d.m.Y');
                break;

            default:
                return is_null($content) ? '' : $content;
                break;
        }
    }
}
